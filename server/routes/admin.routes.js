import { Router } from "express";
import { authorize, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
  getDashboardStats,
  getRecentActivity,
  getPendingApprovals,
  getApplicants,
  getApplicantCount,
  getApplicantDetail,
  getEmployers,
  getEmployerCount,
  getEmployerDetail,
  verifyEmployer,
  toggleUserActive,
  getJobOrders,
  getJobOrderCount,
  updateJobOrderStatus,
  getApplications,
  getApplicationDetail,
  updateApplicationStatus,
  getDeployments,
  getDeploymentDetail,
  getDeploymentCount,
  getDeploymentStats,
  updateDeployment,
  getComplaints,
  updateComplaint,
  getInvoices,
  updateInvoiceStatus,
  getReports,
  getVerificationQueue,
} from "../controllers/admin.controller.js";

const router = Router();

router.use(authorize);
router.use(authorizeRoles("ADMIN"));

// Dashboard
router.get("/dashboard-stats", getDashboardStats);
router.get("/recent-activity", getRecentActivity);
router.get("/pending-approvals", getPendingApprovals);

// Applicants
router.get("/applicants", getApplicants);
router.get("/applicant-count", getApplicantCount);
router.get("/applicants/:id", getApplicantDetail);

// Employers
router.get("/employers", getEmployers);
router.get("/employer-count", getEmployerCount);
router.get("/employers/:id", getEmployerDetail);
router.patch("/employers/:id/verify", verifyEmployer);

// Users
router.patch("/users/:id/toggle-active", toggleUserActive);

// Job Orders
router.get("/job-orders", getJobOrders);
router.get("/job-order-count", getJobOrderCount);
router.patch("/job-orders/:id/status", updateJobOrderStatus);

// Applications
router.get("/applications", getApplications);
router.get("/applications/:id", getApplicationDetail);
router.patch("/applications/:id/status", updateApplicationStatus);

// Deployments
router.get("/deployments", getDeployments);
router.get("/deployments/:id", getDeploymentDetail);
router.get("/deployment-count", getDeploymentCount);
router.get("/deployment-stats", getDeploymentStats);
router.patch("/deployments/:id", updateDeployment);

// Complaints
router.get("/complaints", getComplaints);
router.patch("/complaints/:id", updateComplaint);

// Invoices
router.get("/invoices", getInvoices);
router.patch("/invoices/:id/status", updateInvoiceStatus);

// Reports
router.get("/reports", getReports);

// Verification
router.get("/verification-queue", getVerificationQueue);

export default router;

