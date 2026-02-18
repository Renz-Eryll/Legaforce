import api from "./api";

const getData = <T>(res: { data?: { data?: T } }): T | undefined =>
  res.data?.data ?? res.data;

export const employerService = {
  async getProfile() {
    try {
      const res = await api.get("/employer/profile");
      return getData(res) ?? res.data;
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
      return getData(res) ?? res.data;
    } catch (error) {
      console.error("Failed to update employer profile:", error);
      throw error;
    }
  },

  async getJobOrders(status?: string) {
    try {
      const params = status ? { status } : {};
      const res = await api.get("/employer/job-orders", { params });
      return getData(res) ?? res.data;
    } catch (error) {
      console.error("Failed to fetch job orders:", error);
      throw error;
    }
  },

  async getDashboardStats() {
    try {
      const res = await api.get("/employer/dashboard-stats");
      return getData(res) ?? res.data;
    } catch (error) {
      console.error("Failed to fetch employer dashboard stats:", error);
      throw error;
    }
  },

  async getUpcomingInterviews() {
    try {
      const res = await api.get("/employer/upcoming-interviews");
      return getData(res) ?? res.data;
    } catch (error) {
      console.error("Failed to fetch upcoming interviews:", error);
      throw error;
    }
  },

  async getRecentCandidates() {
    try {
      const res = await api.get("/employer/recent-candidates");
      return getData(res) ?? res.data;
    } catch (error) {
      console.error("Failed to fetch recent candidates:", error);
      throw error;
    }
  },

  async getCandidateCount() {
    try {
      const res = await api.get("/employer/candidate-count");
      return getData(res) ?? res.data;
    } catch (error) {
      console.error("Failed to fetch candidate count:", error);
      throw error;
    }
  },

  async getJobOrderCount(status?: string) {
    try {
      const params = status ? { status } : {};
      const res = await api.get("/employer/job-order-count", { params });
      return getData(res) ?? res.data;
    } catch (error) {
      console.error("Failed to fetch job order count:", error);
      throw error;
    }
  },

  async getInterviewCount() {
    try {
      const res = await api.get("/employer/interview-count");
      return getData(res) ?? res.data;
    } catch (error) {
      console.error("Failed to fetch interview count:", error);
      throw error;
    }
  },

  async getDeployedWorkerCount() {
    try {
      const res = await api.get("/employer/deployed-worker-count");
      return getData(res) ?? res.data;
    } catch (error) {
      console.error("Failed to fetch deployed worker count:", error);
      throw error;
    }
  },

  // ----- Smart Candidate Search -----
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
      return getData(res) ?? res.data;
    } catch (error) {
      console.error("Failed to fetch candidates:", error);
      throw error;
    }
  },

  async getCandidate(id: string) {
    try {
      const res = await api.get(`/employer/candidates/${id}`);
      return getData(res) ?? res.data;
    } catch (error) {
      console.error("Failed to fetch candidate:", error);
      throw error;
    }
  },

  // ----- Interviews (video, record & rate, share feedback) -----
  async getInterviews(params?: { status?: string }) {
    try {
      const res = await api.get("/employer/interviews", { params });
      return getData(res) ?? res.data;
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
      return getData(res) ?? res.data;
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
      return getData(res) ?? res.data;
    } catch (error) {
      console.error("Failed to share feedback:", error);
      throw error;
    }
  },

  // ----- Documents & Verification -----
  async getDocuments() {
    try {
      const res = await api.get("/employer/documents");
      return getData(res) ?? res.data;
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
      return getData(res) ?? res.data;
    } catch (error) {
      console.error("Failed to upload document:", error);
      throw error;
    }
  },

  // ----- Pricing (transparent pricing dashboard) -----
  async getPricing() {
    try {
      const res = await api.get("/employer/pricing");
      return getData(res) ?? res.data;
    } catch (error) {
      console.error("Failed to fetch pricing:", error);
      throw error;
    }
  },
};
