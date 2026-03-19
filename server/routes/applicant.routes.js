import { Router } from "express";
import { authorize, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
  getProfile,
  updateProfile,
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
  saveJob,
  unsaveJob,
  getMatchScore,
  getProfileViews,
  getApplicationStats,
  getRewardHistory,
  getRewardCatalog,
  redeemReward,
  getDocuments,
  uploadDocument,
  deleteDocument,
} from "../controllers/applicant.controller.js";

import { validateRequest } from "../middlewares/validation.middleware.js";
import {
  jobApplicationSchema,
  profileUpdateSchema,
} from "../services/validation.service.js";

const router = Router();

router.use(authorize);
router.use(authorizeRoles("APPLICANT"));

// Profile
router.get("/profile", getProfile);
router.put("/profile", validateRequest(profileUpdateSchema), updateProfile);
router.get("/profile-completion", getProfileCompletion);
router.get("/profile-views", getProfileViews);
router.get("/match-score", getMatchScore);

// Applications
router.get("/applications", getApplications);
router.get("/applications/:id", getApplicationById);
router.get("/application-stats", getApplicationStats);

// Complaints (Worker Safety & Protection)
router.get("/complaints", getComplaints);
router.post("/complaints", createComplaint);

// CV Builder (AI-powered)
router.get("/cv", getCV);
router.put("/cv", saveCV);
router.post("/cv/generate", generateAICV);

// Jobs (browse, save, apply)
router.get("/jobs", getJobs);
router.get("/jobs/:id", getJobById);
router.post("/jobs/:id/apply", validateRequest(jobApplicationSchema), applyToJob);

// Saved Jobs
router.get("/saved-jobs", getSavedJobs);
router.post("/saved-jobs", saveJob);
router.delete("/saved-jobs", unsaveJob);

// Rewards & Trust Score
router.get("/reward-points", getRewardPoints);
router.get("/rewards/history", getRewardHistory);
router.get("/rewards/catalog", getRewardCatalog);
router.post("/rewards/redeem", redeemReward);

// Dashboard data
router.get("/notifications", getNotifications);
router.get("/recommended-jobs", getRecommendedJobs);

// Documents
router.get("/documents", getDocuments);
router.post("/documents", uploadDocument);
router.delete("/documents/:id", deleteDocument);

export default router;
