/**
 * Admin Controller — Legaforce
 *
 * Provides endpoints for the admin portal to manage users,
 * job orders, applications, deployments, invoices, and complaints.
 */
import prisma from "../config/database.js";

// ── Dashboard Stats ────────────────────────────

export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalApplicants,
      totalEmployers,
      totalJobOrders,
      totalApplications,
      totalDeployments,
      totalComplaints,
      pendingVerifications,
      activeJobOrders,
      recentApplications,
    ] = await Promise.all([
      prisma.profile.count(),
      prisma.employer.count(),
      prisma.jobOrder.count(),
      prisma.application.count(),
      prisma.deployment.count(),
      prisma.complaint.count(),
      prisma.employer.count({ where: { isVerified: false } }),
      prisma.jobOrder.count({ where: { status: "ACTIVE" } }),
      prisma.application.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    // Revenue from paid invoices
    const revenue = await prisma.invoice.aggregate({
      _sum: { amount: true },
      where: { status: "PAID" },
    });

    // Application pipeline
    const pipeline = await prisma.application.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    res.json({
      success: true,
      data: {
        totalApplicants,
        totalEmployers,
        totalJobOrders,
        totalApplications,
        totalDeployments,
        totalComplaints,
        pendingVerifications,
        activeJobOrders,
        recentApplications,
        totalRevenue: revenue._sum.amount || 0,
        pipeline: pipeline.reduce((acc, p) => {
          acc[p.status] = p._count.id;
          return acc;
        }, {}),
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── Recent Activity ────────────────────────────

export const getRecentActivity = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const [recentApps, recentComplaints, recentJobs] = await Promise.all([
      prisma.application.findMany({
        take: limit,
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          status: true,
          updatedAt: true,
          applicant: { select: { firstName: true, lastName: true } },
          jobOrder: { select: { title: true } },
        },
      }),
      prisma.complaint.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          category: true,
          status: true,
          createdAt: true,
          applicant: { select: { firstName: true, lastName: true } },
        },
      }),
      prisma.jobOrder.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
          employer: { select: { companyName: true } },
        },
      }),
    ]);

    // Merge and sort by date
    const activity = [
      ...recentApps.map((a) => ({
        type: "application",
        id: a.id,
        description: `${a.applicant.firstName} ${a.applicant.lastName} — ${a.jobOrder.title} (${a.status})`,
        date: a.updatedAt,
      })),
      ...recentComplaints.map((c) => ({
        type: "complaint",
        id: c.id,
        description: `Complaint from ${c.applicant.firstName} ${c.applicant.lastName}: ${c.category} (${c.status})`,
        date: c.createdAt,
      })),
      ...recentJobs.map((j) => ({
        type: "job_order",
        id: j.id,
        description: `${j.employer.companyName} posted: ${j.title} (${j.status})`,
        date: j.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);

    res.json({ success: true, data: activity });
  } catch (err) {
    next(err);
  }
};

// ── Pending Approvals ──────────────────────────

export const getPendingApprovals = async (req, res, next) => {
  try {
    const employers = await prisma.employer.findMany({
      where: { isVerified: false },
      include: {
        user: { select: { email: true, createdAt: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: employers });
  } catch (err) {
    next(err);
  }
};

// ── Applicant Management ───────────────────────

export const getApplicants = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = search
      ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { user: { email: { contains: search, mode: "insensitive" } } },
          ],
        }
      : {};

    const [applicants, total] = await Promise.all([
      prisma.profile.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              email: true,
              isActive: true,
              isEmailVerified: true,
              createdAt: true,
            },
          },
          _count: { select: { applications: true, complaints: true } },
        },
      }),
      prisma.profile.count({ where }),
    ]);

    res.json({
      success: true,
      data: applicants,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    next(err);
  }
};

export const getApplicantCount = async (req, res, next) => {
  try {
    const count = await prisma.profile.count();
    res.json({ success: true, data: count });
  } catch (err) {
    next(err);
  }
};

export const getApplicantDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const applicant = await prisma.profile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            isActive: true,
            isEmailVerified: true,
            role: true,
            createdAt: true,
          },
        },
        applications: {
          orderBy: { createdAt: "desc" },
          include: {
            jobOrder: {
              select: {
                title: true,
                location: true,
                employer: { select: { companyName: true } },
              },
            },
            deployment: true,
          },
        },
        complaints: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: { applications: true, complaints: true },
        },
      },
    });

    if (!applicant) {
      return res
        .status(404)
        .json({ success: false, message: "Applicant not found" });
    }

    res.json({ success: true, data: applicant });
  } catch (err) {
    next(err);
  }
};

// ── Employer Management ────────────────────────

export const getEmployers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = search
      ? {
          OR: [
            { companyName: { contains: search, mode: "insensitive" } },
            { contactPerson: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const [employers, total] = await Promise.all([
      prisma.employer.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { email: true, isActive: true, createdAt: true } },
          _count: { select: { jobOrders: true, invoices: true } },
        },
      }),
      prisma.employer.count({ where }),
    ]);

    res.json({
      success: true,
      data: employers,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    next(err);
  }
};

export const getEmployerCount = async (req, res, next) => {
  try {
    const count = await prisma.employer.count();
    res.json({ success: true, data: count });
  } catch (err) {
    next(err);
  }
};

export const getEmployerDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const employer = await prisma.employer.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            isActive: true,
            isEmailVerified: true,
            role: true,
            createdAt: true,
          },
        },
        jobOrders: {
          orderBy: { createdAt: "desc" },
          include: {
            _count: { select: { applications: true } },
          },
        },
        invoices: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: { jobOrders: true, invoices: true },
        },
      },
    });

    if (!employer) {
      return res
        .status(404)
        .json({ success: false, message: "Employer not found" });
    }

    res.json({ success: true, data: employer });
  } catch (err) {
    next(err);
  }
};

export const verifyEmployer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    const employer = await prisma.employer.update({
      where: { id },
      data: { isVerified: isVerified !== false },
    });

    res.json({ success: true, data: employer });
  } catch (err) {
    next(err);
  }
};

// ── User Activation ────────────────────────────

export const toggleUserActive = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: { id: true, email: true, isActive: true, role: true },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// ── Job Orders ─────────────────────────────────

export const getJobOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = status ? { status } : {};

    const [jobs, total] = await Promise.all([
      prisma.jobOrder.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: "desc" },
        include: {
          employer: { select: { companyName: true, country: true } },
          _count: { select: { applications: true } },
        },
      }),
      prisma.jobOrder.count({ where }),
    ]);

    res.json({ success: true, data: jobs, total });
  } catch (err) {
    next(err);
  }
};

export const getJobOrderCount = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};
    const count = await prisma.jobOrder.count({ where });
    res.json({ success: true, data: count });
  } catch (err) {
    next(err);
  }
};

export const updateJobOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await prisma.jobOrder.update({
      where: { id },
      data: { status },
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// ── Applications ───────────────────────────────

export const getApplications = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = status ? { status } : {};

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { updatedAt: "desc" },
        include: {
          applicant: {
            select: { firstName: true, lastName: true, nationality: true },
          },
          jobOrder: {
            select: {
              title: true,
              employer: { select: { companyName: true } },
            },
          },
        },
      }),
      prisma.application.count({ where }),
    ]);

    res.json({ success: true, data: applications, total });
  } catch (err) {
    next(err);
  }
};

export const getApplicationDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        applicant: true,
        jobOrder: {
          include: {
            employer: true,
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

    res.json({ success: true, data: application });
  } catch (err) {
    next(err);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const data = { status };
    if (status === "SHORTLISTED") data.shortlistedAt = new Date();
    if (status === "INTERVIEWED") data.interviewedAt = new Date();
    if (status === "SELECTED") data.selectedAt = new Date();
    if (status === "DEPLOYED") data.deployedAt = new Date();

    const updated = await prisma.application.update({
      where: { id },
      data,
      include: {
        applicant: { select: { firstName: true, lastName: true } },
        jobOrder: { select: { title: true } },
      },
    });

    // Create deployment record when SELECTED
    if (status === "SELECTED") {
      const existing = await prisma.deployment.findUnique({
        where: { applicationId: id },
      });
      if (!existing) {
        await prisma.deployment.create({ data: { applicationId: id } });
      }
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// ── Deployments ────────────────────────────────

export const getDeployments = async (req, res, next) => {
  try {
    const deployments = await prisma.deployment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        application: {
          include: {
            applicant: {
              select: { firstName: true, lastName: true, nationality: true },
            },
            jobOrder: {
              select: {
                title: true,
                location: true,
                employer: { select: { companyName: true } },
              },
            },
          },
        },
      },
    });

    res.json({ success: true, data: deployments });
  } catch (err) {
    next(err);
  }
};

export const getDeploymentCount = async (req, res, next) => {
  try {
    const count = await prisma.deployment.count();
    res.json({ success: true, data: count });
  } catch (err) {
    next(err);
  }
};

export const getDeploymentStats = async (req, res, next) => {
  try {
    const [total, byMedical, byVisa, byOec] = await Promise.all([
      prisma.deployment.count(),
      prisma.deployment.groupBy({
        by: ["medicalStatus"],
        _count: { id: true },
      }),
      prisma.deployment.groupBy({ by: ["visaStatus"], _count: { id: true } }),
      prisma.deployment.groupBy({ by: ["oecStatus"], _count: { id: true } }),
    ]);

    res.json({
      success: true,
      data: {
        total,
        medical: byMedical.reduce((acc, m) => {
          acc[m.medicalStatus] = m._count.id;
          return acc;
        }, {}),
        visa: byVisa.reduce((acc, v) => {
          acc[v.visaStatus] = v._count.id;
          return acc;
        }, {}),
        oec: byOec.reduce((acc, o) => {
          acc[o.oecStatus] = o._count.id;
          return acc;
        }, {}),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getDeploymentDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deployment = await prisma.deployment.findUnique({
      where: { id },
      include: {
        application: {
          include: {
            applicant: true,
            jobOrder: {
              include: {
                employer: true,
              },
            },
          },
        },
      },
    });

    if (!deployment) {
      return res
        .status(404)
        .json({ success: false, message: "Deployment not found" });
    }

    res.json({ success: true, data: deployment });
  } catch (err) {
    next(err);
  }
};

export const updateDeployment = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Whitelist allowed fields — never pass raw req.body to Prisma
    const { medicalStatus, medicalExpiryDate, visaStatus, visaExpiryDate,
            oecStatus, oecNumber, flightDate, arrivalDate } = req.body;
    const data = {};
    if (medicalStatus !== undefined) data.medicalStatus = medicalStatus;
    if (medicalExpiryDate !== undefined) data.medicalExpiryDate = medicalExpiryDate ? new Date(medicalExpiryDate) : null;
    if (visaStatus !== undefined) data.visaStatus = visaStatus;
    if (visaExpiryDate !== undefined) data.visaExpiryDate = visaExpiryDate ? new Date(visaExpiryDate) : null;
    if (oecStatus !== undefined) data.oecStatus = oecStatus;
    if (oecNumber !== undefined) data.oecNumber = oecNumber;
    if (flightDate !== undefined) data.flightDate = flightDate ? new Date(flightDate) : null;
    if (arrivalDate !== undefined) data.arrivalDate = arrivalDate ? new Date(arrivalDate) : null;

    const deployment = await prisma.deployment.update({
      where: { id },
      data,
    });

    res.json({ success: true, data: deployment });
  } catch (err) {
    next(err);
  }
};

// ── Complaints ─────────────────────────────────

export const getComplaints = async (req, res, next) => {
  try {
    const { status } = req.query;

    // Valid complaint statuses from schema
    const validStatuses = [
      "SUBMITTED",
      "UNDER_REVIEW",
      "ESCALATED",
      "RESOLVED",
      "CLOSED",
    ];

    // Map common frontend statuses to correct enum values
    const statusMap = {
      open: "SUBMITTED",
      OPEN: "SUBMITTED",
      pending: "SUBMITTED",
      PENDING: "SUBMITTED",
    };

    let where = {};
    if (status) {
      const mappedStatus = statusMap[status] || status;
      if (validStatuses.includes(mappedStatus)) {
        where.status = mappedStatus;
      }
    }

    const complaints = await prisma.complaint.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        applicant: { select: { firstName: true, lastName: true } },
      },
    });

    res.json({ success: true, data: complaints });
  } catch (err) {
    next(err);
  }
};

export const updateComplaint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, assignedAdminId, resolution } = req.body;

    const validStatuses = [
      "SUBMITTED",
      "UNDER_REVIEW",
      "ESCALATED",
      "RESOLVED",
      "CLOSED",
    ];
    const statusMap = {
      open: "SUBMITTED",
      OPEN: "SUBMITTED",
      pending: "SUBMITTED",
      PENDING: "SUBMITTED",
    };

    const data = {};
    if (status) {
      const mappedStatus = statusMap[status] || status;
      if (validStatuses.includes(mappedStatus)) {
        data.status = mappedStatus;
      } else {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        });
      }
    }
    if (assignedAdminId) data.assignedAdminId = assignedAdminId;
    if (resolution) {
      data.resolution = resolution;
      data.resolvedAt = new Date();
    }

    const updated = await prisma.complaint.update({
      where: { id },
      data,
      include: {
        applicant: { select: { firstName: true, lastName: true } },
      },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// ── Invoices ───────────────────────────────────

export const getInvoices = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};

    const invoices = await prisma.invoice.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        employer: { select: { companyName: true, contactPerson: true } },
      },
    });

    res.json({ success: true, data: invoices });
  } catch (err) {
    next(err);
  }
};

export const updateInvoiceStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const data = { status };
    if (status === "PAID") data.paidAt = new Date();

    const updated = await prisma.invoice.update({
      where: { id },
      data,
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// ── Reports / Analytics ────────────────────────

export const getReports = async (req, res, next) => {
  try {
    const [
      applicationsByStatus,
      jobsByStatus,
      monthlyApplications,
      topEmployers,
      topNationalities,
    ] = await Promise.all([
      prisma.application.groupBy({ by: ["status"], _count: { id: true } }),
      prisma.jobOrder.groupBy({ by: ["status"], _count: { id: true } }),
      prisma.$queryRaw`
        SELECT DATE_TRUNC('month', "createdAt") as month, COUNT(*)::int as count
        FROM "Application"
        WHERE "createdAt" >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month ASC
      `,
      prisma.employer.findMany({
        take: 5,
        orderBy: { totalHires: "desc" },
        select: { companyName: true, totalHires: true, country: true },
      }),
      prisma.profile.groupBy({
        by: ["nationality"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 5,
      }),
    ]);

    res.json({
      success: true,
      data: {
        applicationsByStatus: applicationsByStatus.reduce((acc, a) => {
          acc[a.status] = a._count.id;
          return acc;
        }, {}),
        jobsByStatus: jobsByStatus.reduce((acc, j) => {
          acc[j.status] = j._count.id;
          return acc;
        }, {}),
        monthlyApplications,
        topEmployers,
        topNationalities: topNationalities.map((n) => ({
          nationality: n.nationality,
          count: n._count.id,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── Verification ───────────────────────────────

export const getVerificationQueue = async (req, res, next) => {
  try {
    const employers = await prisma.employer.findMany({
      where: { isVerified: false },
      orderBy: { createdAt: "asc" },
      include: {
        user: { select: { email: true, createdAt: true } },
      },
    });

    res.json({ success: true, data: employers });
  } catch (err) {
    next(err);
  }
};
