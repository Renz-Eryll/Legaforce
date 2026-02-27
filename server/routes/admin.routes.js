import { Router } from "express";
import { authorize, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
  getDashboardStats,
  getRecentActivity,
  getPendingApprovals,
  getApplicants,
  getApplicantCount,
  getEmployers,
  getEmployerCount,
  verifyEmployer,
  toggleUserActive,
  getJobOrders,
  getJobOrderCount,
  updateJobOrderStatus,
  getApplications,
  updateApplicationStatus,
  getDeployments,
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

// Employers
router.get("/employers", getEmployers);
router.get("/employer-count", getEmployerCount);
router.patch("/employers/:id/verify", verifyEmployer);

// Users
router.patch("/users/:id/toggle-active", toggleUserActive);

// Job Orders
router.get("/job-orders", getJobOrders);
router.get("/job-order-count", getJobOrderCount);
router.patch("/job-orders/:id/status", updateJobOrderStatus);

// Applications
router.get("/applications", getApplications);
router.patch("/applications/:id/status", updateApplicationStatus);

// Deployments
router.get("/deployments", getDeployments);
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
