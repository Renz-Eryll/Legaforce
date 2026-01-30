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

    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
      toast.error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      toast.error("You do not have permission to perform this action.");
    } else if (error.response?.status === 404) {
      toast.error("Resource not found.");
    } else if (error.response?.status === 500) {
      toast.error("Server error. Please try again later.");
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  },
);

export default api;
