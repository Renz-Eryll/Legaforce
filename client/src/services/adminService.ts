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

  async getApplications(status?: string, page: number = 1, limit: number = 20) {
    try {
      let url = `/admin/applications?page=${page}&limit=${limit}`;
      if (status) url += `&status=${status}`;
      const { data } = await api.get(url);
      return data;
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      throw error;
    }
  },

  async getApplicationDetail(id: string) {
    try {
      const { data } = await api.get(`/admin/applications/${id}`);
      return data;
    } catch (error) {
      console.error("Failed to fetch application detail:", error);
      throw error;
    }
  },

  async updateApplicationStatus(id: string, status: string) {
    try {
      const { data } = await api.patch(`/admin/applications/${id}/status`, {
        status,
      });
      return data;
    } catch (error) {
      console.error("Failed to update application status:", error);
      throw error;
    }
  },

  async getDeployments() {
    try {
      const { data } = await api.get("/admin/deployments");
      return data;
    } catch (error) {
      console.error("Failed to fetch deployments:", error);
      throw error;
    }
  },

  async getDeploymentDetail(id: string) {
    try {
      const { data } = await api.get(`/admin/deployments/${id}`);
      return data;
    } catch (error) {
      console.error("Failed to fetch deployment detail:", error);
      throw error;
    }
  },

  async updateDeploymentStatus(id: string, updates: any) {
    try {
      const { data } = await api.patch(`/admin/deployments/${id}`, updates);
      return data;
    } catch (error) {
      console.error("Failed to update deployment:", error);
      throw error;
    }
  },

  async getJobOrders(status?: string, page: number = 1, limit: number = 20) {
    try {
      let url = `/admin/job-orders?page=${page}&limit=${limit}`;
      if (status) url += `&status=${status}`;
      const { data } = await api.get(url);
      return data;
    } catch (error) {
      console.error("Failed to fetch job orders:", error);
      throw error;
    }
  },

  async getInvoices(status?: string) {
    try {
      let url = "/admin/invoices";
      if (status) url += `?status=${status}`;
      const { data } = await api.get(url);
      return data;
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
      throw error;
    }
  },

  async updateInvoiceStatus(id: string, status: string) {
    try {
      const { data } = await api.patch(`/admin/invoices/${id}/status`, {
        status,
      });
      return data;
    } catch (error) {
      console.error("Failed to update invoice status:", error);
      throw error;
    }
  },

  async getComplaints(status?: string) {
    try {
      let url = "/admin/complaints";
      if (status) url += `?status=${status}`;
      const { data } = await api.get(url);
      return data;
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
      throw error;
    }
  },

  async updateComplaint(id: string, updates: any) {
    try {
      const { data } = await api.patch(`/admin/complaints/${id}`, updates);
      return data;
    } catch (error) {
      console.error("Failed to update complaint:", error);
      throw error;
    }
  },

  async getApplicants(page: number = 1, limit: number = 20) {
    try {
      const { data } = await api.get(
        `/admin/applicants?page=${page}&limit=${limit}`,
      );
      return data;
    } catch (error) {
      console.error("Failed to fetch applicants:", error);
      throw error;
    }
  },

  async getEmployers(page: number = 1, limit: number = 20) {
    try {
      const { data } = await api.get(
        `/admin/employers?page=${page}&limit=${limit}`,
      );
      return data;
    } catch (error) {
      console.error("Failed to fetch employers:", error);
      throw error;
    }
  },

  async verifyEmployer(id: string, isVerified: boolean) {
    try {
      const { data } = await api.patch(`/admin/employers/${id}/verify`, {
        isVerified,
      });
      return data;
    } catch (error) {
      console.error("Failed to verify employer:", error);
      throw error;
    }
  },

  async getVerificationQueue() {
    try {
      const { data } = await api.get("/admin/verification-queue");
      return data;
    } catch (error) {
      console.error("Failed to fetch verification queue:", error);
      throw error;
    }
  },

  async getUserDetail(userId: string) {
    try {
      const { data } = await api.get(`/admin/users/${userId}`);
      return data;
    } catch (error) {
      console.error("Failed to fetch user detail:", error);
      throw error;
    }
  },
};
