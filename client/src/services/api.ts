import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
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
  (error) => {
    const message = error.response?.data?.message || "An error occurred";
    const status = error.response?.status;
    const currentPath = window.location.pathname;

    // Only redirect to login on 401 if we're NOT already on the login or register page
    // This prevents interrupting the login flow with invalid credentials
    if (
      status === 401 &&
      !currentPath.includes("/login") &&
      !currentPath.includes("/register")
    ) {
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
      toast.error("Session expired. Please login again.");
    } else if (status === 403) {
      toast.error("You do not have permission to perform this action.");
    } else if (status === 404) {
      toast.error("Resource not found.");
    } else if (status === 500) {
      toast.error("Server error. Please try again later.");
    }
    // Don't show toast for 401 on login/register pages - let the page handle it
    else if (status !== 401) {
      toast.error(message);
    }

    return Promise.reject(error);
  },
);

export default api;
