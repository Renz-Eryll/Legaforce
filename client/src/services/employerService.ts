import api from "./api";

const getData = <T>(res: { data?: { data?: T } }): T | undefined =>
  res.data?.data ?? (res.data as T | undefined);

export const employerService = {
  // ───── Profile ─────
  async getProfile() {
    try {
      const res = await api.get("/employer/profile");
      return getData(res);
    } catch (error) {
      console.error("Failed to fetch employer profile:", error);
      throw error;
    }
  },

  async updateProfile(payload: {
    companyName?: string;
    contactPerson?: string;
    phone?: string;
    country?: string;
    clientType?: "company" | "personal";
    [key: string]: unknown;
  }) {
    try {
      const res = await api.patch("/employer/profile", payload);
      return getData(res);
    } catch (error) {
      console.error("Failed to update employer profile:", error);
      throw error;
    }
  },

  // ───── Job Orders CRUD ─────
  async getJobOrders(status?: string) {
    try {
      const params = status ? { status } : {};
      const res = await api.get("/employer/job-orders", { params });
      return getData<any[]>(res) ?? [];
    } catch (error) {
      console.error("Failed to fetch job orders:", error);
      throw error;
    }
  },

  async getJobOrder(id: string) {
    try {
      const res = await api.get(`/employer/job-orders/${id}`);
      return getData(res);
    } catch (error) {
      console.error("Failed to fetch job order:", error);
      throw error;
    }
  },

  async createJobOrder(payload: {
    title: string;
    description: string;
    requirements?: Record<string, unknown>;
    salary?: number | string;
    location: string;
    positions?: number;
    status?: string;
  }) {
    try {
      const res = await api.post("/employer/job-orders", payload);
      return getData(res);
    } catch (error) {
      console.error("Failed to create job order:", error);
      throw error;
    }
  },

  async updateJobOrder(
    id: string,
    payload: {
      title?: string;
      description?: string;
      requirements?: Record<string, unknown>;
      salary?: number | string;
      location?: string;
      positions?: number;
      status?: string;
    }
  ) {
    try {
      const res = await api.put(`/employer/job-orders/${id}`, payload);
      return getData(res);
    } catch (error) {
      console.error("Failed to update job order:", error);
      throw error;
    }
  },

  async deleteJobOrder(id: string) {
    try {
      const res = await api.delete(`/employer/job-orders/${id}`);
      return getData(res);
    } catch (error) {
      console.error("Failed to delete job order:", error);
      throw error;
    }
  },

  // ───── Dashboard Stats ─────
  async getDashboardStats() {
    try {
      const res = await api.get("/employer/dashboard-stats");
      return getData(res);
    } catch (error) {
      console.error("Failed to fetch employer dashboard stats:", error);
      throw error;
    }
  },

  async getUpcomingInterviews() {
    try {
      const res = await api.get("/employer/upcoming-interviews");
      return getData<any[]>(res) ?? [];
    } catch (error) {
      console.error("Failed to fetch upcoming interviews:", error);
      throw error;
    }
  },

  async getRecentCandidates() {
    try {
      const res = await api.get("/employer/recent-candidates");
      return getData<any[]>(res) ?? [];
    } catch (error) {
      console.error("Failed to fetch recent candidates:", error);
      throw error;
    }
  },

  async getCandidateCount() {
    try {
      const res = await api.get("/employer/candidate-count");
      return getData<number>(res) ?? 0;
    } catch (error) {
      console.error("Failed to fetch candidate count:", error);
      throw error;
    }
  },

  async getJobOrderCount(status?: string) {
    try {
      const params = status ? { status } : {};
      const res = await api.get("/employer/job-order-count", { params });
      return getData<number>(res) ?? 0;
    } catch (error) {
      console.error("Failed to fetch job order count:", error);
      throw error;
    }
  },

  async getInterviewCount() {
    try {
      const res = await api.get("/employer/interview-count");
      return getData<number>(res) ?? 0;
    } catch (error) {
      console.error("Failed to fetch interview count:", error);
      throw error;
    }
  },

  async getDeployedWorkerCount() {
    try {
      const res = await api.get("/employer/deployed-worker-count");
      return getData<number>(res) ?? 0;
    } catch (error) {
      console.error("Failed to fetch deployed worker count:", error);
      throw error;
    }
  },

  // ───── Smart Candidate Search ─────
  async getCandidates(params?: {
    search?: string;
    skills?: string;
    experience?: string;
    nationality?: string;
    availability?: string;
    status?: string;
    aiOnly?: boolean;
    page?: number;
    limit?: number;
  }) {
    try {
      const res = await api.get("/employer/candidates", { params });
      return getData<any[]>(res) ?? [];
    } catch (error) {
      console.error("Failed to fetch candidates:", error);
      throw error;
    }
  },

  async getCandidate(id: string) {
    try {
      const res = await api.get(`/employer/candidates/${id}`);
      return getData(res);
    } catch (error) {
      console.error("Failed to fetch candidate:", error);
      throw error;
    }
  },

  // ───── Interviews ─────
  async getInterviews(params?: { status?: string }) {
    try {
      const res = await api.get("/employer/interviews", { params });
      return getData<any[]>(res) ?? [];
    } catch (error) {
      console.error("Failed to fetch interviews:", error);
      throw error;
    }
  },

  async updateInterviewRating(
    applicationId: string,
    payload: { rating: number; notes?: string }
  ) {
    try {
      const res = await api.patch(
        `/employer/interviews/${applicationId}/rating`,
        payload
      );
      return getData(res);
    } catch (error) {
      console.error("Failed to update interview rating:", error);
      throw error;
    }
  },

  async shareInterviewFeedback(applicationId: string) {
    try {
      const res = await api.post(
        `/employer/interviews/${applicationId}/share-feedback`
      );
      return getData(res);
    } catch (error) {
      console.error("Failed to share feedback:", error);
      throw error;
    }
  },

  // ───── Application Status ─────
  async updateApplicationStatus(
    applicationId: string,
    payload: { status: string; notes?: string }
  ) {
    try {
      const res = await api.patch(
        `/employer/applications/${applicationId}/status`,
        payload
      );
      return getData(res);
    } catch (error) {
      console.error("Failed to update application status:", error);
      throw error;
    }
  },

  // ───── Documents & Verification ─────
  async getDocuments() {
    try {
      const res = await api.get("/employer/documents");
      return getData<any[]>(res) ?? [];
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      throw error;
    }
  },

  async uploadDocument(formData: FormData) {
    try {
      const res = await api.post("/employer/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return getData(res);
    } catch (error) {
      console.error("Failed to upload document:", error);
      throw error;
    }
  },

  // ───── Pricing ─────
  async getPricing() {
    try {
      const res = await api.get("/employer/pricing");
      return getData(res);
    } catch (error) {
      console.error("Failed to fetch pricing:", error);
      throw error;
    }
  },
};
