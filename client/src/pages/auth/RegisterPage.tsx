import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Users,
  Building2,
  User,
  Phone,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and a number",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

type UserType = "applicant" | "employer";

const userTypes = [
  {
    type: "applicant" as UserType,
    icon: Users,
    label: "Job Seeker",
  },
  {
    type: "employer" as UserType,
    icon: Building2,
    label: "Employer",
  },
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState<UserType>("applicant");
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { register: registerUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setRegisterError(null);
    try {
      const response = await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: userType === "applicant" ? "APPLICANT" : "EMPLOYER",
      });

      console.log("Registration Response:", response);

      if (response?.data?.requiresVerification) {
        toast.info(response.message || "Please verify your email");
        navigate("/verify-email", { state: { email: data.email } });
      } else if (response?.data?.token) {
        toast.success("Account created successfully!");
        const redirect =
          userType === "applicant" ? "/app/dashboard" : "/employer/dashboard";
        setTimeout(() => {
          navigate(redirect);
        }, 500);
      }
    } catch (error: any) {
      let errorMessage = "Registration failed. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setRegisterError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
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
              <h1 className="text-4xl font-bold leading-tight">
                Join Thousands
              </h1>
              <p className="text-primary-foreground/70 text-lg">
                of successful professionals working globally
              </p>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-sm">Get matched instantly</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-sm">Secure employment abroad</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-sm">Build your global career</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="relative z-10 text-xs text-primary-foreground/50">
          © 2026 Legaforce. POEA Licensed Platform.
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-8 overflow-y-auto">
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

        {/* Desktop Theme Toggle */}
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
            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="text-muted-foreground">
              Start your global career journey
            </p>
          </div>

          {/* Error Alert */}
          {registerError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Alert
                variant="destructive"
                className="mb-6 border-destructive/50 bg-destructive/5"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{registerError}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* User Type Selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {userTypes.map((type) => (
              <motion.button
                key={type.type}
                type="button"
                onClick={() => setUserType(type.type)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all",
                  userType === type.type
                    ? "border-accent bg-accent/10"
                    : "border-border hover:border-accent/50",
                )}
              >
                <type.icon
                  className={cn(
                    "w-5 h-5",
                    userType === type.type
                      ? "text-accent"
                      : "text-muted-foreground",
                  )}
                />
                <p
                  className={cn(
                    "text-xs font-medium",
                    userType === type.type
                      ? "text-accent"
                      : "text-muted-foreground",
                  )}
                >
                  {type.label}
                </p>
              </motion.button>
            ))}
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">First</Label>
                <Input
                  id="firstName"
                  placeholder="Juan"
                  className="h-10"
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="text-xs text-destructive font-medium">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last</Label>
                <Input
                  id="lastName"
                  placeholder="Dela Cruz"
                  className="h-10"
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="text-xs text-destructive font-medium">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
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

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+63 912 345 6789"
                  className="ps-10 h-10"
                  {...register("phone")}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-destructive font-medium">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
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

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="ps-10 pe-10 h-10"
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive font-medium">
                  {errors.confirmPassword.message}
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
                  Creating...
                </div>
              ) : (
                <>
                  Create Account
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
                or
              </span>
            </div>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-accent hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>

          {/* Terms */}
          <p className="text-center text-xs text-muted-foreground mt-4">
            By signing up, you agree to our{" "}
            <Link to="/terms" className="text-accent hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-accent hover:underline">
              Privacy
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
