import axios from "axios";
import { toast } from "sonner";
import { API_BASE_URL } from "@/utils/constants";

// Set when a 401 triggers a redirect so concurrent failing requests don't redirect/toast again
let isRedirectingToLogin = false;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 15000, // 15s timeout to handle slow cold starts
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // No response at all — offline, CORS failure, or request timeout
    if (!error.response) {
      if (!axios.isCancel(error)) {
        toast.error(
          error.code === "ECONNABORTED"
            ? "Request timed out. Please try again."
            : "Network error. Please check your connection.",
        );
      }
      return Promise.reject(error);
    }

    const message =
      error.response.data?.message || error.response.data?.error || "An error occurred";
    const status = error.response.status;
    const currentPath = window.location.pathname;

    // 401 — Real auth failure (expired token, invalid token, deactivated user)
    // Only redirect if NOT on an auth page
    if (status === 401 && !/^\/(login|register|verify-email)/.test(currentPath)) {
      if (!isRedirectingToLogin) {
        isRedirectingToLogin = true;
        localStorage.removeItem("auth_token");
        // Also clear the persisted auth store, otherwise isAuthenticated survives the reload
        localStorage.removeItem("auth-storage");
        // The page reloads, so LoginPage shows this message instead of a toast here
        sessionStorage.setItem("auth_message", "Session expired. Please login again.");
        window.location.replace("/login");
      }
    }
    // 503 — Transient server/DB issue. Do NOT log the user out.
    // Retry the request once automatically.
    else if (status === 503) {
      const config = error.config;
      // Only retry once (check custom flag)
      if (!config._retried) {
        config._retried = true;
        toast.info("Reconnecting...");
        await new Promise((r) => setTimeout(r, 1500));
        return api(config);
      }
      toast.error("Server is temporarily unavailable. Please try again in a moment.");
    }
    // 403 — Forbidden
    else if (status === 403) {
      toast.error("You do not have permission to perform this action.");
    }
    // 500 — Server error
    else if (status === 500) {
      toast.error("Server error. Please try again later.");
    }
    // Don't show toast for 401 on login/register pages - let the page handle it
    // Don't show generic toast for 404 to avoid noisy UI when lists/resources are naturally empty
    else if (status !== 401 && status !== 404) {
      toast.error(message);
    }

    return Promise.reject(error);
  },
);

export default api;
