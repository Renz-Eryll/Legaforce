import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { ArrowRight, Sparkles, LayoutDashboard, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AuthCTAProps {
  primaryText?: string;
  secondaryText?: string;
  primaryLink?: string;
  secondaryLink?: string;
  primaryVariant?: "default" | "premium" | "hero" | "outline";
  secondaryVariant?: "outline" | "default" | "hero-secondary";
  size?: "sm" | "lg" | "xl";
  showSecondary?: boolean;
}

export function AuthCTA({
  primaryText = "Get Started",
  secondaryText = "Learn More",
  primaryLink = "/register",
  secondaryLink = "/about",
  primaryVariant = "default",
  secondaryVariant = "outline",
  size = "lg",
  showSecondary = true,
}: AuthCTAProps) {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (!user) return "/app/dashboard";
    return user.role === "EMPLOYER" ? "/employer/dashboard" : "/app/dashboard";
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (isAuthenticated && user) {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link to={getDashboardPath()}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={primaryVariant as any}
              size={size}
              className={size === "xl" ? "min-w-[200px]" : ""}
            >
              <LayoutDashboard className="w-5 h-5 mr-2" />
              Go to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </Link>
        {showSecondary && (
          <Button
            onClick={handleLogout}
            variant={secondaryVariant as any}
            size={size}
            className={size === "xl" ? "min-w-[200px]" : ""}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      <Link to={primaryLink}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant={primaryVariant as any}
            size={size}
            className={size === "xl" ? "min-w-[200px]" : ""}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {primaryText}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </Link>
      {showSecondary && (
        <Link to={secondaryLink}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={secondaryVariant as any}
              size={size}
              className={size === "xl" ? "min-w-[200px]" : ""}
            >
              {secondaryText}
            </Button>
          </motion.div>
        </Link>
      )}
    </div>
  );
}
