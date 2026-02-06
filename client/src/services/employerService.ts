import api from "./api";

export const employerService = {
  async getProfile() {
    try {
      const { data } = await api.get("/employer/profile");
      return data;
    } catch (error) {
      console.error("Failed to fetch employer profile:", error);
      throw error;
    }
  },

  async getJobOrders(status?: string) {
    try {
      const params = status ? `?status=${status}` : "";
      const { data } = await api.get(`/employer/job-orders${params}`);
      return data;
    } catch (error) {
      console.error("Failed to fetch job orders:", error);
      throw error;
    }
  },

  async getDashboardStats() {
    try {
      const { data } = await api.get("/employer/dashboard-stats");
      return data;
    } catch (error) {
      console.error("Failed to fetch employer dashboard stats:", error);
      throw error;
    }
  },

  async getUpcomingInterviews() {
    try {
      const { data } = await api.get("/employer/upcoming-interviews");
      return data;
    } catch (error) {
      console.error("Failed to fetch upcoming interviews:", error);
      throw error;
    }
  },

  async getRecentCandidates() {
    try {
      const { data } = await api.get("/employer/recent-candidates");
      return data;
    } catch (error) {
      console.error("Failed to fetch recent candidates:", error);
      throw error;
    }
  },

  async getCandidateCount() {
    try {
      const { data } = await api.get("/employer/candidate-count");
      return data;
    } catch (error) {
      console.error("Failed to fetch candidate count:", error);
      throw error;
    }
  },

  async getJobOrderCount(status?: string) {
    try {
      const params = status ? `?status=${status}` : "";
      const { data } = await api.get(`/employer/job-order-count${params}`);
      return data;
    } catch (error) {
      console.error("Failed to fetch job order count:", error);
      throw error;
    }
  },

  async getInterviewCount() {
    try {
      const { data } = await api.get("/employer/interview-count");
      return data;
    } catch (error) {
      console.error("Failed to fetch interview count:", error);
      throw error;
    }
  },

  async getDeployedWorkerCount() {
    try {
      const { data } = await api.get("/employer/deployed-worker-count");
      return data;
    } catch (error) {
      console.error("Failed to fetch deployed worker count:", error);
      throw error;
    }
  },
};
