import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { getDashboardRoute } from "@/hooks/useNavigation";
import { Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthHeading, AuthShell, ButtonSpinner } from "@/components/auth/AuthShell";
import { StatStrip } from "@/components/marketing";
import { getErrorMessage } from "@/lib/errors";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuthStore();

  // Already signed in (e.g. visiting /login directly) — send to the right dashboard for the role
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(getDashboardRoute(user.role), { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Message left by the API client after a 401 redirect (e.g. session expired)
  useEffect(() => {
    const authMessage = sessionStorage.getItem("auth_message");
    if (authMessage) {
      sessionStorage.removeItem("auth_message");
      toast.error(authMessage);
    }
  }, []);

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
      if (response?.data?.requiresVerification) {
        toast.info(response.message || "Please verify your email");
        sessionStorage.setItem("pending_verify_email", response.data.email);
        navigate("/verify-email", { state: { email: response.data.email } });
        return;
      }
      toast.success("Login successful!");
      const userRole = response?.data?.user?.role || "APPLICANT";
      navigate(getDashboardRoute(userRole), { replace: true });
    } catch (error) {
      setLoginError(getErrorMessage(error, "Login failed. Please check your credentials and try again."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="POEA licensed platform"
      title={
        <>
          Your global career <span className="text-accent">starts here.</span>
        </>
      }
      description="Connect with verified international employers through a transparent, worker-first recruitment process."
      panelExtra={
        <StatStrip
          tone="dark"
          items={[
            { value: "50K+", label: "Deployed" },
            { value: "30+", label: "Countries" },
            { value: "₱0", label: "Placement fee" },
          ]}
        />
      }
    >
      <div className="w-full max-w-[400px]">
        <AuthHeading title="Sign in">
          New to Legaforce?{" "}
          <Link to="/register" className="font-semibold text-primary underline-offset-4 hover:underline dark:text-accent">
            Create an account
          </Link>
        </AuthHeading>

        <AnimatePresence>
          {loginError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="font-medium">{loginError}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@email.com"
              autoComplete="email"
              className="h-11"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && <p className="text-sm font-medium text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className="h-11 pr-11"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-sm font-medium text-destructive">{errors.password.message}</p>}
          </div>

          <Button type="submit" size="xl" disabled={isLoading} className="mt-2 w-full">
            {isLoading ? (
              <>
                <ButtonSpinner />
                Signing in…
              </>
            ) : (
              <>
                Sign in
                <ArrowRight />
              </>
            )}
          </Button>
        </form>
      </div>
    </AuthShell>
  );
}
