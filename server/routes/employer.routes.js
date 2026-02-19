import { Router } from "express";
import { authorize, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
  getProfile,
  updateProfile,
  getJobOrders,
  createJobOrder,
  getJobOrderById,
  updateJobOrder,
  deleteJobOrder,
  getCandidates,
  getCandidateById,
  getInterviews,
  updateInterviewRating,
  shareInterviewFeedback,
  getDocuments,
  uploadDocument,
  getPricing,
  getUpcomingInterviews,
  getRecentCandidates,
  getCandidateCount,
  getJobOrderCount,
  getInterviewCount,
  getDeployedWorkerCount,
  getDashboardStats,
  updateApplicationStatus,
} from "../controllers/employer.controller.js";

const router = Router();

router.use(authorize);
router.use(authorizeRoles("EMPLOYER"));

router.get("/profile", getProfile);
router.patch("/profile", updateProfile);

// Job Orders CRUD
router.get("/job-orders", getJobOrders);
router.post("/job-orders", createJobOrder);
router.get("/job-orders/:id", getJobOrderById);
router.put("/job-orders/:id", updateJobOrder);
router.delete("/job-orders/:id", deleteJobOrder);

// Candidates
router.get("/candidates", getCandidates);
router.get("/candidates/:id", getCandidateById);

// Interviews
router.get("/interviews", getInterviews);
router.patch("/interviews/:applicationId/rating", updateInterviewRating);
router.post("/interviews/:applicationId/share-feedback", shareInterviewFeedback);

// Applications
router.patch("/applications/:applicationId/status", updateApplicationStatus);

// Documents
router.get("/documents", getDocuments);
router.post("/documents", uploadDocument);

// Pricing
router.get("/pricing", getPricing);

// Dashboard data
router.get("/upcoming-interviews", getUpcomingInterviews);
router.get("/recent-candidates", getRecentCandidates);
router.get("/candidate-count", getCandidateCount);
router.get("/job-order-count", getJobOrderCount);
router.get("/interview-count", getInterviewCount);
router.get("/deployed-worker-count", getDeployedWorkerCount);
router.get("/dashboard-stats", getDashboardStats);

export default router;
