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
  getUserDetail,
  getJobOrders,
  getJobOrderCount,
  getJobOrderDetail,
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
  getComplaintDetail,
  updateComplaint,
  getInvoices,
  getInvoiceDetail,
  updateInvoiceStatus,
  generateInvoice,
  getReports,
  getVerificationQueue,
  getPlatformSettings,
  updatePlatformSettings,
  getDeploymentDocuments,
  uploadDeploymentDocument,
  deleteDeploymentDocument,
  getProfileDocuments,
  uploadProfileDocument,
  deleteProfileDocument,
  getDashboardAnalytics,
  getSystemLogs,
  getSlaAlerts,
} from "../controllers/admin.controller.js";

import { validateRequest } from "../middlewares/validation.middleware.js";
import {
  complaintUpdateSchema,
  deploymentUpdateSchema,
} from "../services/validation.service.js";

const router = Router();

router.use(authorize);
router.use(authorizeRoles("ADMIN"));

// Dashboard
router.get("/dashboard-stats", getDashboardStats);
router.get("/dashboard-analytics", getDashboardAnalytics);
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
router.get("/users/:id", getUserDetail);
router.patch("/users/:id/toggle-active", toggleUserActive);

// Job Orders
router.get("/job-orders", getJobOrders);
router.get("/job-order-count", getJobOrderCount);
router.get("/job-orders/:id", getJobOrderDetail);
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
router.patch("/deployments/:id", validateRequest(deploymentUpdateSchema), updateDeployment);

// Complaints
router.get("/complaints", getComplaints);
router.get("/complaints/:id", getComplaintDetail);
router.patch("/complaints/:id", validateRequest(complaintUpdateSchema), updateComplaint);

// Invoices
router.get("/invoices", getInvoices);
router.get("/invoices/:id", getInvoiceDetail);
router.patch("/invoices/:id/status", updateInvoiceStatus);
router.post("/invoices/generate", generateInvoice);

// Reports
router.get("/reports", getReports);

// Verification
router.get("/verification-queue", getVerificationQueue);

// Logs
router.get("/logs", getSystemLogs);
router.get("/sla-alerts", getSlaAlerts);

// Platform Settings
router.get("/settings", getPlatformSettings);
router.put("/settings", updatePlatformSettings);

import { multerUpload } from "../services/upload.service.js";

// Deployment Documents
router.get("/deployments/:id/documents", getDeploymentDocuments);
router.post("/deployments/:id/documents", multerUpload.single("file"), uploadDeploymentDocument);
router.delete("/deployment-documents/:docId", deleteDeploymentDocument);

// Profile Documents
router.get("/profiles/:id/documents", getProfileDocuments);
router.post("/profiles/:id/documents", multerUpload.single("file"), uploadProfileDocument);
router.delete("/profile-documents/:docId", deleteProfileDocument);

export default router;
