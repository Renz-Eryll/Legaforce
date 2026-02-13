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
    token?: string;
    user?: any;
    requiresVerification?: boolean;
    email?: string;
  };
}

interface VerifyEmailData {
  email: string;
  otp: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/sign-in", credentials);

    // Check if verification is required
    if (data.success && data.data?.requiresVerification) {
      return data;
    }

    // Only store token if login was actually successful
    if (data.success && data.data?.token) {
      localStorage.setItem("auth_token", data.data.token);
      return data;
    } else {
      throw new Error(data.message || "Login failed");
    }
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/sign-up", userData);

    // Registration now requires verification, don't store token
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || "Registration failed");
    }
  },

  async verifyEmail(verifyData: VerifyEmailData): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>(
      "/auth/verify-email",
      verifyData,
    );

    // Store token after successful verification
    if (data.success && data.data?.token) {
      localStorage.setItem("auth_token", data.data.token);
      return data;
    } else {
      throw new Error(data.message || "Verification failed");
    }
  },

  async resendOtp(email: string): Promise<{ success: boolean; message?: string }> {
    const { data } = await api.post("/auth/resend-otp", { email });
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
