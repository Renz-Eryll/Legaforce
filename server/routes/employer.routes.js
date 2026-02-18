import { Router } from "express";
import { authorize, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
  getProfile,
  updateProfile,
  getJobOrders,
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
} from "../controllers/employer.controller.js";

const router = Router();

router.use(authorize);
router.use(authorizeRoles("EMPLOYER"));

router.get("/profile", getProfile);
router.patch("/profile", updateProfile);
router.get("/job-orders", getJobOrders);
router.get("/candidates", getCandidates);
router.get("/candidates/:id", getCandidateById);
router.get("/interviews", getInterviews);
router.patch("/interviews/:applicationId/rating", updateInterviewRating);
router.post("/interviews/:applicationId/share-feedback", shareInterviewFeedback);
router.get("/documents", getDocuments);
router.post("/documents", uploadDocument);
router.get("/pricing", getPricing);
router.get("/upcoming-interviews", getUpcomingInterviews);
router.get("/recent-candidates", getRecentCandidates);
router.get("/candidate-count", getCandidateCount);
router.get("/job-order-count", getJobOrderCount);
router.get("/interview-count", getInterviewCount);
router.get("/deployed-worker-count", getDeployedWorkerCount);
router.get("/dashboard-stats", getDashboardStats);

export default router;
