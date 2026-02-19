import prisma from "../config/database.js";

const getEmployerByUser = async (userId) => {
  const employer = await prisma.employer.findUnique({
    where: { userId },
  });
  if (!employer) throw new Error("Employer profile not found");
  return employer;
};

export const getProfile = async (req, res, next) => {
  try {
    const employer = await getEmployerByUser(req.user.id);
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { email: true },
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
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const employer = await getEmployerByUser(req.user.id);
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
    const employer = await getEmployerByUser(req.user.id);
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
    const employer = await getEmployerByUser(req.user.id);
    const jobOrders = await prisma.jobOrder.findMany({
      where: { employerId: employer.id },
      select: { id: true },
    });
    const jobOrderIds = jobOrders.map((j) => j.id);
    const applications = await prisma.application.findMany({
      where: { jobOrderId: { in: jobOrderIds } },
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
        jobOrder: { select: { id: true, title: true } },
      },
    });
    const byApplicant = new Map();
    for (const app of applications) {
      const pid = app.applicantId;
      if (!byApplicant.has(pid)) {
        const a = app.applicant;
        const name = [a?.firstName, a?.lastName].filter(Boolean).join(" ") || "Applicant";
        const cv = (a?.aiGeneratedCV && typeof a.aiGeneratedCV === "object") ? a.aiGeneratedCV : {};
        const skills = cv.skills || cv.skillTags || [];
        byApplicant.set(pid, {
          id: a?.id,
          name,
          position: app.jobOrder?.title,
          location: a?.nationality || "",
          nationality: a?.nationality || "",
          experience: cv.experience?.length ? `${cv.experience.length}+ years` : "—",
          experienceYears: (cv.experience && cv.experience.length) ? cv.experience.length : 0,
          skills,
          status: app.status.toLowerCase(),
          rating: 4,
          matched: true,
          aiRecommended: (app.aiMatchScore || 0) >= 80,
          availability: "immediate",
        });
      }
    }
    const data = Array.from(byApplicant.values());
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getCandidateById = async (req, res, next) => {
  try {
    const employer = await getEmployerByUser(req.user.id);
    const jobOrderIds = (
      await prisma.jobOrder.findMany({
        where: { employerId: employer.id },
        select: { id: true },
      })
    ).map((j) => j.id);
    const application = await prisma.application.findFirst({
      where: {
        applicantId: req.params.id,
        jobOrderId: { in: jobOrderIds },
      },
      include: {
        applicant: true,
        jobOrder: true,
      },
    });
    if (!application) {
      return res.status(404).json({ success: false, message: "Candidate not found" });
    }
    const a = application.applicant;
    const cv = (a?.aiGeneratedCV && typeof a.aiGeneratedCV === "object") ? a.aiGeneratedCV : {};
    res.json({
      success: true,
      data: {
        id: a.id,
        name: [a.firstName, a.lastName].filter(Boolean).join(" ") || "Applicant",
        position: application.jobOrder?.title,
        email: null,
        phone: a.phone,
        location: a.nationality,
        experience: cv.experience?.length ? `${cv.experience.length}+ years` : "—",
        skills: cv.skills || cv.skillTags || [],
        certifications: cv.certifications || [],
        matchScore: application.aiMatchScore || 0,
        rating: 4,
        interviewNotes: application.interviewNotes,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getInterviews = async (req, res, next) => {
  try {
    const employer = await getEmployerByUser(req.user.id);
    const jobOrderIds = (
      await prisma.jobOrder.findMany({
        where: { employerId: employer.id },
        select: { id: true },
      })
    ).map((j) => j.id);
    const applications = await prisma.application.findMany({
      where: {
        jobOrderId: { in: jobOrderIds },
        status: { in: ["SHORTLISTED", "INTERVIEWED", "SELECTED", "PROCESSING", "DEPLOYED"] },
      },
      include: {
        applicant: { select: { id: true, firstName: true, lastName: true } },
        jobOrder: { select: { id: true, title: true } },
      },
    });
    const data = applications.map((app) => ({
      id: app.id,
      applicationId: app.id,
      candidateName: [app.applicant?.firstName, app.applicant?.lastName].filter(Boolean).join(" ") || "Candidate",
      position: app.jobOrder?.title,
      date: app.interviewedAt || app.shortlistedAt || app.createdAt,
      time: "—",
      type: "video",
      status: app.interviewedAt ? "completed" : "scheduled",
      videoLink: app.videoInterviewUrl || `https://meet.legaforce.com/${app.id}`,
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
    const employer = await getEmployerByUser(req.user.id);
    const jobOrderIds = (
      await prisma.jobOrder.findMany({
        where: { employerId: employer.id },
        select: { id: true },
      })
    ).map((j) => j.id);
    const application = await prisma.application.findFirst({
      where: {
        id: req.params.applicationId,
        jobOrderId: { in: jobOrderIds },
      },
    });
    if (!application) {
      return res.status(404).json({ success: false, message: "Interview not found" });
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
    const employer = await getEmployerByUser(req.user.id);
    const jobOrderIds = (
      await prisma.jobOrder.findMany({
        where: { employerId: employer.id },
        select: { id: true },
      })
    ).map((j) => j.id);
    const application = await prisma.application.findFirst({
      where: {
        id: req.params.applicationId,
        jobOrderId: { in: jobOrderIds },
      },
    });
    if (!application) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }
    res.json({ success: true, data: { shared: true } });
  } catch (err) {
    next(err);
  }
};

export const getDocuments = async (req, res, next) => {
  try {
    const employer = await getEmployerByUser(req.user.id);
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

export const uploadDocument = async (req, res, next) => {
  try {
    const employer = await getEmployerByUser(req.user.id);
    const name = req.body?.name || req.file?.originalname || "Document";
    const existing = Array.isArray(employer.verificationDocs)
      ? employer.verificationDocs
      : employer.verificationDocs
        ? [employer.verificationDocs]
        : [];
    const newDoc = {
      id: `DOC-${Date.now()}`,
      name,
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
        { item: "Placement fee (per worker)", amount: 500, unit: "USD", note: "One-time" },
        { item: "Document verification", amount: 50, unit: "USD", note: "Per batch" },
        { item: "Video interview slot", amount: 0, unit: "—", note: "Unlimited included" },
        { item: "Priority sourcing (optional)", amount: 200, unit: "USD", note: "Per job order" },
      ],
    };
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getUpcomingInterviews = async (req, res, next) => {
  try {
    const employer = await getEmployerByUser(req.user.id);
    const jobOrderIds = (
      await prisma.jobOrder.findMany({
        where: { employerId: employer.id },
        select: { id: true },
      })
    ).map((j) => j.id);
    const applications = await prisma.application.findMany({
      where: {
        jobOrderId: { in: jobOrderIds },
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
      candidateName: [a.applicant?.firstName, a.applicant?.lastName].filter(Boolean).join(" "),
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
    const employer = await getEmployerByUser(req.user.id);
    const jobOrderIds = (
      await prisma.jobOrder.findMany({
        where: { employerId: employer.id },
        select: { id: true },
      })
    ).map((j) => j.id);
    const applications = await prisma.application.findMany({
      where: { jobOrderId: { in: jobOrderIds } },
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
      const name = [a?.firstName, a?.lastName].filter(Boolean).join(" ") || "Applicant";
      const cv = (a?.aiGeneratedCV && typeof a.aiGeneratedCV === "object") ? a.aiGeneratedCV : {};
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
    const employer = await getEmployerByUser(req.user.id);
    const jobOrderIds = (
      await prisma.jobOrder.findMany({
        where: { employerId: employer.id },
        select: { id: true },
      })
    ).map((j) => j.id);
    const count = await prisma.application.count({
      where: { jobOrderId: { in: jobOrderIds } },
    });
    res.json({ success: true, data: count });
  } catch (err) {
    next(err);
  }
};

export const getJobOrderCount = async (req, res, next) => {
  try {
    const employer = await getEmployerByUser(req.user.id);
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
    const employer = await getEmployerByUser(req.user.id);
    const jobOrderIds = (
      await prisma.jobOrder.findMany({
        where: { employerId: employer.id },
        select: { id: true },
      })
    ).map((j) => j.id);
    const count = await prisma.application.count({
      where: {
        jobOrderId: { in: jobOrderIds },
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
    const employer = await getEmployerByUser(req.user.id);
    const jobOrderIds = (
      await prisma.jobOrder.findMany({
        where: { employerId: employer.id },
        select: { id: true },
      })
    ).map((j) => j.id);
    const count = await prisma.application.count({
      where: {
        jobOrderId: { in: jobOrderIds },
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
    const employer = await getEmployerByUser(req.user.id);
    const [jobCount, candidateCount, interviewCount, deployedCount] = await Promise.all([
      prisma.jobOrder.count({ where: { employerId: employer.id, status: "ACTIVE" } }),
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
    const employer = await getEmployerByUser(req.user.id);
    const { title, description, requirements, salary, location, positions, status } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({ success: false, message: "Title, description, and location are required" });
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
    const employer = await getEmployerByUser(req.user.id);
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
      return res.status(404).json({ success: false, message: "Job order not found" });
    }

    // Transform applications into candidates for the frontend
    const candidates = jobOrder.applications.map((app) => {
      const a = app.applicant;
      return {
        id: app.id,
        applicantId: a?.id,
        name: [a?.firstName, a?.lastName].filter(Boolean).join(" ") || "Applicant",
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
    const employer = await getEmployerByUser(req.user.id);
    const existing = await prisma.jobOrder.findFirst({
      where: { id: req.params.id, employerId: employer.id },
    });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Job order not found" });
    }

    const { title, description, requirements, salary, location, positions, status } = req.body;
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
    const employer = await getEmployerByUser(req.user.id);
    const existing = await prisma.jobOrder.findFirst({
      where: { id: req.params.id, employerId: employer.id },
    });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Job order not found" });
    }

    await prisma.jobOrder.delete({ where: { id: existing.id } });
    res.json({ success: true, message: "Job order deleted" });
  } catch (err) {
    next(err);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const employer = await getEmployerByUser(req.user.id);
    const jobOrderIds = (
      await prisma.jobOrder.findMany({
        where: { employerId: employer.id },
        select: { id: true },
      })
    ).map((j) => j.id);

    const application = await prisma.application.findFirst({
      where: {
        id: req.params.applicationId,
        jobOrderId: { in: jobOrderIds },
      },
    });
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    const { status, notes } = req.body;
    const validStatuses = ["APPLIED", "SHORTLISTED", "INTERVIEWED", "SELECTED", "PROCESSING", "DEPLOYED", "REJECTED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const data = { status };
    if (status === "SHORTLISTED" && !application.shortlistedAt) data.shortlistedAt = new Date();
    if (status === "INTERVIEWED" && !application.interviewedAt) data.interviewedAt = new Date();
    if (status === "SELECTED" && !application.selectedAt) data.selectedAt = new Date();
    if (status === "DEPLOYED" && !application.deployedAt) data.deployedAt = new Date();
    if (notes) data.interviewNotes = notes;

    const updated = await prisma.application.update({
      where: { id: application.id },
      data,
      include: {
        applicant: { select: { firstName: true, lastName: true } },
        jobOrder: { select: { title: true } },
      },
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};
