import api from "./api";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: "APPLICANT" | "EMPLOYER";
}

interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      role: "APPLICANT" | "EMPLOYER" | "ADMIN";
      profile?: any;
      employer?: any;
    };
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/sign-in", credentials);
    if (data.success && data.data?.token) {
      localStorage.setItem("auth_token", data.data.token);
    }
    return data;
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/sign-up", userData);
    if (data.success && data.data?.token) {
      localStorage.setItem("auth_token", data.data.token);
    }
    return data;
  },

  async logout(): Promise<void> {
    try {
      await api.post("/auth/sign-out");
    } finally {
      localStorage.removeItem("auth_token");
    }
  },

  async getCurrentUser() {
    const { data } = await api.get("/auth/me");
    return data;
  },

  async refreshToken(): Promise<string | null> {
    try {
      const { data } = await api.post<{ token: string }>("/auth/refresh");
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
        return data.token;
      }
      return null;
    } catch {
      return null;
    }
  },
};
