import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

/**
 * Hook to prevent browser back/forward navigation based on auth state
 * - When logged in: Cannot go back to login page using browser back button
 * - When logged out: Cannot go forward using browser forward button
 */
export const usePreventNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Push a new state to prevent going back
    window.history.pushState(null, "", window.location.href);

    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();

      // If user is authenticated and tries to go back to login/register
      if (
        isAuthenticated &&
        (location.pathname === "/login" || location.pathname === "/register")
      ) {
        window.history.pushState(null, "", window.location.href);
        return;
      }

      // If user is not authenticated and tries to go to protected routes
      if (
        !isAuthenticated &&
        (location.pathname.startsWith("/app/") ||
          location.pathname.startsWith("/employer/") ||
          location.pathname.startsWith("/admin/"))
      ) {
        window.history.pushState(null, "", window.location.href);
        navigate("/login", { replace: true });
        return;
      }

      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isAuthenticated, location.pathname, navigate]);
};

/**
 * Hook to route to appropriate dashboard based on user role
 */
export const getDashboardRoute = (role: "APPLICANT" | "EMPLOYER" | "ADMIN") => {
  const routes: Record<string, string> = {
    APPLICANT: "/app/dashboard",
    EMPLOYER: "/employer/dashboard",
    ADMIN: "/admin/dashboard",
  };
  return routes[role] || "/app/dashboard";
};
