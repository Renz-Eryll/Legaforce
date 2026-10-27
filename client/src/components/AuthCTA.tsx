import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, LayoutDashboard, LogOut } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { getDashboardRoute } from "@/hooks/useNavigation";
import { cn } from "@/lib/utils";

interface AuthCTAProps {
  primaryText?: string;
  secondaryText?: string;
  primaryLink?: string;
  secondaryLink?: string;
  size?: ButtonProps["size"];
  showSecondary?: boolean;
  /** "dark" when placed on a navy band */
  tone?: "light" | "dark";
  className?: string;
}

/**
 * Primary + secondary call to action. Signed-in visitors get
 * "Go to dashboard" / "Log out" instead of the sign-up links.
 */
export function AuthCTA({
  primaryText = "Get Started",
  secondaryText = "Learn More",
  primaryLink = "/register",
  secondaryLink = "/about",
  size = "lg",
  showSecondary = true,
  tone = "light",
  className,
}: AuthCTAProps) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const onDark = tone === "dark";
  const primaryVariant = onDark ? "premium" : "default";
  const secondaryVariant = onDark ? "on-dark" : "outline";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center", className)}>
      {isAuthenticated && user ? (
        <>
          <Button asChild variant={primaryVariant} size={size}>
            <Link to={getDashboardRoute(user.role)}>
              <LayoutDashboard />
              Go to Dashboard
              <ArrowRight />
            </Link>
          </Button>
          {showSecondary && (
            <Button onClick={handleLogout} variant={secondaryVariant} size={size}>
              <LogOut />
              Logout
            </Button>
          )}
        </>
      ) : (
        <>
          <Button asChild variant={primaryVariant} size={size}>
            <Link to={primaryLink}>
              {primaryText}
              <ArrowRight />
            </Link>
          </Button>
          {showSecondary && (
            <Button asChild variant={secondaryVariant} size={size}>
              <Link to={secondaryLink}>{secondaryText}</Link>
            </Button>
          )}
        </>
      )}
    </div>
  );
}
