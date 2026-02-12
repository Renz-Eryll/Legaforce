// src/hooks/useAuth.ts
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function useAuth() {
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: loginStore,
    logout: logoutStore,
    checkAuth,
    clearError,
  } = useAuthStore();

  const login = async (
    email: string,
    password: string,
    redirectPath?: string,
  ) => {
    try {
      const response = await loginStore(email, password);

      if (response?.data?.requiresVerification) {
        toast.info(response.message || "Please verify your email");
        navigate("/verify-email", { state: { email: response.data.email } });
        return;
      }

      toast.success("Login successful!");

      // Redirect based on role
      if (redirectPath) {
        navigate(redirectPath);
      } else if (user?.role === "APPLICANT") {
        navigate("/app/dashboard");
      } else if (user?.role === "EMPLOYER") {
        navigate("/employer/dashboard");
      } else if (user?.role === "ADMIN") {
        navigate("/admin/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed");
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await useAuthStore.getState().register(userData);
      
      if (response?.data?.requiresVerification) {
        toast.success(response.message || "Please check your email for the code");
        navigate("/verify-email", { state: { email: response.data.email } });
      } else {
        toast.success("Registration successful!");
        navigate("/login");
      }
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
      throw error;
    }
  };

  const logout = () => {
    logoutStore();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    checkAuth,
    clearError,
  };
}
