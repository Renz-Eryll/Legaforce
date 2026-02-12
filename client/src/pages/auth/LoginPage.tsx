import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { usePreventNavigation, getDashboardRoute } from "@/hooks/useNavigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthStore();

  // Prevent back navigation when logged in
  usePreventNavigation();

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (isAuthenticated) {
      navigate("/app/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      const response = await login(data.email, data.password);
      
      console.log("Login Response:", response);

      if (response?.data?.requiresVerification) {
        toast.info(response.message || "Please verify your email");
        navigate("/verify-email", { state: { email: response.data.email } });
        return;
      }

      toast.success("Login successful!");

      // If login was successful and we have user data (token stored), proceed
      if (response?.data?.user) {
        const userRole = response.data.user.role || "APPLICANT";
        const dashboardRoute = getDashboardRoute(userRole);

        setTimeout(() => {
          navigate(dashboardRoute, { replace: true });
        }, 500);
      } else {
        // Fallback: fetch user data if for some reason it wasn't in the login response
        const userResp = await fetch("http://localhost:5000/api/v1/auth/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        });

        if (userResp.ok) {
          const userData = await userResp.json();
          const userRole = userData.data?.role || "APPLICANT";
          const dashboardRoute = getDashboardRoute(userRole);

          setTimeout(() => {
            navigate(dashboardRoute, { replace: true });
          }, 500);
        } else {
          throw new Error("Failed to fetch user data");
        }
      }
    } catch (error: any) {
      setIsLoading(false);

      let errorMessage =
        "Login failed. Please check your credentials and try again.";

      // Try to extract error message from different possible sources
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (
        error.message &&
        error.message !== "Failed to fetch user data"
      ) {
        errorMessage = error.message;
      }

      setLoginError(errorMessage);
      return;
    }
  };

  return (
    <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:flex-col lg:justify-between lg:p-8 bg-gradient-to-br from-primary/95 to-primary text-primary-foreground relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-accent/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-t from-accent/5 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 space-y-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group w-fit">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <span className="text-2xl font-bold text-white">L</span>
            </div>
            <div>
              <h2 className="text-xl font-bold">Legaforce</h2>
              <p className="text-xs text-primary-foreground/60">
                Global Recruitment
              </p>
            </div>
          </Link>

          {/* Content */}
          <div className="max-w-sm space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold leading-tight">{t("auth.login.welcomeBack")}</h1>
              <p className="text-primary-foreground/70 text-lg">
                {t("auth.login.accessOpportunities")}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-sm">{t("auth.login.realTimeTracking")}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-sm">{t("auth.login.aiMatching")}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-sm">{t("auth.login.supportAccess")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="relative z-10 text-xs text-primary-foreground/50">
          © 2026 Legaforce. POEA Licensed Platform.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-8">
        {/* Header for Mobile */}
        <div className="lg:hidden w-full flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
              L
            </div>
            <span className="font-bold">Legaforce</span>
          </Link>
          <ThemeToggle />
        </div>

        {/* Desktop Theme Toggle and Language Switcher */}
        <div className="hidden lg:flex absolute top-8 end-8 gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm"
        >
          {/* Title */}
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-bold">{t("auth.login.title")}</h1>
            <p className="text-muted-foreground">
              {t("auth.login.subtitle")}
            </p>
          </div>

          {/* Error Alert */}
          {loginError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Alert
                variant="destructive"
                className="mb-6 border-destructive/50 bg-destructive/5"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.login.email")}</Label>
              <div className="relative">
                <Mail className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="ps-10 h-10"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t("auth.login.password")}</Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-accent hover:underline"
                >
                  {t("auth.login.forgotPassword")}
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder=""
                  className="ps-10 pe-10 h-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-10 mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  {t("auth.login.signingIn")}
                </div>
              ) : (
                <>
                  {t("common.signIn")}
                  <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-2 text-xs text-muted-foreground">
                {t("common.or")}
              </span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" type="button" className="h-10">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </Button>
            <Button variant="outline" type="button" className="h-10">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </Button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            {t("auth.login.noAccount")}{" "}
            <Link
              to="/register"
              className="text-accent hover:underline font-medium"
            >
              {t("common.signUp")}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
