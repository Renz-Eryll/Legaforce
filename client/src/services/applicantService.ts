import api from "./api";

// Response shape: backend typically returns { success, data, message }
const getData = <T>(res: { data?: { data?: T } }): T | undefined =>
  res.data?.data ?? res.data;

export const applicantService = {
  async getProfile() {
    try {
      const res = await api.get("/applicant/profile");
      return getData(res) ?? res.data;
    } catch (error) {
      console.error("Failed to fetch applicant profile:", error);
      throw error;
    }
  },

  async getApplications() {
    try {
      const res = await api.get("/applicant/applications");
      return getData(res) ?? res.data;
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      throw error;
    }
  },

  async getApplication(id: string) {
    try {
      const res = await api.get(`/applicant/applications/${id}`);
      return getData(res) ?? res.data;
    } catch (error) {
      console.error("Failed to fetch application:", error);
      throw error;
    }
  },

  async getApplicationStats() {
    try {
      const res = await api.get("/applicant/application-stats");
      return getData(res) ?? res.data;
    } catch (error) {
      console.error("Failed to fetch application stats:", error);
      throw error;
    }
  },

  async getNotifications() {
    try {
      const res = await api.get("/applicant/notifications");
      return getData(res) ?? res.data;
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      throw error;
    }
  },

  async getRecommendedJobs() {
    try {
      const res = await api.get("/applicant/recommended-jobs");
      return getData(res) ?? res.data;
    } catch (error) {
      console.error("Failed to fetch recommended jobs:", error);
      throw error;
    }
  },

  async getSavedJobs() {
    try {
      const res = await api.get("/applicant/saved-jobs");
      return getData(res) ?? res.data;
    } catch (error) {
      console.error("Failed to fetch saved jobs:", error);
      throw error;
    }
  },

  async getProfileCompletion() {
    try {
      const res = await api.get("/applicant/profile-completion");
      return getData(res) ?? res.data;
    } catch (error) {
      console.error("Failed to fetch profile completion:", error);
      throw error;
    }
  },

  async getRewardPoints() {
    try {
      const res = await api.get("/applicant/reward-points");
      return getData(res) ?? res.data;
    } catch (error) {
      console.error("Failed to fetch reward points:", error);
      throw error;
    }
  },

  async getProfileViews() {
    try {
      const res = await api.get("/applicant/profile-views");
      return getData(res) ?? res.data;
    } catch (error) {
      console.error("Failed to fetch profile views:", error);
      throw error;
    }
  },

  async getMatchScore() {
    try {
      const res = await api.get("/applicant/match-score");
      return getData(res) ?? res.data;
    } catch (error) {
      console.error("Failed to fetch match score:", error);
      throw error;
    }
  },

  // ----- CV Builder (one-time registration, AI CV) -----
  async getCV() {
    try {
      const res = await api.get("/applicant/cv");
      return getData(res) ?? res.data;
    } catch (error) {
      console.error("Failed to fetch CV:", error);
      throw error;
    }
  },

  async saveCV(payload: {
    personalInfo?: Record<string, string>;
    summary?: string;
    experience?: Array<Record<string, string>>;
    education?: Array<Record<string, string>>;
    skills?: string[];
    certifications?: Array<Record<string, string>>;
  }) {
    try {
      const res = await api.put("/applicant/cv", payload);
      return getData(res) ?? res.data;
    } catch (error) {
      console.error("Failed to save CV:", error);
      throw error;
    }
  },

  async generateAICV() {
    try {
      const res = await api.post("/applicant/cv/generate");
      return getData(res) ?? res.data;
    } catch (error) {
      console.error("Failed to generate AI CV:", error);
      throw error;
    }
  },

  // ----- Complaints (Worker Safety - confidential report) -----
  async getComplaints(params?: { status?: string }) {
    try {
      const res = await api.get("/applicant/complaints", { params });
      return getData(res) ?? res.data;
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
      throw error;
    }
  },

  async createComplaint(payload: {
    category: string;
    subject?: string;
    description: string;
  }) {
    try {
      const res = await api.post("/applicant/complaints", payload);
      return getData(res) ?? res.data;
    } catch (error) {
      console.error("Failed to submit complaint:", error);
      throw error;
    }
  },

  // ----- Rewards & Trust Score -----
  async getRewardHistory(params?: { limit?: number }) {
    try {
      const res = await api.get("/applicant/rewards/history", { params });
      return getData(res) ?? res.data;
    } catch (error) {
      console.error("Failed to fetch reward history:", error);
      throw error;
    }
  },

  async getRewardCatalog() {
    try {
      const res = await api.get("/applicant/rewards/catalog");
      return getData(res) ?? res.data;
    } catch (error) {
      console.error("Failed to fetch reward catalog:", error);
      throw error;
    }
  },

  async redeemReward(rewardId: string) {
    try {
      const res = await api.post("/applicant/rewards/redeem", { rewardId });
      return getData(res) ?? res.data;
    } catch (error) {
      console.error("Failed to redeem reward:", error);
      throw error;
    }
  },

  // ----- Jobs (browse, apply, saved, auto-apply) -----
  async getJobs(params?: {
    search?: string;
    location?: string;
    salary?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const res = await api.get("/applicant/jobs", { params });
      return getData(res) ?? res.data;
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      throw error;
    }
  },

  async getJob(id: string) {
    try {
      const res = await api.get(`/applicant/jobs/${id}`);
      return getData(res) ?? res.data;
    } catch (error) {
      console.error("Failed to fetch job:", error);
      throw error;
    }
  },

  async applyToJob(jobId: string) {
    try {
      const res = await api.post(`/applicant/jobs/${jobId}/apply`);
      return getData(res) ?? res.data;
    } catch (error) {
      console.error("Failed to apply:", error);
      throw error;
    }
  },

  async setAutoApply(enabled: boolean) {
    try {
      const res = await api.patch("/applicant/settings/auto-apply", {
        autoApplyToMatching: enabled,
      });
      return getData(res) ?? res.data;
    } catch (error) {
      console.error("Failed to update auto-apply:", error);
      throw error;
    }
  },
};
