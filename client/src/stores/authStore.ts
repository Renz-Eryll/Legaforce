import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "@/services/authService";

interface User {
  id: string;
  email: string;
  role: "APPLICANT" | "EMPLOYER" | "ADMIN";
  profile?: any;
  employer?: any;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      login: async (email, password) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authService.login({ email, password });

          if (response.success) {
            // Only set user if we have the data (meaning no verification needed or login complete)
            if (response.data && response.data.user) {
              set({
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
            } else {
              set({ isLoading: false });
            }
            return response;
          } else {
            const errorMsg = response.message || "Login failed";
            throw new Error(errorMsg);
          }
        } catch (error: any) {
          const errorMessage = error.message || "Login failed";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (userData) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authService.register(userData);

          if (response.success) {
             // Only set user if we have the data (meaning no verification needed - which shouldn't happen for register now)
             if (response.data && response.data.user) {
              set({
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
            } else {
              set({ isLoading: false });
            }
            return response;
          } else {
            const errorMsg = response.message || "Registration failed";
            throw new Error(errorMsg);
          }
        } catch (error: any) {
          const errorMessage = error.message || "Registration failed";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        try {
          authService.logout();
        } catch (error) {
          console.error("Logout error:", error);
        }
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      checkAuth: async () => {
        const token = localStorage.getItem("auth_token");

        if (!token) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return;
        }

        try {
          const response = await authService.getCurrentUser();
          if (response.success && response.data) {
            set({
              user: response.data,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error("Failed to get user");
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.removeItem("auth_token");
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
