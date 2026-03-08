import prisma from "../config/database.js";
import { generateCVSummary, computeAIMatchScore } from "../services/openai.service.js";

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
            employer: { select: { companyName: true, phone: true, country: true } },
          },
        },
        deployment: true,
      },
    });
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }
    res.json({ success: true, data: application });
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
    const existing = profile.aiGeneratedCV && typeof profile.aiGeneratedCV === "object"
      ? profile.aiGeneratedCV : {};
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

    // Call OpenAI GPT-4o for a professional CV summary (falls back to local logic)
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
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 12));
    const [jobs, total] = await Promise.all([
      prisma.jobOrder.findMany({
        where,
        include: { employer: { select: { companyName: true } } },
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
      location: j.location,
      salary: j.salary,
      positions: j.positions,
      description: j.description,
      requirements: j.requirements,
      status: j.status,
      createdAt: j.createdAt,
    }));
    res.json({ success: true, data: { items: data, total, page, limit } });
  } catch (err) {
    next(err);
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const job = await prisma.jobOrder.findFirst({
      where: { id: req.params.id, status: "ACTIVE" },
      include: { employer: { select: { companyName: true, country: true } } },
    });
    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Job not found" });
    }
    res.json({
      success: true,
      data: {
        ...job,
        employer: job.employer?.companyName,
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
      return res
        .status(404)
        .json({ success: false, message: "Job not found" });
    }
    const existing = await prisma.application.findFirst({
      where: { applicantId: profile.id, jobOrderId: jobId },
    });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Already applied" });
    }

    // Compute AI match score using OpenAI (falls back to local keyword matching)
    let matchScore = null;
    try {
      const profileCV = profile.aiGeneratedCV && typeof profile.aiGeneratedCV === "object"
        ? profile.aiGeneratedCV : {};
      const profileSkills = profileCV.skills || profileCV.skillTags || [];
      const jobReq = job.requirements || {};
      const reqSkills = Array.isArray(jobReq)
        ? jobReq
        : Array.isArray(jobReq.skills)
          ? jobReq.skills
          : [];

      const aiResult = await computeAIMatchScore(profileSkills, reqSkills, job.title);
      matchScore = aiResult.score;
    } catch {
      // AI matching is best-effort; null score is acceptable
    }

    const application = await prisma.application.create({
      data: {
        applicantId: profile.id,
        jobOrderId: jobId,
        status: "APPLIED",
        aiMatchScore: matchScore,
      },
    });

    // Award 50 points for applying
    await prisma.profile.update({
      where: { id: profile.id },
      data: { rewardPoints: { increment: 50 } },
    });

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

export const getNotifications = async (req, res, next) => {
  try {
    const profile = getProfileFromReq(req);

    // Build notifications from recent application status changes
    const recentApps = await prisma.application.findMany({
      where: { applicantId: profile.id },
      include: {
        jobOrder: {
          select: { title: true, employer: { select: { companyName: true } } },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 10,
    });

    const notifications = [];

    for (const app of recentApps) {
      const title = app.jobOrder?.title || "Job Application";
      const company = app.jobOrder?.employer?.companyName || "Employer";

      if (app.status === "SHORTLISTED" && app.shortlistedAt) {
        notifications.push({
          id: `notif-${app.id}-shortlisted`,
          type: "success",
          title: "Application Shortlisted!",
          message: `Your application for "${title}" at ${company} has been shortlisted.`,
          date: app.shortlistedAt,
          read: true,
        });
      }
      if (app.status === "INTERVIEWED" && app.interviewedAt) {
        notifications.push({
          id: `notif-${app.id}-interviewed`,
          type: "info",
          title: "Interview Completed",
          message: `Your interview for "${title}" at ${company} has been recorded.`,
          date: app.interviewedAt,
          read: true,
        });
      }
      if (app.status === "SELECTED" && app.selectedAt) {
        notifications.push({
          id: `notif-${app.id}-selected`,
          type: "success",
          title: "You've been Selected!",
          message: `Congratulations! You've been selected for "${title}" at ${company}.`,
          date: app.selectedAt,
          read: false,
        });
      }
      if (app.status === "REJECTED") {
        notifications.push({
          id: `notif-${app.id}-rejected`,
          type: "warning",
          title: "Application Not Selected",
          message: `Your application for "${title}" at ${company} was not selected.`,
          date: app.updatedAt,
          read: true,
        });
      }
      if (app.status === "DEPLOYED" && app.deployedAt) {
        notifications.push({
          id: `notif-${app.id}-deployed`,
          type: "success",
          title: "Deployment Confirmed!",
          message: `You have been deployed for "${title}" at ${company}.`,
          date: app.deployedAt,
          read: false,
        });
      }
    }

    // Sort by date descending
    notifications.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({ success: true, data: notifications.slice(0, 20) });
  } catch (err) {
    next(err);
  }
};

export const getRecommendedJobs = async (req, res, next) => {
  try {
    const profile = getProfileFromReq(req);

    // Get applicant's existing application job IDs to exclude
    const existingApps = await prisma.application.findMany({
      where: { applicantId: profile.id },
      select: { jobOrderId: true },
    });
    const appliedJobIds = existingApps.map((a) => a.jobOrderId);

    const jobs = await prisma.jobOrder.findMany({
      where: {
        status: "ACTIVE",
        ...(appliedJobIds.length > 0
          ? { id: { notIn: appliedJobIds } }
          : {}),
      },
      take: 6,
      include: { employer: { select: { companyName: true } } },
      orderBy: { createdAt: "desc" },
    });
    const data = jobs.map((j) => ({
      id: j.id,
      title: j.title,
      employer: j.employer?.companyName,
      location: j.location,
      salary: j.salary,
    }));
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getSavedJobs = async (req, res, next) => {
  try {
    // Saved jobs would need a SavedJob model; for now we use the user's
    // aiGeneratedCV.savedJobs array as a lightweight JSON store
    const profile = getProfileFromReq(req);
    const cv = profile.aiGeneratedCV && typeof profile.aiGeneratedCV === "object"
      ? profile.aiGeneratedCV : {};
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
      return res.status(400).json({ success: false, message: "jobId required" });
    }

    const cv = profile.aiGeneratedCV && typeof profile.aiGeneratedCV === "object"
      ? profile.aiGeneratedCV : {};
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

    const cv = profile.aiGeneratedCV && typeof profile.aiGeneratedCV === "object"
      ? profile.aiGeneratedCV : {};
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
        applications.length
    );
    res.json({ success: true, data: avgScore });
  } catch (err) {
    next(err);
  }
};

export const getProfileViews = async (req, res, next) => {
  try {
    // Profile views would need tracking — for now, derive from application count
    // as a proxy for employer engagement
    const profile = getProfileFromReq(req);
    const appCount = await prisma.application.count({
      where: {
        applicantId: profile.id,
        status: { in: ["SHORTLISTED", "INTERVIEWED", "SELECTED", "DEPLOYED"] },
      },
    });
    // Each shortlist/interview implies at least one profile view
    res.json({ success: true, data: appCount });
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
    const stats = Object.fromEntries(
      counts.map((c) => [c.status, c._count])
    );

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
    const cv = profile.aiGeneratedCV && typeof profile.aiGeneratedCV === "object"
      ? profile.aiGeneratedCV : {};

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
        where: { applicantId: profile.id, status: { in: ["SHORTLISTED", "INTERVIEWED", "SELECTED", "DEPLOYED"] } },
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
      return res.status(404).json({ success: false, message: "Reward not found" });
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
