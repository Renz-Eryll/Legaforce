import api from "./api";

export const adminService = {
  async getDashboardStats() {
    try {
      const { data } = await api.get("/admin/dashboard-stats");
      return data;
    } catch (error) {
      console.error("Failed to fetch admin dashboard stats:", error);
      throw error;
    }
  },

  async getRecentActivity(limit: number = 5) {
    try {
      const { data } = await api.get(`/admin/recent-activity?limit=${limit}`);
      return data;
    } catch (error) {
      console.error("Failed to fetch recent activity:", error);
      throw error;
    }
  },

  async getPendingApprovals() {
    try {
      const { data } = await api.get("/admin/pending-approvals");
      return data;
    } catch (error) {
      console.error("Failed to fetch pending approvals:", error);
      throw error;
    }
  },

  async getComplaints(status?: string) {
    try {
      const params = status ? `?status=${status}` : "";
      const { data } = await api.get(`/admin/complaints${params}`);
      return data;
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
      throw error;
    }
  },

  async getDeploymentStats() {
    try {
      const { data } = await api.get("/admin/deployment-stats");
      return data;
    } catch (error) {
      console.error("Failed to fetch deployment stats:", error);
      throw error;
    }
  },

  async getApplicantCount() {
    try {
      const { data } = await api.get("/admin/applicant-count");
      return data;
    } catch (error) {
      console.error("Failed to fetch applicant count:", error);
      throw error;
    }
  },

  async getEmployerCount() {
    try {
      const { data } = await api.get("/admin/employer-count");
      return data;
    } catch (error) {
      console.error("Failed to fetch employer count:", error);
      throw error;
    }
  },

  async getJobOrderCount(status?: string) {
    try {
      const params = status ? `?status=${status}` : "";
      const { data } = await api.get(`/admin/job-order-count${params}`);
      return data;
    } catch (error) {
      console.error("Failed to fetch job order count:", error);
      throw error;
    }
  },

  async getDeploymentCount() {
    try {
      const { data } = await api.get("/admin/deployment-count");
      return data;
    } catch (error) {
      console.error("Failed to fetch deployment count:", error);
      throw error;
    }
  },
};
