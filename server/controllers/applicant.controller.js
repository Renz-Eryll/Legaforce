import prisma from "../config/database.js";

const getProfileByUser = async (userId) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });
  if (!profile) throw new Error("Applicant profile not found");
  return profile;
};

export const getProfile = async (req, res, next) => {
  try {
    const profile = await getProfileByUser(req.user.id);
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { email: true },
    });
    res.json({
      success: true,
      data: {
        ...profile,
        email: user?.email,
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
    const profile = await getProfileByUser(req.user.id);
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
    const profile = await getProfileByUser(req.user.id);
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
      createdAt: app.createdAt,
      jobOrder: app.jobOrder,
      position: app.jobOrder?.title,
      employer: app.jobOrder?.employer?.companyName,
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
    const profile = await getProfileByUser(req.user.id);
    const application = await prisma.application.findFirst({
      where: { id: req.params.id, applicantId: profile.id },
      include: {
        jobOrder: {
          include: {
            employer: { select: { companyName: true } },
          },
        },
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
    const profile = await getProfileByUser(req.user.id);
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
    const profile = await getProfileByUser(req.user.id);
    const { category, subject, description } = req.body;
    const raw = (category || "other").toLowerCase().replace(/\s+/g, "_");
    const categoryEnum = categoryMap[raw] || "OTHER";
    const complaint = await prisma.complaint.create({
      data: {
        applicantId: profile.id,
        category: categoryEnum,
        description: description || subject || "No description",
        status: "SUBMITTED",
        escalationLevel: 1,
      },
    });
    res.status(201).json({ success: true, data: complaint });
  } catch (err) {
    next(err);
  }
};

export const getCV = async (req, res, next) => {
  try {
    const profile = await getProfileByUser(req.user.id);
    const cv = profile.aiGeneratedCV || null;
    res.json({ success: true, data: cv });
  } catch (err) {
    next(err);
  }
};

export const saveCV = async (req, res, next) => {
  try {
    const profile = await getProfileByUser(req.user.id);
    const payload = req.body;
    await prisma.profile.update({
      where: { id: profile.id },
      data: { aiGeneratedCV: payload },
    });
    res.json({ success: true, data: payload });
  } catch (err) {
    next(err);
  }
};

export const generateAICV = async (req, res, next) => {
  try {
    const profile = await getProfileByUser(req.user.id);
    const existing = (profile.aiGeneratedCV && typeof profile.aiGeneratedCV === "object")
      ? profile.aiGeneratedCV
      : {};
    const summary =
      existing.summary ||
      `Professional profile for ${profile.firstName} ${profile.lastName}.`;
    const skillTags = existing.skillTags || [];
    const data = { ...existing, cvSummary: summary, skillTags, profileReady: true };
    await prisma.profile.update({
      where: { id: profile.id },
      data: { aiGeneratedCV: data },
    });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getRewardPoints = async (req, res, next) => {
  try {
    const profile = await getProfileByUser(req.user.id);
    res.json({ success: true, data: profile.rewardPoints ?? 0 });
  } catch (err) {
    next(err);
  }
};

export const getJobs = async (req, res, next) => {
  try {
    const where = { status: "ACTIVE" };
    if (req.query.search) {
      where.OR = [
        { title: { contains: req.query.search, mode: "insensitive" } },
        { description: { contains: req.query.search, mode: "insensitive" } },
      ];
    }
    if (req.query.location) where.location = { contains: req.query.location, mode: "insensitive" };
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
      include: { employer: { select: { companyName: true } } },
    });
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    res.json({
      success: true,
      data: {
        ...job,
        employer: job.employer?.companyName,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const applyToJob = async (req, res, next) => {
  try {
    const profile = await getProfileByUser(req.user.id);
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
      return res.status(400).json({ success: false, message: "Already applied" });
    }
    const application = await prisma.application.create({
      data: {
        applicantId: profile.id,
        jobOrderId: jobId,
        status: "APPLIED",
        aiMatchScore: null,
      },
    });
    res.status(201).json({ success: true, data: application });
  } catch (err) {
    next(err);
  }
};

export const getProfileCompletion = async (req, res, next) => {
  try {
    const profile = await getProfileByUser(req.user.id);
    let score = 0;
    if (profile.firstName && profile.lastName) score += 20;
    if (profile.phone) score += 15;
    if (profile.nationality) score += 15;
    if (profile.aiGeneratedCV && Object.keys(profile.aiGeneratedCV).length > 0) score += 50;
    res.json({ success: true, data: Math.min(100, score) });
  } catch (err) {
    next(err);
  }
};

export const getNotifications = async (req, res, next) => {
  try {
    res.json({ success: true, data: [] });
  } catch (err) {
    next(err);
  }
};

export const getRecommendedJobs = async (req, res, next) => {
  try {
    const [jobs] = await Promise.all([
      prisma.jobOrder.findMany({
        where: { status: "ACTIVE" },
        take: 6,
        include: { employer: { select: { companyName: true } } },
        orderBy: { createdAt: "desc" },
      }),
    ]);
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
    res.json({ success: true, data: [] });
  } catch (err) {
    next(err);
  }
};

export const getMatchScore = async (req, res, next) => {
  try {
    res.json({ success: true, data: 0 });
  } catch (err) {
    next(err);
  }
};

export const getProfileViews = async (req, res, next) => {
  try {
    res.json({ success: true, data: 0 });
  } catch (err) {
    next(err);
  }
};

export const getApplicationStats = async (req, res, next) => {
  try {
    const profile = await getProfileByUser(req.user.id);
    const counts = await prisma.application.groupBy({
      by: ["status"],
      where: { applicantId: profile.id },
      _count: true,
    });
    const stats = Object.fromEntries(counts.map((c) => [c.status, c._count]));
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};

export const getRewardHistory = async (req, res, next) => {
  try {
    res.json({ success: true, data: [] });
  } catch (err) {
    next(err);
  }
};

export const getRewardCatalog = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: [
        { id: "training", name: "Free training", cost: 800, type: "training" },
        { id: "priority", name: "Priority processing", cost: 1000, type: "service" },
        { id: "discount", name: "Medical / documentation discount", cost: 600, type: "discount" },
      ],
    });
  } catch (err) {
    next(err);
  }
};

export const redeemReward = async (req, res, next) => {
  try {
    res.status(400).json({ success: false, message: "Reward redemption not implemented yet" });
  } catch (err) {
    next(err);
  }
};
