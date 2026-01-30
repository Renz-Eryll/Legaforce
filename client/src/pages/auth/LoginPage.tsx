import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { usePreventNavigation, getDashboardRoute } from "@/hooks/useNavigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Sparkles,
  CheckCircle,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const features = [
  "Real-time application tracking",
  "AI-powered job matching",
  "Secure document management",
  "24/7 support access",
];

export default function LoginPage() {
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
      await login(data.email, data.password);
      toast.success("Login successful!");

      // Get user role and navigate to appropriate dashboard
      const response = await fetch("http://localhost:5000/api/v1/auth/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        const userRole = userData.data?.role || "APPLICANT";
        const dashboardRoute = getDashboardRoute(userRole);

        setTimeout(() => {
          navigate(dashboardRoute, { replace: true });
        }, 500);
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please check your credentials and try again.";
      setLoginError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary dark:bg-card text-primary-foreground dark:text-foreground relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-3">
            <div className="relative flex items-center justify-center p-1 w-10 h-10 rounded-md overflow-hidden shine-effect">
              {/* Navy Background with Gold Accent */}
              <div className="absolute inset-0 bg-white" />
              {/* Logo Text */}
              <span className="relative font-bold text-lg ">
                <img src="legaforce-logo.png" alt="Logo" />
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl tracking-tight">
                Legaforce
              </span>
              <span className="text-[10px] text-accent tracking-wider uppercase hidden sm:block">
                Recruitment Platform
              </span>
            </div>
          </Link>

          <div className="max-w-md">
            <h1 className="text-4xl lg:text-5xl font-display font-bold mb-6">
              Welcome Back to Your{" "}
              <span className="text-accent">Global Career</span>
            </h1>
            <p className="text-primary-foreground/70 dark:text-muted-foreground text-lg leading-relaxed mb-8">
              Access your dashboard to track applications, manage your profile,
              and discover new opportunities worldwide.
            </p>

            {/* Features List */}
            <div className="space-y-4">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 text-primary-foreground/80 dark:text-foreground/80"
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/20">
                    <CheckCircle className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-primary-foreground/60 dark:text-muted-foreground">
            <Shield className="w-5 h-5" />
            <span>Your data is encrypted and secure</span>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col bg-background">
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6">
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary dark:bg-accent text-primary-foreground dark:text-accent-foreground font-bold">
              L
            </div>
            <span className="font-display font-bold text-lg tracking-tight">
              Legaforce
            </span>
          </Link>
          <div className="flex items-center gap-4 ml-auto">
            <ThemeToggle />
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-accent hover:underline font-medium"
              >
                Sign up
              </Link>
            </span>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-display font-bold mb-2">
                Sign In
              </h2>
              <p className="text-muted-foreground">
                Enter your credentials to access your dashboard
              </p>
            </div>

            {/* Error Alert */}
            {loginError && (
              <Alert
                variant="destructive"
                className="mb-6 border-destructive/50 bg-destructive/5"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10 h-12"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-accent hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 h-12"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 gradient-bg-accent text-accent-foreground font-semibold shadow-lg hover:shadow-xl hover:shadow-accent/20 transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" type="button" className="w-full h-12">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
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
                Google
              </Button>
              <Button variant="outline" type="button" className="w-full h-12">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </Button>
            </div>

            {/* Mobile Sign Up Link */}
            <p className="text-center text-sm text-muted-foreground mt-6 sm:hidden">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-accent hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
