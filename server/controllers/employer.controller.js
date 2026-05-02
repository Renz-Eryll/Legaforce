import prisma from "../config/database.js";
import {
  sendStatusChangeEmail,
  sendInvoiceEmail,
} from "../services/email.service.js";
import { notifyApplicationStatusChange } from "../services/notification.service.js";
import { computeAIMatchScore } from "../services/openai.service.js";

// Use employer already loaded by auth middleware — zero extra DB queries
const getEmployerFromReq = (req) => {
  const employer = req.user.employer;
  if (!employer) {
    const err = new Error("Employer profile not found");
    err.statusCode = 404;
    throw err;
  }
  return employer;
};

export const getProfile = async (req, res, next) => {
  try {
    const employer = getEmployerFromReq(req);
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { email: true },
    });
    const ratings = await prisma.employerRating.findMany({
      where: { employerId: employer.id },
      include: {
        applicant: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    res.json({
      success: true,
      data: {
        ...employer,
        email: user?.email,
        companyName: employer.companyName,
        verificationStatus: employer.isVerified ? "approved" : "pending",
        documents: Array.isArray(employer.verificationDocs)
          ? employer.verificationDocs
          : employer.verificationDocs
            ? [employer.verificationDocs]
            : [],
        ratings: ratings.map((r) => ({
          id: r.id,
          rating: r.rating,
          review: r.review,
          createdAt: r.createdAt,
          workerName: `${r.applicant.firstName} ${r.applicant.lastName}`,
        })),
        totalRatings: await prisma.employerRating.count({ where: { employerId: employer.id } }),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const employer = getEmployerFromReq(req);
    const { companyName, contactPerson, phone, country, clientType } = req.body;
    const data = {};
    if (companyName != null) data.companyName = companyName;
    if (contactPerson != null) data.contactPerson = contactPerson;
    if (phone != null) data.phone = phone;
    if (country != null) data.country = country;
    const updated = await prisma.employer.update({
      where: { id: employer.id },
      data,
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const getJobOrders = async (req, res, next) => {
  try {
    const employer = getEmployerFromReq(req);
    const status = req.query.status;
    const where = { employerId: employer.id };
    if (status) where.status = status;
    const orders = await prisma.jobOrder.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

export const getCandidates = async (req, res, next) => {
  try {
    const employer = getEmployerFromReq(req);
    // Smart Candidate Search — filter params from query string
    const { search, skills: skillsFilter, experience: expFilter, nationality: natFilter, availability: availFilter, status: statusFilter, aiOnly } = req.query;

    // Use relational filter — no sub-query for jobOrderIds
    const appWhere = { jobOrder: { employerId: employer.id } };
    if (statusFilter) appWhere.status = statusFilter.toUpperCase();

    const applications = await prisma.application.findMany({
      where: appWhere,
      include: {
        applicant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            nationality: true,
            trustScore: true,
            rewardPoints: true,
            aiGeneratedCV: true,
          },
        },
        jobOrder: { select: { id: true, title: true, requirements: true } },
      },
    });

    const byApplicant = new Map();
    for (const app of applications) {
      const pid = app.applicantId;
      if (!byApplicant.has(pid)) {
        const a = app.applicant;
        const name =
          [a?.firstName, a?.lastName].filter(Boolean).join(" ") || "Applicant";
        const cv =
          a?.aiGeneratedCV && typeof a.aiGeneratedCV === "object"
            ? a.aiGeneratedCV
            : {};
        const skills = cv.skills || cv.skillTags || [];

        // Use stored aiMatchScore, or compute on-the-fly
        let matchScore = app.aiMatchScore;
        let matchReason = "";

        if (matchScore === null || matchScore === undefined) {
          try {
            const jobReq = app.jobOrder?.requirements || {};
            const reqSkills = Array.isArray(jobReq)
              ? jobReq
              : Array.isArray(jobReq?.skills)
                ? jobReq.skills
                : [];

            if (skills.length > 0 && reqSkills.length > 0) {
              const aiResult = await computeAIMatchScore(
                skills,
                reqSkills,
                app.jobOrder?.title,
              );
              matchScore = aiResult.score;
              matchReason = aiResult.reason || "";

              // Persist the score for future reads
              prisma.application
                .update({
                  where: { id: app.id },
                  data: { aiMatchScore: matchScore },
                })
                .catch(() => {}); // fire-and-forget
            }
          } catch {
            // AI matching is best-effort
          }
        }

        byApplicant.set(pid, {
          id: a?.id,
          name,
          position: app.jobOrder?.title,
          location: a?.nationality || "",
          nationality: a?.nationality || "",
          experience: cv.experience?.length
            ? `${cv.experience.length}+ years`
            : "—",
          experienceYears:
            cv.experience && cv.experience.length ? cv.experience.length : 0,
          skills,
          status: app.status.toLowerCase(),
          matchScore: matchScore ?? null,
          matchReason,
          rating: 4,
          matched: (matchScore || 0) > 0,
          aiRecommended: (matchScore || 0) >= 70,
          availability: "immediate",
          trustScore: a?.trustScore || 50,
        });
      }
    }
    let data = Array.from(byApplicant.values());

    // ── Smart Candidate Search Filters ──
    // Text search (name, position, skills)
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(c =>
        c.name.toLowerCase().includes(q) ||
        (c.position || "").toLowerCase().includes(q) ||
        c.skills.some(s => s.toLowerCase().includes(q))
      );
    }
    // Skills filter (comma-separated)
    if (skillsFilter) {
      const wanted = skillsFilter.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
      if (wanted.length > 0) {
        data = data.filter(c =>
          wanted.some(w => c.skills.some(s => s.toLowerCase().includes(w)))
        );
      }
    }
    // Experience filter (e.g. "3" means >=3 years)
    if (expFilter) {
      const minYears = parseInt(expFilter, 10);
      if (!isNaN(minYears)) {
        data = data.filter(c => (c.experienceYears || 0) >= minYears);
      }
    }
    // Nationality filter
    if (natFilter) {
      const nat = natFilter.toLowerCase();
      data = data.filter(c => (c.nationality || "").toLowerCase().includes(nat));
    }
    // AI-only filter
    if (aiOnly === "true") {
      data = data.filter(c => c.aiRecommended);
    }

    // Sort by match score descending, then by trust score descending
    data.sort((a, b) => {
      const matchDiff = (b.matchScore || 0) - (a.matchScore || 0);
      if (matchDiff !== 0) return matchDiff;
      return (b.trustScore || 50) - (a.trustScore || 50);
    });

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getCandidateById = async (req, res, next) => {
  try {
    const employer = getEmployerFromReq(req);
    // Use relational filter instead of sub-query
    const application = await prisma.application.findFirst({
      where: {
        applicantId: req.params.id,
        jobOrder: { employerId: employer.id },
      },
      include: {
        applicant: {
          include: {
            documents: true,
            user: { select: { email: true } }
          }
        },
        jobOrder: true,
      },
    });
    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Candidate not found" });
    }

    // Increment profile views when employer checks their profile
    await prisma.profile
      .update({
        where: { id: application.applicantId },
        data: { profileViews: { increment: 1 } },
      })
      .catch((err) => console.error("Failed to increment view count:", err));

    const a = application.applicant;
    const cv =
      a?.aiGeneratedCV && typeof a.aiGeneratedCV === "object"
        ? a.aiGeneratedCV
        : {};
    res.json({
      success: true,
      data: {
        id: a.id,
        applicationId: application.id,
        status: application.status,
        name:
          [a.firstName, a.lastName].filter(Boolean).join(" ") || "Applicant",
        position: application.jobOrder?.title,
        email: a.user?.email || null,
        phone: a.phone,
        location: a.nationality,
        experience: cv.experience?.length
          ? `${cv.experience.length}+ years`
          : "—",
        skills: cv.skills || cv.skillTags || [],
        certifications: cv.certifications || [],
        documents: a.documents || [],
        matchScore: application.aiMatchScore || 0,
        rating: application.applicantRating || 0,
        trustScore: a.trustScore || 50,
        interviewNotes: application.interviewNotes,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getInterviews = async (req, res, next) => {
  try {
    const employer = getEmployerFromReq(req);
    const applications = await prisma.application.findMany({
      where: {
        jobOrder: { employerId: employer.id },
        status: {
          in: [
            "SHORTLISTED",
            "INTERVIEWED",
            "SELECTED",
            "PROCESSING",
            "DEPLOYED",
          ],
        },
      },
      include: {
        applicant: { select: { id: true, firstName: true, lastName: true } },
        jobOrder: { select: { id: true, title: true } },
      },
    });
    const data = applications.map((app) => ({
      id: app.id,
      applicationId: app.id,
      candidateName:
        [app.applicant?.firstName, app.applicant?.lastName]
          .filter(Boolean)
          .join(" ") || "Candidate",
      position: app.jobOrder?.title,
      date: app.interviewedAt || app.shortlistedAt || app.createdAt,
      time: "—",
      type: "video",
      status: app.interviewedAt ? "completed" : "scheduled",
      videoLink:
        app.videoInterviewUrl || `https://meet.legaforce.com/${app.id}`,
      rating: null,
      notes: app.interviewNotes,
      feedbackShared: false,
    }));
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const updateInterviewRating = async (req, res, next) => {
  try {
    const employer = getEmployerFromReq(req);
    const application = await prisma.application.findFirst({
      where: {
        id: req.params.applicationId,
        jobOrder: { employerId: employer.id },
      },
    });
    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Interview not found" });
    }
    const { rating, notes } = req.body;
    await prisma.application.update({
      where: { id: application.id },
      data: {
        interviewNotes: notes || application.interviewNotes,
        interviewedAt: application.interviewedAt || new Date(),
      },
    });
    res.json({ success: true, data: { rating, notes } });
  } catch (err) {
    next(err);
  }
};

export const shareInterviewFeedback = async (req, res, next) => {
  try {
    const employer = getEmployerFromReq(req);
    const application = await prisma.application.findFirst({
      where: {
        id: req.params.applicationId,
        jobOrder: { employerId: employer.id },
      },
    });
    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Interview not found" });
    }
    res.json({ success: true, data: { shared: true } });
  } catch (err) {
    next(err);
  }
};

export const getDocuments = async (req, res, next) => {
  try {
    const employer = getEmployerFromReq(req);
    const docs = Array.isArray(employer.verificationDocs)
      ? employer.verificationDocs
      : employer.verificationDocs
        ? [employer.verificationDocs]
        : [];
    res.json({ success: true, data: docs });
  } catch (err) {
    next(err);
  }
};

import { uploadFile } from "../services/upload.service.js";

export const uploadDocument = async (req, res, next) => {
  try {
    const employer = getEmployerFromReq(req);

    // req.file is set by multer middleware
    const file = req.file;
    let fileUrl = null;
    let fileKey = null;
    let fileName = req.body.name || "Document";
    let fileSize = "0 MB";
    let fileType = "document";

    if (file) {
      // Actually store the file
      const result = await uploadFile(
        file.buffer,
        file.originalname,
        "employer_docs",
        file.mimetype,
      );
      fileUrl = result.url;
      fileKey = result.key;
      fileName = file.originalname;
      fileSize = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
      fileType = file.mimetype.startsWith("image/") ? "image" : "document";
    } else if (!req.body.name) {
      return res.status(400).json({
        success: false,
        message: "A file or document name is required",
      });
    }

    const existing = Array.isArray(employer.verificationDocs)
      ? employer.verificationDocs
      : employer.verificationDocs
        ? [employer.verificationDocs]
        : [];

    const newDoc = {
      id: `DOC-${Date.now()}`,
      name: fileName,
      size: fileSize,
      type: fileType,
      url: fileUrl,
      fileKey,
      status: "pending",
      uploadedAt: new Date().toISOString().split("T")[0],
    };

    const updated = await prisma.employer.update({
      where: { id: employer.id },
      data: { verificationDocs: [...existing, newDoc] },
    });
    res.status(201).json({ success: true, data: newDoc });
  } catch (err) {
    next(err);
  }
};

export const getPricing = async (req, res, next) => {
  try {
    const data = {
      items: [
        {
          item: "Placement fee (per worker)",
          amount: 500,
          unit: "USD",
          note: "One-time",
        },
        {
          item: "Document verification",
          amount: 50,
          unit: "USD",
          note: "Per batch",
        },
        {
          item: "Video interview slot",
          amount: 0,
          unit: "—",
          note: "Unlimited included",
        },
        {
          item: "Priority sourcing (optional)",
          amount: 200,
          unit: "USD",
          note: "Per job order",
        },
      ],
    };
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getUpcomingInterviews = async (req, res, next) => {
  try {
    const employer = getEmployerFromReq(req);
    const applications = await prisma.application.findMany({
      where: {
        jobOrder: { employerId: employer.id },
        status: { in: ["SHORTLISTED", "INTERVIEWED"] },
      },
      take: 5,
      include: {
        applicant: { select: { firstName: true, lastName: true } },
        jobOrder: { select: { title: true } },
      },
    });
    const data = applications.map((a) => ({
      id: a.id,
      candidateName: [a.applicant?.firstName, a.applicant?.lastName]
        .filter(Boolean)
        .join(" "),
      position: a.jobOrder?.title,
      date: a.interviewedAt || a.createdAt,
    }));
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getRecentCandidates = async (req, res, next) => {
  try {
    const employer = getEmployerFromReq(req);
    const applications = await prisma.application.findMany({
      where: { jobOrder: { employerId: employer.id } },
      take: 5,
      include: {
        applicant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            nationality: true,
            aiGeneratedCV: true,
          },
        },
        jobOrder: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    const data = applications.map((app) => {
      const a = app.applicant;
      const name =
        [a?.firstName, a?.lastName].filter(Boolean).join(" ") || "Applicant";
      const cv =
        a?.aiGeneratedCV && typeof a.aiGeneratedCV === "object"
          ? a.aiGeneratedCV
          : {};
      return {
        id: a?.id,
        name,
        position: app.jobOrder?.title,
        location: a?.nationality || "",
        nationality: a?.nationality || "",
      };
    });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getCandidateCount = async (req, res, next) => {
  try {
    const employer = getEmployerFromReq(req);
    const count = await prisma.application.count({
      where: { jobOrder: { employerId: employer.id } },
    });
    res.json({ success: true, data: count });
  } catch (err) {
    next(err);
  }
};

export const getJobOrderCount = async (req, res, next) => {
  try {
    const employer = getEmployerFromReq(req);
    const where = { employerId: employer.id };
    if (req.query.status) where.status = req.query.status;
    const count = await prisma.jobOrder.count({ where });
    res.json({ success: true, data: count });
  } catch (err) {
    next(err);
  }
};

export const getInterviewCount = async (req, res, next) => {
  try {
    const employer = getEmployerFromReq(req);
    const count = await prisma.application.count({
      where: {
        jobOrder: { employerId: employer.id },
        status: { in: ["SHORTLISTED", "INTERVIEWED"] },
      },
    });
    res.json({ success: true, data: count });
  } catch (err) {
    next(err);
  }
};

export const getDeployedWorkerCount = async (req, res, next) => {
  try {
    const employer = getEmployerFromReq(req);
    const count = await prisma.application.count({
      where: {
        jobOrder: { employerId: employer.id },
        status: "DEPLOYED",
      },
    });
    res.json({ success: true, data: count });
  } catch (err) {
    next(err);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const employer = getEmployerFromReq(req);
    const [jobCount, candidateCount, interviewCount, deployedCount] =
      await Promise.all([
        prisma.jobOrder.count({
          where: { employerId: employer.id, status: "ACTIVE" },
        }),
        prisma.application.count({
          where: {
            jobOrder: { employerId: employer.id },
          },
        }),
        prisma.application.count({
          where: {
            jobOrder: { employerId: employer.id },
            status: { in: ["SHORTLISTED", "INTERVIEWED"] },
          },
        }),
        prisma.application.count({
          where: {
            jobOrder: { employerId: employer.id },
            status: "DEPLOYED",
          },
        }),
      ]);
    res.json({
      success: true,
      data: {
        activeJobOrders: jobCount,
        candidateCount,
        interviewCount,
        deployedCount,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ──────────────────────────────────────────────
// Job Order CRUD
// ──────────────────────────────────────────────

export const createJobOrder = async (req, res, next) => {
  try {
    const employer = getEmployerFromReq(req);
    const {
      title,
      description,
      requirements,
      salary,
      location,
      positions,
      status,
    } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and location are required",
      });
    }

    const jobOrder = await prisma.jobOrder.create({
      data: {
        employerId: employer.id,
        title,
        description,
        requirements: requirements || {},
        salary: salary ? parseFloat(salary) : null,
        location,
        positions: positions ? parseInt(positions) : 1,
        status: status || "ACTIVE",
      },
    });
    res.status(201).json({ success: true, data: jobOrder });
  } catch (err) {
    next(err);
  }
};

export const getJobOrderById = async (req, res, next) => {
  try {
    const employer = getEmployerFromReq(req);
    const jobOrder = await prisma.jobOrder.findFirst({
      where: {
        id: req.params.id,
        employerId: employer.id,
      },
      include: {
        applications: {
          include: {
            applicant: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                nationality: true,
                aiGeneratedCV: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!jobOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Job order not found" });
    }

    // Transform applications into candidates for the frontend
    const candidates = jobOrder.applications.map((app) => {
      const a = app.applicant;
      return {
        id: app.id,
        applicantId: a?.id,
        name:
          [a?.firstName, a?.lastName].filter(Boolean).join(" ") || "Applicant",
        status: app.status.toLowerCase(),
        aiMatchScore: app.aiMatchScore || 0,
        appliedAt: app.createdAt,
      };
    });

    const statusCounts = {};
    for (const app of jobOrder.applications) {
      const s = app.status;
      statusCounts[s] = (statusCounts[s] || 0) + 1;
    }

    res.json({
      success: true,
      data: {
        ...jobOrder,
        applicantCount: jobOrder.applications.length,
        candidates,
        statusCounts,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateJobOrder = async (req, res, next) => {
  try {
    const employer = getEmployerFromReq(req);
    const existing = await prisma.jobOrder.findFirst({
      where: { id: req.params.id, employerId: employer.id },
    });
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Job order not found" });
    }

    const {
      title,
      description,
      requirements,
      salary,
      location,
      positions,
      status,
    } = req.body;
    const data = {};
    if (title != null) data.title = title;
    if (description != null) data.description = description;
    if (requirements != null) data.requirements = requirements;
    if (salary != null) data.salary = parseFloat(salary);
    if (location != null) data.location = location;
    if (positions != null) data.positions = parseInt(positions);
    if (status != null) data.status = status;

    const updated = await prisma.jobOrder.update({
      where: { id: existing.id },
      data,
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteJobOrder = async (req, res, next) => {
  try {
    const employer = getEmployerFromReq(req);
    const existing = await prisma.jobOrder.findFirst({
      where: { id: req.params.id, employerId: employer.id },
    });
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Job order not found" });
    }

    await prisma.jobOrder.delete({ where: { id: existing.id } });
    res.json({ success: true, message: "Job order deleted" });
  } catch (err) {
    next(err);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const employer = getEmployerFromReq(req);
    const application = await prisma.application.findFirst({
      where: {
        id: req.params.applicationId,
        jobOrder: { employerId: employer.id },
      },
    });
    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    const { status, notes } = req.body;
    const validStatuses = [
      "APPLIED",
      "SHORTLISTED",
      "INTERVIEWED",
      "SELECTED",
      "PROCESSING",
      "DEPLOYED",
      "REJECTED",
    ];
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const data = { status };
    if (status === "SHORTLISTED" && !application.shortlistedAt) {
      data.shortlistedAt = new Date();
      // Generate a video interview link
      if (!application.videoInterviewUrl) {
        const roomId = `legaforce-${application.id.slice(-8)}-${Date.now().toString(36)}`;
        data.videoInterviewUrl = `https://meet.jit.si/${roomId}`;
      }
    }
    if (status === "INTERVIEWED" && !application.interviewedAt)
      data.interviewedAt = new Date();
    if (status === "SELECTED" && !application.selectedAt)
      data.selectedAt = new Date();
    if (status === "DEPLOYED" && !application.deployedAt)
      data.deployedAt = new Date();
    if (notes) data.interviewNotes = notes;

    const updated = await prisma.application.update({
      where: { id: application.id },
      data,
      include: {
        applicant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            userId: true,
          },
        },
        jobOrder: { select: { title: true, salary: true } },
      },
    });

    // ── Send email notification to applicant ──
    try {
      const applicantUser = await prisma.user.findUnique({
        where: { id: updated.applicant.userId },
        select: { email: true },
      });
      if (applicantUser?.email) {
        const applicantName =
          `${updated.applicant.firstName} ${updated.applicant.lastName}`.trim();
        await sendStatusChangeEmail(
          applicantUser.email,
          applicantName,
          updated.jobOrder.title,
          status,
        );
      }
    } catch (emailErr) {
      console.error("Failed to send status email:", emailErr.message);
    }

    // ── Real-time & Persistent Notification ──
    try {
      await notifyApplicationStatusChange(updated.applicant.userId, {
        status,
        jobTitle: updated.jobOrder?.title || "Job",
        companyName: employer.companyName || "Employer",
        applicationId: application.id,
      });
    } catch (notifErr) {
      console.error(
        "Failed to create notification:",
        notifErr.message,
      );
    }

    // ── Create Deployment record when SELECTED ──
    if (status === "SELECTED") {
      try {
        const existingDeployment = await prisma.deployment.findUnique({
          where: { applicationId: application.id },
        });
        if (!existingDeployment) {
          await prisma.deployment.create({
            data: { applicationId: application.id },
          });
        }
      } catch (depErr) {
        console.error("Failed to create deployment record:", depErr.message);
      }
    }

    // ── Auto-generate Invoice when DEPLOYED ──
    if (status === "DEPLOYED") {
      try {
        const invoiceCount = await prisma.invoice.count({
          where: { employerId: employer.id },
        });
        const invoiceNumber = `INV-${employer.id.slice(-4).toUpperCase()}-${String(invoiceCount + 1).padStart(4, "0")}`;
        const placementFee = updated.jobOrder.salary
          ? updated.jobOrder.salary * 0.1
          : 500;

        const invoice = await prisma.invoice.create({
          data: {
            employerId: employer.id,
            invoiceNumber,
            amount: placementFee,
            currency: "USD",
            status: "PENDING",
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            lineItems: [
              {
                item: "Placement fee",
                description: `Deployment of ${updated.applicant.firstName} ${updated.applicant.lastName} — ${updated.jobOrder.title}`,
                amount: placementFee,
              },
            ],
          },
        });

        // Increment employer total hires
        await prisma.employer.update({
          where: { id: employer.id },
          data: { totalHires: { increment: 1 } },
        });

        // Send invoice email to employer
        try {
          const employerUser = await prisma.user.findUnique({
            where: { id: employer.userId },
            select: { email: true },
          });
          if (employerUser?.email) {
            await sendInvoiceEmail(
              employerUser.email,
              employer.contactPerson || employer.companyName,
              invoiceNumber,
              placementFee,
              "USD",
            );
          }
        } catch (emailErr) {
          console.error("Failed to send invoice email:", emailErr.message);
        }
      } catch (invErr) {
        console.error("Failed to auto-generate invoice:", invErr.message);
      }
    }

    // ── Trust Score Business Logic ──
    // Applicant trust score increases as they progress through the pipeline
    try {
      const trustIncrements = {
        SHORTLISTED: 2, // Small bump for being shortlisted
        INTERVIEWED: 3, // Completed interview process
        SELECTED: 5, // Selected for deployment
        DEPLOYED: 10, // Successfully deployed
        REJECTED: -1, // Minor decrease
      };
      const increment = trustIncrements[status];
      if (increment) {
        const applicantProfile = await prisma.profile.findUnique({
          where: { id: updated.applicant.id },
          select: { trustScore: true },
        });
        const currentScore = applicantProfile?.trustScore || 50;
        const newScore = Math.max(0, Math.min(100, currentScore + increment));
        await prisma.profile.update({
          where: { id: updated.applicant.id },
          data: { trustScore: newScore },
        });
      }
    } catch (trustErr) {
      console.error("Failed to update trust score:", trustErr.message);
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// ──────────────────────────────────────────────
// Deployments (workers in SELECTED/PROCESSING/DEPLOYED stage)
// ──────────────────────────────────────────────

export const getDeployments = async (req, res, next) => {
  try {
    const employer = getEmployerFromReq(req);
    const applications = await prisma.application.findMany({
      where: {
        jobOrder: { employerId: employer.id },
        status: { in: ["SELECTED", "PROCESSING", "DEPLOYED"] },
      },
      include: {
        applicant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            nationality: true,
          },
        },
        jobOrder: { select: { title: true, location: true } },
        deployment: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    const data = applications.map((app) => ({
      id: app.id,
      workerName:
        [app.applicant?.firstName, app.applicant?.lastName]
          .filter(Boolean)
          .join(" ") || "Worker",
      position: app.jobOrder?.title || "—",
      destination: app.jobOrder?.location || "—",
      location: app.jobOrder?.location || "—",
      status: app.status,
      deployedAt: app.deployedAt,
      selectedAt: app.selectedAt,
      // Compliance from deployment record
      medicalStatus: app.deployment?.medicalStatus || "PENDING",
      visaStatus: app.deployment?.visaStatus || "PENDING",
      oecStatus: app.deployment?.oecStatus || "PENDING",
      flightDate: app.deployment?.flightDate,
      arrivalDate: app.deployment?.arrivalDate,
    }));

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// ──────────────────────────────────────────────
// Invoices
// ──────────────────────────────────────────────

export const getInvoices = async (req, res, next) => {
  try {
    const employer = getEmployerFromReq(req);
    const where = { employerId: employer.id };
    if (req.query.status) where.status = req.query.status;

    const invoices = await prisma.invoice.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const data = invoices.map((inv) => ({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      amount: inv.amount,
      currency: inv.currency,
      status: inv.status,
      dueDate: inv.dueDate,
      paidAt: inv.paidAt,
      lineItems: inv.lineItems,
      description: Array.isArray(inv.lineItems)
        ? inv.lineItems
            .map((li) => li.description || li.item)
            .filter(Boolean)
            .join(", ")
        : "Recruitment services",
      createdAt: inv.createdAt,
    }));

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// ──────────────────────────────────────────────
// Reports (hiring funnel analytics)
// ──────────────────────────────────────────────

export const getReports = async (req, res, next) => {
  try {
    const employer = getEmployerFromReq(req);

    // Get application counts by status using relational filter
    const statusCounts = await prisma.application.groupBy({
      by: ["status"],
      where: { jobOrder: { employerId: employer.id } },
      _count: true,
    });

    const byStatus = Object.fromEntries(
      statusCounts.map((c) => [c.status, c._count]),
    );

    const totalApplications = Object.values(byStatus).reduce(
      (a, b) => a + b,
      0,
    );

    // Job order stats
    const jobStatusCounts = await prisma.jobOrder.groupBy({
      by: ["status"],
      where: { employerId: employer.id },
      _count: true,
    });
    const jobsByStatus = Object.fromEntries(
      jobStatusCounts.map((c) => [c.status, c._count]),
    );

    res.json({
      success: true,
      data: {
        totalApplications,
        applicationsByStatus: byStatus,
        jobsByStatus,
        totalJobOrders: jobStatusCounts.reduce((sum, c) => sum + c._count, 0),
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── Dashboard Analytics (charts) ───────────────

export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const employer = getEmployerFromReq(req);

    // Last 6 calendar months
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() - i);
      months.push({
        label: d.toLocaleString("default", { month: "short" }),
        start: new Date(d.getFullYear(), d.getMonth(), 1),
        end: new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59),
      });
    }

    // Job orders posted vs hires per month (scoped to this employer)
    const trendResults = await Promise.all(
      months.map(({ start, end }) =>
        Promise.all([
          prisma.jobOrder.count({
            where: {
              employerId: employer.id,
              createdAt: { gte: start, lte: end },
            },
          }),
          prisma.application.count({
            where: {
              jobOrder: { employerId: employer.id },
              status: "DEPLOYED",
              updatedAt: { gte: start, lte: end },
            },
          }),
        ]),
      ),
    );

    const trend = months.map(({ label }, i) => ({
      month: label,
      posted: trendResults[i][0],
      hired: trendResults[i][1],
    }));

    // Candidate pipeline — all applications for this employer, grouped by status
    const pipelineRows = await prisma.application.groupBy({
      by: ["status"],
      where: { jobOrder: { employerId: employer.id } },
      _count: { id: true },
    });

    const statusOrder = [
      "APPLIED",
      "SHORTLISTED",
      "INTERVIEWED",
      "SELECTED",
      "DEPLOYED",
    ];
    const colorMap = {
      APPLIED: "#64748b",
      SHORTLISTED: "#06b6d4",
      INTERVIEWED: "#8b5cf6",
      SELECTED: "#f59e0b",
      DEPLOYED: "#10b981",
    };
    const pipeline = pipelineRows
      .sort(
        (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status),
      )
      .map((r) => ({
        stage: r.status.charAt(0) + r.status.slice(1).toLowerCase(),
        count: r._count.id,
        fill: colorMap[r.status] || "#64748b",
      }));

    res.json({ success: true, data: { trend, pipeline } });
  } catch (err) {
    next(err);
  }
};

// ── Employer rates Applicant ──────────────────
export const rateApplicant = async (req, res, next) => {
  try {
    const employer = getEmployerFromReq(req);
    const { applicantId, rating, review } = req.body;

    if (
      !applicantId ||
      typeof rating !== "number" ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid applicantId and rating (1-5) are required",
      });
    }

    // Verify the employer has a late-stage application with this applicant
    const application = await prisma.application.findFirst({
      where: {
        applicantId,
        jobOrder: { employerId: employer.id },
        status: { in: ["INTERVIEWED", "SELECTED", "PROCESSING", "DEPLOYED"] },
      },
    });

    if (!application) {
      return res.status(403).json({
        success: false,
        message: "You can only rate applicants you've interviewed or hired",
      });
    }

    // Upsert the rating
    const existing = await prisma.applicantRating.findFirst({
      where: { applicantId, employerId: employer.id },
    });

    let savedRating;
    if (existing) {
      savedRating = await prisma.applicantRating.update({
        where: { id: existing.id },
        data: { rating, review },
      });
    } else {
      savedRating = await prisma.applicantRating.create({
        data: { applicantId, employerId: employer.id, rating, review },
      });
    }

    // Recalculate applicant's trust score based on employer ratings
    const allRatings = await prisma.applicantRating.findMany({
      where: { applicantId },
    });
    const avgRating =
      allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
    // Map 1-5 avg to 20-100 scale, blended with existing milestone-based score
    const ratingScore = Math.round(avgRating * 20);
    const currentProfile = await prisma.profile.findUnique({
      where: { id: applicantId },
      select: { trustScore: true },
    });
    // Blend: 60% milestone-based + 40% rating-based
    const milestoneScore = currentProfile?.trustScore || 50;
    const blendedScore = Math.round(milestoneScore * 0.6 + ratingScore * 0.4);
    const finalScore = Math.max(0, Math.min(100, blendedScore));

    await prisma.profile.update({
      where: { id: applicantId },
      data: { trustScore: finalScore },
    });

    res.json({ success: true, data: savedRating });
  } catch (err) {
    next(err);
  }
};
