import api from "./api";

export const applicantService = {
  async getProfile() {
    try {
      const { data } = await api.get("/applicant/profile");
      return data;
    } catch (error) {
      console.error("Failed to fetch applicant profile:", error);
      throw error;
    }
  },

  async getApplications() {
    try {
      const { data } = await api.get("/applicant/applications");
      return data;
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      throw error;
    }
  },

  async getApplicationStats() {
    try {
      const { data } = await api.get("/applicant/application-stats");
      return data;
    } catch (error) {
      console.error("Failed to fetch application stats:", error);
      throw error;
    }
  },

  async getNotifications() {
    try {
      const { data } = await api.get("/applicant/notifications");
      return data;
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      throw error;
    }
  },

  async getRecommendedJobs() {
    try {
      const { data } = await api.get("/applicant/recommended-jobs");
      return data;
    } catch (error) {
      console.error("Failed to fetch recommended jobs:", error);
      throw error;
    }
  },

  async getSavedJobs() {
    try {
      const { data } = await api.get("/applicant/saved-jobs");
      return data;
    } catch (error) {
      console.error("Failed to fetch saved jobs:", error);
      throw error;
    }
  },

  async getProfileCompletion() {
    try {
      const { data } = await api.get("/applicant/profile-completion");
      return data;
    } catch (error) {
      console.error("Failed to fetch profile completion:", error);
      throw error;
    }
  },

  async getRewardPoints() {
    try {
      const { data } = await api.get("/applicant/reward-points");
      return data;
    } catch (error) {
      console.error("Failed to fetch reward points:", error);
      throw error;
    }
  },

  async getProfileViews() {
    try {
      const { data } = await api.get("/applicant/profile-views");
      return data;
    } catch (error) {
      console.error("Failed to fetch profile views:", error);
      throw error;
    }
  },

  async getMatchScore() {
    try {
      const { data } = await api.get("/applicant/match-score");
      return data;
    } catch (error) {
      console.error("Failed to fetch match score:", error);
      throw error;
    }
  },
};
