import { Router } from "express";
import { authorize, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
  getProfile,
  getApplications,
  getApplicationById,
  getComplaints,
  createComplaint,
  getCV,
  saveCV,
  generateAICV,
  getRewardPoints,
  getJobs,
  getJobById,
  applyToJob,
  getProfileCompletion,
  getNotifications,
  getRecommendedJobs,
  getSavedJobs,
  getMatchScore,
  getProfileViews,
  getApplicationStats,
  getRewardHistory,
  getRewardCatalog,
  redeemReward,
} from "../controllers/applicant.controller.js";

const router = Router();

router.use(authorize);
router.use(authorizeRoles("APPLICANT"));

router.get("/profile", getProfile);
router.get("/applications", getApplications);
router.get("/applications/:id", getApplicationById);
router.get("/complaints", getComplaints);
router.post("/complaints", createComplaint);
router.get("/cv", getCV);
router.put("/cv", saveCV);
router.post("/cv/generate", generateAICV);
router.get("/reward-points", getRewardPoints);
router.get("/rewards/history", getRewardHistory);
router.get("/rewards/catalog", getRewardCatalog);
router.post("/rewards/redeem", redeemReward);
router.get("/jobs", getJobs);
router.get("/jobs/:id", getJobById);
router.post("/jobs/:id/apply", applyToJob);
router.get("/profile-completion", getProfileCompletion);
router.get("/notifications", getNotifications);
router.get("/recommended-jobs", getRecommendedJobs);
router.get("/saved-jobs", getSavedJobs);
router.get("/match-score", getMatchScore);
router.get("/profile-views", getProfileViews);
router.get("/application-stats", getApplicationStats);

export default router;
