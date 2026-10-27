import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
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
  lastChecked: number | null;

  login: (email: string, password: string) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

// Only re-verify auth if it's been more than 5 minutes since last check
const AUTH_CHECK_INTERVAL = 5 * 60 * 1000;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,
      lastChecked: null,

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
                lastChecked: Date.now(),
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
                lastChecked: Date.now(),
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
        // Fire-and-forget: the token is removed locally even if the request fails
        authService.logout().catch(() => {});
        set({
          user: null,
          isAuthenticated: false,
          error: null,
          lastChecked: null,
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

        // Skip API call if we checked recently and already have user data
        const { lastChecked, user } = get();
        if (user && lastChecked && Date.now() - lastChecked < AUTH_CHECK_INTERVAL) {
          set({ isLoading: false });
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
              lastChecked: Date.now(),
            });
          } else {
            throw new Error("Failed to get user");
          }
        } catch (error) {
          // Only a 401 means the session is invalid. Network errors, timeouts and 503s
          // (e.g. DB cold start) shouldn't log the user out — keep the persisted user.
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            localStorage.removeItem("auth_token");
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
              lastChecked: null,
            });
          } else {
            console.error("Auth check failed:", error);
            set({ isLoading: false });
          }
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
        lastChecked: state.lastChecked,
      }),
    },
  ),
);
