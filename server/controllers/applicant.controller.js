import prisma from "../config/database.js";
import {
  generateCVSummary,
  computeAIMatchScore,
  computeEnhancedMatchScore,
} from "../services/openai.service.js";
import { sendToUser } from "../services/sse.service.js";

// Use profile already loaded by auth middleware — zero extra DB queries
const getProfileFromReq = (req) => {
  const profile = req.user.profile;
  if (!profile) {
    const err = new Error("Applicant profile not found");
    err.statusCode = 404;
    throw err;
  }
  return profile;
};

export const getProfile = async (req, res, next) => {
  try {
    const profile = getProfileFromReq(req);
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { email: true, isEmailVerified: true, isActive: true },
    });
    res.json({
      success: true,
      data: {
        ...profile,
        email: user?.email,
        isEmailVerified: user?.isEmailVerified,
        isActive: user?.isActive,
        firstName: profile.firstName,
        lastName: profile.lastName,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const profile = getProfileFromReq(req);
    const {
      firstName,
      lastName,
      phone,
      nationality,
      dateOfBirth,
      emergencyContact,
      emergencyPhone,
      // CV-related fields stored in aiGeneratedCV JSON
      bio,
      skills,
      experience,
      education,
      certifications,
    } = req.body;

    // Build update data for profile table fields
    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone;
    if (nationality !== undefined) updateData.nationality = nationality;
    if (dateOfBirth !== undefined)
      updateData.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
    if (emergencyContact !== undefined) updateData.emergencyContact = emergencyContact;
    if (emergencyPhone !== undefined) updateData.emergencyPhone = emergencyPhone;

    // Merge CV-related fields into aiGeneratedCV JSON
    const existingCV =
      profile.aiGeneratedCV && typeof profile.aiGeneratedCV === "object"
        ? profile.aiGeneratedCV
        : {};
    const cvUpdates = {};
    if (bio !== undefined) cvUpdates.summary = bio;
    if (skills !== undefined) cvUpdates.skills = skills;
    if (experience !== undefined) cvUpdates.experience = experience;
    if (education !== undefined) cvUpdates.education = education;
    if (certifications !== undefined) cvUpdates.certifications = certifications;

    if (Object.keys(cvUpdates).length > 0) {
      updateData.aiGeneratedCV = { ...existingCV, ...cvUpdates };
    }

    const updatedProfile = await prisma.profile.update({
      where: { id: profile.id },
      data: updateData,
    });

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { email: true },
    });

    res.json({
      success: true,
      data: {
        ...updatedProfile,
        email: user?.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getApplications = async (req, res, next) => {
  try {
    const profile = getProfileFromReq(req);
    const applications = await prisma.application.findMany({
      where: { applicantId: profile.id },
      include: {
        jobOrder: {
          select: {
            id: true,
            title: true,
            location: true,
            salary: true,
            status: true,
            description: true,
            requirements: true,
            employer: { select: { companyName: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    const data = applications.map((app) => ({
      id: app.id,
      status: app.status,
      aiMatchScore: app.aiMatchScore,
      shortlistedAt: app.shortlistedAt,
      interviewedAt: app.interviewedAt,
      selectedAt: app.selectedAt,
      deployedAt: app.deployedAt,
      videoInterviewUrl: app.videoInterviewUrl,
      interviewNotes: app.interviewNotes,
      createdAt: app.createdAt,
      jobOrder: app.jobOrder,
      position: app.jobOrder?.title,
      employer: app.jobOrder?.employer?.companyName,
      company: app.jobOrder?.employer?.companyName,
      location: app.jobOrder?.location,
      salary: app.jobOrder?.salary,
    }));
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getApplicationById = async (req, res, next) => {
  try {
    const profile = getProfileFromReq(req);
    const application = await prisma.application.findFirst({
      where: { id: req.params.id, applicantId: profile.id },
      include: {
        jobOrder: {
          include: {
            employer: {
              select: {
                id: true,
                companyName: true,
                phone: true,
                country: true,
                trustScore: true,
              },
            },
          },
        },
        deployment: true,
      },
    });
    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    // Check if this applicant has already rated this employer
    let existingRating = null;
    if (application.jobOrder?.employer?.id) {
      existingRating = await prisma.employerRating.findFirst({
        where: {
          employerId: application.jobOrder.employer.id,
          applicantId: profile.id,
        },
        select: { id: true, rating: true, review: true, createdAt: true },
      });
    }

    res.json({
      success: true,
      data: {
        ...application,
        employerRating: existingRating,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getComplaints = async (req, res, next) => {
  try {
    const profile = getProfileFromReq(req);
    const status = req.query.status;
    const where = { applicantId: profile.id };
    if (status) where.status = status;
    const complaints = await prisma.complaint.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: complaints });
  } catch (err) {
    next(err);
  }
};

const categoryMap = {
  employer_issue: "EMPLOYER_ISSUE",
  agency_issue: "AGENCY_ISSUE",
  deployment_delay: "DEPLOYMENT_DELAY",
  abuse: "ABUSE",
  contract_violation: "CONTRACT_VIOLATION",
  other: "OTHER",
};

export const createComplaint = async (req, res, next) => {
  try {
    const profile = getProfileFromReq(req);
    const { category, subject, description } = req.body;
    const raw = (category || "other").toLowerCase().replace(/\s+/g, "_");
    const categoryEnum = categoryMap[raw] || "OTHER";
    const complaint = await prisma.complaint.create({
      data: {
        applicantId: profile.id,
        category: categoryEnum,
        description: subject
          ? `[${subject}] ${description || ""}`
          : description || "No description",
        status: "SUBMITTED",
        escalationLevel: 1,
      },
    });

    // Award points for filing a complaint (engagement)
    await prisma.profile.update({
      where: { id: profile.id },
      data: { rewardPoints: { increment: 10 } },
    });

    res.status(201).json({ success: true, data: complaint });
  } catch (err) {
    next(err);
  }
};

export const getCV = async (req, res, next) => {
  try {
    const profile = getProfileFromReq(req);
    const cv = profile.aiGeneratedCV || null;
    res.json({ success: true, data: cv });
  } catch (err) {
    next(err);
  }
};

export const saveCV = async (req, res, next) => {
  try {
    const profile = getProfileFromReq(req);
    const payload = req.body;

    // Award points for saving CV the first time — combined into single update
    const existing =
      profile.aiGeneratedCV && typeof profile.aiGeneratedCV === "object"
        ? profile.aiGeneratedCV
        : {};
    const isFirstCV = !existing.personalInfo && payload.personalInfo;

    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        aiGeneratedCV: payload,
        ...(isFirstCV ? { rewardPoints: { increment: 100 } } : {}),
      },
    });

    res.json({ success: true, data: payload });
  } catch (err) {
    next(err);
  }
};

export const generateAICV = async (req, res, next) => {
  try {
    const profile = getProfileFromReq(req);
    const existing =
      profile.aiGeneratedCV && typeof profile.aiGeneratedCV === "object"
        ? profile.aiGeneratedCV
        : {};

    const experience = existing.experience || [];
    const skills = existing.skills || [];
    const education = existing.education || [];
    const certifications = existing.certifications || [];

    // Call Gemini for a professional CV summary (falls back to local logic)
    const aiResult = await generateCVSummary(profile, {
      experience,
      skills,
      education,
      certifications,
    });

    // Build skill tags for job matching
    const skillTags = [
      ...new Set([
        ...skills,
        ...certifications.map((c) => c.name).filter(Boolean),
      ]),
    ];

    const data = {
      ...existing,
      cvSummary: aiResult.summary,
      keyStrengths: aiResult.keyStrengths || [],
      skillTags,
      profileReady: true,
      generatedBy: aiResult.generatedBy,
      generatedAt: new Date().toISOString(),
    };

    await prisma.profile.update({
      where: { id: profile.id },
      data: { aiGeneratedCV: data },
    });

    // Award points for generating AI CV (first time only)
    if (!existing.profileReady) {
      await prisma.profile.update({
        where: { id: profile.id },
        data: { rewardPoints: { increment: 200 } },
      });
    }

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getRewardPoints = async (req, res, next) => {
  try {
    const profile = getProfileFromReq(req);
    res.json({ success: true, data: profile.rewardPoints ?? 0 });
  } catch (err) {
    next(err);
  }
};

export const getJobs = async (req, res, next) => {
  try {
    const where = { status: "ACTIVE" }; // getJobs is public-ish, no profile needed
    if (req.query.search) {
      where.OR = [
        { title: { contains: req.query.search, mode: "insensitive" } },
        { description: { contains: req.query.search, mode: "insensitive" } },
      ];
    }
    if (req.query.location)
      where.location = { contains: req.query.location, mode: "insensitive" };
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit, 10) || 12),
    );
    const [jobs, total] = await Promise.all([
      prisma.jobOrder.findMany({
        where,
        include: {
          employer: {
            select: { id: true, companyName: true, trustScore: true },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.jobOrder.count({ where }),
    ]);
    const data = jobs.map((j) => ({
      id: j.id,
      title: j.title,
      employer: j.employer?.companyName,
      employerId: j.employer?.id,
      employerTrustScore: j.employer?.trustScore || 50,
      location: j.location,
      salary: j.salary,
      positions: j.positions,
      description: j.description,
      requirements: j.requirements,
      status: j.status,
      createdAt: j.createdAt,
    }));

    // Sort by employer trust score descending (secondary sort)
    data.sort(
      (a, b) => (b.employerTrustScore || 50) - (a.employerTrustScore || 50),
    );
    res.json({ success: true, data: { items: data, total, page, limit } });
  } catch (err) {
    next(err);
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const job = await prisma.jobOrder.findFirst({
      where: { id: req.params.id, status: "ACTIVE" },
      include: {
        employer: {
          select: {
            id: true,
            companyName: true,
            country: true,
            trustScore: true,
          },
        },
      },
    });
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    res.json({
      success: true,
      data: {
        ...job,
        employer: job.employer?.companyName,
        employerId: job.employer?.id,
        employerTrustScore: job.employer?.trustScore || 50,
        country: job.employer?.country,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const applyToJob = async (req, res, next) => {
  try {
    const profile = getProfileFromReq(req);
    const jobId = req.params.id;
    const job = await prisma.jobOrder.findFirst({
      where: { id: jobId, status: "ACTIVE" },
    });
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    const existing = await prisma.application.findFirst({
      where: { applicantId: profile.id, jobOrderId: jobId },
    });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Already applied" });
    }

    // Compute AI match score using Gemini (falls back to local keyword matching)
    let matchScore = null;
    try {
      const profileCV =
        profile.aiGeneratedCV && typeof profile.aiGeneratedCV === "object"
          ? profile.aiGeneratedCV
          : {};
      const profileSkills = profileCV.skills || profileCV.skillTags || [];
      const jobReq = job.requirements || {};
      const reqSkills = Array.isArray(jobReq)
        ? jobReq
        : Array.isArray(jobReq.skills)
          ? jobReq.skills
          : [];

      const aiResult = await computeAIMatchScore(
        profileSkills,
        reqSkills,
        job.title,
      );
      matchScore = aiResult.score;
    } catch {
      // AI matching is best-effort; null score is acceptable
    }

    let application;
    try {
      application = await prisma.application.create({
        data: {
          applicantId: profile.id,
          jobOrderId: jobId,
          status: "APPLIED",
          aiMatchScore: matchScore,
        },
      });
    } catch (createErr) {
      // Unique constraint violation (race condition — two simultaneous requests)
      if (createErr.code === "P2002") {
        return res
          .status(400)
          .json({ success: false, message: "Already applied" });
      }
      throw createErr;
    }

    // Award 50 points for applying
    await prisma.profile.update({
      where: { id: profile.id },
      data: { rewardPoints: { increment: 50 } },
    });

    // Send confirmation email (Task 3.1)
    try {
      const emailService = require("../services/email.service");
      await emailService.sendStatusChangeEmail(
        profile.email,
        "APPLIED",
        job.jobTitle || job.title,
        profile.firstName || "Applicant",
      );
    } catch (emailErr) {
      console.error(
        "Non-critical: Failed to send application confirmation email",
        emailErr,
      );
    }

    res.status(201).json({ success: true, data: application });
  } catch (err) {
    next(err);
  }
};

export const getProfileCompletion = async (req, res, next) => {
  try {
    const profile = getProfileFromReq(req);
    let score = 0;
    if (profile.firstName && profile.lastName) score += 20;
    if (profile.phone) score += 15;
    if (profile.nationality) score += 15;
    if (profile.dateOfBirth) score += 10;
    if (profile.aiGeneratedCV && typeof profile.aiGeneratedCV === "object") {
      const cv = profile.aiGeneratedCV;
      if (cv.personalInfo || cv.summary) score += 10;
      if (cv.experience && cv.experience.length > 0) score += 10;
      if (cv.skills && cv.skills.length > 0) score += 10;
      if (cv.education && cv.education.length > 0) score += 5;
      if (cv.profileReady) score += 5;
    }
    res.json({ success: true, data: Math.min(100, score) });
  } catch (err) {
    next(err);
  }
};


export const getRecommendedJobs = async (req, res, next) => {
  try {
    const profile = getProfileFromReq(req);
    const cv =
      profile.aiGeneratedCV && typeof profile.aiGeneratedCV === "object"
        ? profile.aiGeneratedCV
        : {};
    const profileSkills = cv.skills || cv.skillTags || [];

    // Get applicant's existing application job IDs to exclude
    const existingApps = await prisma.application.findMany({
      where: { applicantId: profile.id },
      select: { jobOrderId: true },
    });
    const appliedJobIds = existingApps.map((a) => a.jobOrderId);

    const jobs = await prisma.jobOrder.findMany({
      where: {
        status: "ACTIVE",
        ...(appliedJobIds.length > 0 ? { id: { notIn: appliedJobIds } } : {}),
      },
      take: 12,
      include: { employer: { select: { companyName: true } } },
      orderBy: { createdAt: "desc" },
    });

    // Compute match scores for each job (parallel, with timeout)
    const scoredJobs = await Promise.all(
      jobs.map(async (j) => {
        let matchScore = null;
        let matchReason = "";
        let scoredBy = "none";

        try {
          const jobReq = j.requirements || {};
          const reqSkills = Array.isArray(jobReq)
            ? jobReq
            : Array.isArray(jobReq.skills)
              ? jobReq.skills
              : [];

          if (profileSkills.length > 0 && reqSkills.length > 0) {
            const aiResult = await computeAIMatchScore(
              profileSkills,
              reqSkills,
              j.title,
            );
            matchScore = aiResult.score;
            matchReason = aiResult.reason || "";
            scoredBy = aiResult.scoredBy || "unknown";
          } else if (profileSkills.length === 0) {
            matchScore = null;
            matchReason = "Complete your profile to see match scores";
          }
        } catch {
          // AI match is best-effort
        }

        return {
          id: j.id,
          title: j.title,
          employer: j.employer?.companyName,
          location: j.location,
          salary: j.salary,
          matchScore,
          matchReason,
          scoredBy,
          postedAt: j.createdAt,
        };
      }),
    );

    // Sort by match score descending (nulls at end)
    scoredJobs.sort((a, b) => {
      if (a.matchScore === null && b.matchScore === null) return 0;
      if (a.matchScore === null) return 1;
      if (b.matchScore === null) return -1;
      return b.matchScore - a.matchScore;
    });

    res.json({ success: true, data: scoredJobs.slice(0, 6) });
  } catch (err) {
    next(err);
  }
};

export const getSavedJobs = async (req, res, next) => {
  try {
    // Saved jobs would need a SavedJob model; for now we use the user's
    // aiGeneratedCV.savedJobs array as a lightweight JSON store
    const profile = getProfileFromReq(req);
    const cv =
      profile.aiGeneratedCV && typeof profile.aiGeneratedCV === "object"
        ? profile.aiGeneratedCV
        : {};
    const savedJobIds = Array.isArray(cv.savedJobs) ? cv.savedJobs : [];

    if (savedJobIds.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const jobs = await prisma.jobOrder.findMany({
      where: {
        id: { in: savedJobIds },
      },
      include: { employer: { select: { companyName: true } } },
    });

    const data = jobs.map((j) => ({
      id: j.id,
      title: j.title,
      employer: j.employer?.companyName,
      company: j.employer?.companyName,
      location: j.location,
      salary: j.salary,
      savedAt: j.createdAt,
    }));
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const saveJob = async (req, res, next) => {
  try {
    const profile = getProfileFromReq(req);
    const { jobId } = req.body;
    if (!jobId) {
      return res
        .status(400)
        .json({ success: false, message: "jobId required" });
    }

    const cv =
      profile.aiGeneratedCV && typeof profile.aiGeneratedCV === "object"
        ? profile.aiGeneratedCV
        : {};
    const savedJobs = Array.isArray(cv.savedJobs) ? [...cv.savedJobs] : [];

    if (!savedJobs.includes(jobId)) {
      savedJobs.push(jobId);
    }

    await prisma.profile.update({
      where: { id: profile.id },
      data: { aiGeneratedCV: { ...cv, savedJobs } },
    });

    res.json({ success: true, data: { savedJobs } });
  } catch (err) {
    next(err);
  }
};

export const unsaveJob = async (req, res, next) => {
  try {
    const profile = getProfileFromReq(req);
    const { jobId } = req.body;

    const cv =
      profile.aiGeneratedCV && typeof profile.aiGeneratedCV === "object"
        ? profile.aiGeneratedCV
        : {};
    const savedJobs = Array.isArray(cv.savedJobs)
      ? cv.savedJobs.filter((id) => id !== jobId)
      : [];

    await prisma.profile.update({
      where: { id: profile.id },
      data: { aiGeneratedCV: { ...cv, savedJobs } },
    });

    res.json({ success: true, data: { savedJobs } });
  } catch (err) {
    next(err);
  }
};

export const getMatchScore = async (req, res, next) => {
  try {
    const profile = getProfileFromReq(req);

    // Compute average match score across all applications
    const applications = await prisma.application.findMany({
      where: { applicantId: profile.id, aiMatchScore: { not: null } },
      select: { aiMatchScore: true },
    });

    if (applications.length === 0) {
      return res.json({ success: true, data: 0 });
    }

    const avgScore = Math.round(
      applications.reduce((sum, a) => sum + (a.aiMatchScore || 0), 0) /
        applications.length,
    );
    res.json({ success: true, data: avgScore });
  } catch (err) {
    next(err);
  }
};

export const getProfileViews = async (req, res, next) => {
  try {
    const profile = getProfileFromReq(req);
    // Real data directly from the DB field incremented by employers
    res.json({ success: true, data: profile.profileViews || 0 });
  } catch (err) {
    next(err);
  }
};

export const getApplicationStats = async (req, res, next) => {
  try {
    const profile = getProfileFromReq(req);
    const counts = await prisma.application.groupBy({
      by: ["status"],
      where: { applicantId: profile.id },
      _count: true,
    });
    const stats = Object.fromEntries(counts.map((c) => [c.status, c._count]));

    // Also include total
    const total = counts.reduce((sum, c) => sum + c._count, 0);
    stats.total = total;

    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};

export const getRewardHistory = async (req, res, next) => {
  try {
    const profile = getProfileFromReq(req);

    // Build reward history from profile actions
    const history = [];
    const cv =
      profile.aiGeneratedCV && typeof profile.aiGeneratedCV === "object"
        ? profile.aiGeneratedCV
        : {};

    // Check if profile was completed
    if (profile.firstName && profile.lastName && profile.phone) {
      history.push({
        action: "Profile completed",
        points: 100,
        date: profile.updatedAt,
        type: "earned",
      });
    }

    // Check if CV was generated
    if (cv.profileReady) {
      history.push({
        action: "AI CV generated",
        points: 200,
        date: cv.generatedAt || profile.updatedAt,
        type: "earned",
      });
    }

    // Count applications for reward history
    // Parallel count queries instead of sequential
    const [appCount, shortlistedCount, complaintCount] = await Promise.all([
      prisma.application.count({ where: { applicantId: profile.id } }),
      prisma.application.count({
        where: {
          applicantId: profile.id,
          status: {
            in: ["SHORTLISTED", "INTERVIEWED", "SELECTED", "DEPLOYED"],
          },
        },
      }),
      prisma.complaint.count({ where: { applicantId: profile.id } }),
    ]);

    if (appCount > 0) {
      history.push({
        action: `Applied to ${appCount} job(s)`,
        points: appCount * 50,
        date: profile.updatedAt,
        type: "earned",
      });
    }

    if (shortlistedCount > 0) {
      history.push({
        action: `Shortlisted for ${shortlistedCount} position(s)`,
        points: shortlistedCount * 100,
        date: profile.updatedAt,
        type: "earned",
      });
    }
    if (complaintCount > 0) {
      history.push({
        action: `Filed ${complaintCount} report(s)`,
        points: complaintCount * 10,
        date: profile.updatedAt,
        type: "earned",
      });
    }

    // Sort by most recent
    history.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({ success: true, data: history });
  } catch (err) {
    next(err);
  }
};

export const getRewardCatalog = async (req, res, next) => {
  try {
    // In production, this would come from a RewardCatalog table
    res.json({
      success: true,
      data: [
        {
          id: "training",
          name: "Free Online Training Course",
          cost: 800,
          type: "training",
          description: "Access to a professional skills training course",
        },
        {
          id: "priority",
          name: "Priority Application Processing",
          cost: 1000,
          type: "service",
          description: "Get your applications reviewed first",
        },
        {
          id: "discount",
          name: "Medical Exam Fee Discount",
          cost: 600,
          type: "discount",
          description: "50% off your next medical examination",
        },
        {
          id: "cv-review",
          name: "Professional CV Review",
          cost: 400,
          type: "service",
          description: "Expert review and suggestions for your CV",
        },
        {
          id: "cert-discount",
          name: "Certification Fee Support",
          cost: 1500,
          type: "discount",
          description: "Partial coverage for professional certifications",
        },
      ],
    });
  } catch (err) {
    next(err);
  }
};

export const redeemReward = async (req, res, next) => {
  try {
    const profile = getProfileFromReq(req);
    const { rewardId } = req.body;

    // Find the reward cost from catalog
    const catalog = {
      training: 800,
      priority: 1000,
      discount: 600,
      "cv-review": 400,
      "cert-discount": 1500,
    };

    const cost = catalog[rewardId];
    if (!cost) {
      return res
        .status(404)
        .json({ success: false, message: "Reward not found" });
    }

    if (profile.rewardPoints < cost) {
      return res.status(400).json({
        success: false,
        message: `Insufficient points. You have ${profile.rewardPoints} but need ${cost}.`,
      });
    }

    // Deduct points
    await prisma.profile.update({
      where: { id: profile.id },
      data: { rewardPoints: { decrement: cost } },
    });

    res.json({
      success: true,
      data: {
        message: "Reward redeemed successfully!",
        remainingPoints: profile.rewardPoints - cost,
        rewardId,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ──────────────────────────────────────────────
// Document Management
// Documents stored as JSON array in aiGeneratedCV.documents
// Actual files stored via upload.service (S3 or local)
// ──────────────────────────────────────────────

import { uploadFile, deleteFile } from "../services/upload.service.js";

export const getDocuments = async (req, res, next) => {
  try {
    const profile = getProfileFromReq(req);
    const cv =
      profile.aiGeneratedCV && typeof profile.aiGeneratedCV === "object"
        ? profile.aiGeneratedCV
        : {};
    const documents = Array.isArray(cv.documents) ? cv.documents : [];
    res.json({ success: true, data: documents });
  } catch (err) {
    next(err);
  }
};

export const uploadDocument = async (req, res, next) => {
  try {
    const profile = getProfileFromReq(req);
    const category = req.body.category || "other";

    // req.file is set by multer middleware in the route
    const file = req.file;

    let fileUrl = null;
    let fileKey = null;
    let fileName = req.body.name || "Document";
    let fileSize = "0 MB";
    let fileType = "document";

    if (file) {
      // Actual file was uploaded — store it
      const result = await uploadFile(
        file.buffer,
        file.originalname,
        "documents",
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

    const cv =
      profile.aiGeneratedCV && typeof profile.aiGeneratedCV === "object"
        ? profile.aiGeneratedCV
        : {};
    const documents = Array.isArray(cv.documents) ? [...cv.documents] : [];

    const newDoc = {
      id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: fileName,
      category,
      size: req.body.size || fileSize,
      type: req.body.type || fileType,
      url: fileUrl,
      fileKey,
      status: "pending",
      uploadedAt: new Date().toISOString(),
    };

    documents.push(newDoc);

    await prisma.profile.update({
      where: { id: profile.id },
      data: { aiGeneratedCV: { ...cv, documents } },
    });

    res.status(201).json({ success: true, data: newDoc });
  } catch (err) {
    next(err);
  }
};

export const deleteDocument = async (req, res, next) => {
  try {
    const profile = getProfileFromReq(req);
    const docId = req.params.id;

    const cv =
      profile.aiGeneratedCV && typeof profile.aiGeneratedCV === "object"
        ? profile.aiGeneratedCV
        : {};
    const existing = Array.isArray(cv.documents) ? cv.documents : [];

    // Find the doc to delete its file too
    const docToDelete = existing.find((d) => d.id === docId);
    if (docToDelete?.fileKey) {
      try {
        await deleteFile(docToDelete.fileKey);
      } catch (fileErr) {
        console.error(
          "Non-critical: failed to delete file from storage:",
          fileErr.message,
        );
      }
    }

    const documents = existing.filter((d) => d.id !== docId);

    await prisma.profile.update({
      where: { id: profile.id },
      data: { aiGeneratedCV: { ...cv, documents } },
    });

    res.json({ success: true, message: "Document removed" });
  } catch (err) {
    next(err);
  }
};

// ── Dashboard Analytics (charts) ───────────────

export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const profile = getProfileFromReq(req);

    // Application breakdown by status (for pie chart)
    const statusRows = await prisma.application.groupBy({
      by: ["status"],
      where: { applicantId: profile.id },
      _count: { id: true },
    });

    const statusColorMap = {
      APPLIED: "#64748b",
      SHORTLISTED: "#06b6d4",
      INTERVIEWED: "#8b5cf6",
      SELECTED: "#f59e0b",
      PROCESSING: "#3b82f6",
      DEPLOYED: "#10b981",
      REJECTED: "#ef4444",
    };

    const statusBreakdown = statusRows.map((r) => ({
      name: r.status.charAt(0) + r.status.slice(1).toLowerCase(),
      value: r._count.id,
      fill: statusColorMap[r.status] || "#64748b",
    }));

    // Last 7 days — daily application count (real activity)
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);
      days.push({
        label: d.toLocaleString("default", { weekday: "short" }),
        start: new Date(d),
        end,
      });
    }

    const dailyCounts = await Promise.all(
      days.map(({ start, end }) =>
        prisma.application.count({
          where: {
            applicantId: profile.id,
            createdAt: { gte: start, lte: end },
          },
        }),
      ),
    );

    const weeklyActivity = days.map(({ label }, i) => ({
      day: label,
      applications: dailyCounts[i],
    }));

    res.json({ success: true, data: { statusBreakdown, weeklyActivity } });
  } catch (err) {
    next(err);
  }
};

// ── Settings (auto-apply, notification prefs) ───

export const getSettings = async (req, res, next) => {
  try {
    const profile = getProfileFromReq(req);
    const cv =
      profile.aiGeneratedCV && typeof profile.aiGeneratedCV === "object"
        ? profile.aiGeneratedCV
        : {};
    const settings = cv.settings || {};

    res.json({
      success: true,
      data: {
        autoApplyToMatching: settings.autoApplyToMatching ?? false,
        pushNotifications: settings.pushNotifications ?? false,
        smsNotifications: settings.smsNotifications ?? false,
        emailNotifications: settings.emailNotifications ?? true,
        jobAlerts: settings.jobAlerts ?? true,
        applicationUpdates: settings.applicationUpdates ?? true,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateAutoApply = async (req, res, next) => {
  try {
    const profile = getProfileFromReq(req);
    const { autoApplyToMatching } = req.body;

    const cv =
      profile.aiGeneratedCV && typeof profile.aiGeneratedCV === "object"
        ? profile.aiGeneratedCV
        : {};
    const settings = cv.settings || {};

    settings.autoApplyToMatching = !!autoApplyToMatching;

    await prisma.profile.update({
      where: { id: profile.id },
      data: { aiGeneratedCV: { ...cv, settings } },
    });

    // If enabled, immediately auto-apply to up to 5 matching active jobs
    if (autoApplyToMatching) {
      try {
        const existingApps = await prisma.application.findMany({
          where: { applicantId: profile.id },
          select: { jobOrderId: true },
        });
        const appliedJobIds = existingApps.map((a) => a.jobOrderId);

        const profileSkills = cv.skills || cv.skillTags || [];

        const matchingJobs = await prisma.jobOrder.findMany({
          where: {
            status: "ACTIVE",
            ...(appliedJobIds.length > 0
              ? { id: { notIn: appliedJobIds } }
              : {}),
          },
          take: 5,
          orderBy: { createdAt: "desc" },
        });

        let appliedCount = 0;
        for (const job of matchingJobs) {
          // Quick skill match: only auto-apply if ≥1 skill overlaps
          const reqSkills = Array.isArray(job.requirements)
            ? job.requirements
            : Array.isArray(job.requirements?.skills)
              ? job.requirements.skills
              : [];

          const lowerProfile = profileSkills.map((s) => s.toLowerCase());
          const lowerReqs = reqSkills.map((r) => String(r).toLowerCase());
          const hasMatch = lowerProfile.some((s) =>
            lowerReqs.some((r) => r.includes(s) || s.includes(r)),
          );

          // Auto-apply if skills match OR if applicant has no skills yet (be generous)
          if (hasMatch || profileSkills.length === 0) {
            try {
              await prisma.application.create({
                data: {
                  applicantId: profile.id,
                  jobOrderId: job.id,
                  status: "APPLIED",
                  interviewNotes: "Auto-applied by system",
                },
              });
              appliedCount++;
            } catch {
              // Duplicate or other error — skip
            }
          }
        }

        if (appliedCount > 0) {
          // Award points for auto-applied jobs
          await prisma.profile.update({
            where: { id: profile.id },
            data: { rewardPoints: { increment: appliedCount * 50 } },
          });
        }

        return res.json({
          success: true,
          data: {
            autoApplyToMatching: true,
            autoAppliedCount: appliedCount,
            message:
              appliedCount > 0
                ? `Auto-apply enabled! Applied to ${appliedCount} matching job(s).`
                : "Auto-apply enabled! You'll be automatically applied to new matching jobs.",
          },
        });
      } catch (autoErr) {
        console.error("Auto-apply batch failed:", autoErr.message);
      }
    }

    res.json({
      success: true,
      data: {
        autoApplyToMatching: settings.autoApplyToMatching,
        message: autoApplyToMatching
          ? "Auto-apply enabled."
          : "Auto-apply disabled.",
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateNotificationPrefs = async (req, res, next) => {
  try {
    const profile = getProfileFromReq(req);
    const {
      pushNotifications,
      smsNotifications,
      emailNotifications,
      jobAlerts,
      applicationUpdates,
    } = req.body;

    const cv =
      profile.aiGeneratedCV && typeof profile.aiGeneratedCV === "object"
        ? profile.aiGeneratedCV
        : {};
    const settings = cv.settings || {};

    if (pushNotifications !== undefined)
      settings.pushNotifications = !!pushNotifications;
    if (smsNotifications !== undefined)
      settings.smsNotifications = !!smsNotifications;
    if (emailNotifications !== undefined)
      settings.emailNotifications = !!emailNotifications;
    if (jobAlerts !== undefined) settings.jobAlerts = !!jobAlerts;
    if (applicationUpdates !== undefined)
      settings.applicationUpdates = !!applicationUpdates;

    await prisma.profile.update({
      where: { id: profile.id },
      data: { aiGeneratedCV: { ...cv, settings } },
    });

    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};

// ── Employer Rating (By Workers) ───────────────

export const rateEmployer = async (req, res, next) => {
  try {
    const profile = getProfileFromReq(req);
    const { employerId, rating, review } = req.body;

    if (!employerId || typeof rating !== "number" || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Valid employerId and rating (1-5) are required",
      });
    }

    // Verify the applicant has a late-stage application with this employer
    const application = await prisma.application.findFirst({
      where: {
        applicantId: profile.id,
        jobOrder: { employerId },
        status: { in: ["SELECTED", "PROCESSING", "DEPLOYED"] },
      },
    });

    if (!application) {
      return res.status(403).json({
        success: false,
        message: "You can only rate employers after being selected or deployed",
      });
    }

    // Upsert the rating
    const existingRating = await prisma.employerRating.findFirst({
      where: { employerId, applicantId: profile.id },
    });

    let newRating;
    if (existingRating) {
      newRating = await prisma.employerRating.update({
        where: { id: existingRating.id },
        data: { rating, review },
      });
    } else {
      newRating = await prisma.employerRating.create({
        data: { employerId, applicantId: profile.id, rating, review },
      });
    }

    // Recalculate Employer Trust Score
    const allRatings = await prisma.employerRating.findMany({
      where: { employerId },
    });

    // Simple business logic for trust score: Base 50, avg rating mapped to 0-100 scale
    // Avg 1 = 20, Avg 3 = 60, Avg 5 = 100
    const avgRating =
      allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
    const trustScore = Math.round(avgRating * 20);

    await prisma.employer.update({
      where: { id: employerId },
      data: { trustScore },
    });

    res.json({ success: true, data: newRating });
  } catch (err) {
    next(err);
  }
};

/**
 * SSE (Server-Sent Events) endpoint — establishes real-time notification stream
 */
export const getNotificationsStream = async (req, res, next) => {
  try {
    const profile = getProfileFromReq(req);

    // Set SSE headers
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });

    // Import SSE service
    const { addClient } = await import("../services/sse.service.js");

    // Register this connection
    addClient(profile.id, res);

    // Send initial connection message
    res.write(`:ping\n\n`);

    // Keep-alive ping every 30 seconds
    const interval = setInterval(() => {
      try {
        res.write(`:ping\n\n`);
      } catch {
        clearInterval(interval);
      }
    }, 30000);

    // Cleanup on disconnect
    res.on("close", () => {
      clearInterval(interval);
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = async (req, res, next) => {
  try {
    const profile = getProfileFromReq(req);
    const { id } = req.params;

    const notification = await prisma.notification.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a notification
 */
export const deleteNotification = async (req, res, next) => {
  try {
    const profile = getProfileFromReq(req);
    const { id } = req.params;

    const notification = await prisma.notification.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    }

    await prisma.notification.delete({
      where: { id },
    });

    res.json({ success: true, message: "Notification deleted" });
  } catch (err) {
    next(err);
  }
};

/**
 * Batch talent matching — compute match scores for multiple jobs at once
 */
export const batchTalentMatching = async (req, res, next) => {
  try {
    const profile = getProfileFromReq(req);
    const { jobIds } = req.body;

    if (!Array.isArray(jobIds) || jobIds.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "jobIds array required" });
    }

    // Get jobs with full details
    const jobs = await prisma.jobOrder.findMany({
      where: { id: { in: jobIds }, status: "ACTIVE" },
      select: {
        id: true,
        title: true,
        requirements: true,
        employer: { select: { companyName: true } },
      },
    });

    const results = [];

    for (const job of jobs) {
      try {
        // Use enhanced matching for better accuracy
        const matchResult = await computeEnhancedMatchScore(profile, job);

        results.push({
          jobId: job.id,
          jobTitle: job.title,
          company: job.employer?.companyName || "Unknown",
          matchScore: matchResult.score,
          confidence: matchResult.confidence,
          matchReason: matchResult.reason,
          strengths: matchResult.strengths || [],
          gaps: matchResult.gaps || [],
          scoredBy: matchResult.scoredBy,
          matchBreakdown: matchResult.matchBreakdown,
        });
      } catch (err) {
        console.error(`Failed to match job ${job.id}:`, err.message);
        results.push({
          jobId: job.id,
          jobTitle: job.title,
          company: job.employer?.companyName || "Unknown",
          error: "Failed to compute match score",
        });
      }
    }

    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
};
