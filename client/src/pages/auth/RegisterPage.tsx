import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  Users,
  Building2,
  Phone,
  AlertCircle,
  CheckCircle2,
  ArrowRight
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
    label: "Looking for Work",
    desc: "Find global jobs",
    highlight: "Free AI CV",
  },
  {
    type: "employer" as UserType,
    icon: Building2,
    label: "I'm Hiring",
    desc: "Find skilled talent",
    highlight: "Smart Match",
  },
];

const perks = [
  "AI-generated CV in minutes",
  "Real-time application tracking",
  "POEA-compliant process",
  "Worker protection built-in",
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

      if (response?.data?.requiresVerification) {
        toast.info(response.message || "Please verify your email");
        navigate("/verify-email", { state: { email: data.email } });
      } else if (response?.data?.token) {
        toast.success("Account created successfully!");
        const redirect = userType === "applicant" ? "/app/dashboard" : "/employer/dashboard";
        setTimeout(() => navigate(redirect), 500);
      }
    } catch (error: any) {
      let errorMessage = "Registration failed. Please try again.";
      if (error.response?.data?.message) errorMessage = error.response.data.message;
      else if (error.response?.data?.error) errorMessage = error.response.data.error;
      else if (error.message) errorMessage = error.message;
      setRegisterError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background font-sans text-foreground selection:bg-[#E38534]/30 selection:text-[#005085]">
      {/* ── Left panel (Modern Glass Branding) ── */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col overflow-hidden bg-[#000814]">
        {/* Dynamic Organic Gradients */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#005085] via-[#002845] to-[#000814]" />
        <div className="absolute top-[10%] right-[-20%] w-[80%] h-[80%] rounded-full bg-[#E38534]/20 blur-[130px] mix-blend-screen pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-white/5 blur-[100px] mix-blend-screen pointer-events-none" />

        {/* Ultra-fine mesh overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 flex flex-col justify-between h-full p-12 xl:p-20">
          {/* Modern Logo */}
          <Link to="/" className="flex items-center gap-4 group w-fit">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:bg-white/20">
              <span className="text-3xl font-black text-white tracking-tighter">L</span>
            </div>
            <div>
              <p className="text-2xl font-black text-white tracking-widest leading-none">
                LEGA<span className="text-[#E38534]">FORCE</span>
              </p>
            </div>
          </Link>

          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-5 py-2 shadow-xl">
                <span className="text-white/90 text-xs font-bold tracking-widest uppercase">
                  Join the platform
                </span>
              </div>

              <h1 className="text-5xl xl:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 leading-[1.05] tracking-tighter">
                Open the Door<br />
                to Global<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E38534] to-[#f4a259]">Opportunity.</span>
              </h1>
            </div>

            {/* Premium Perks list */}
            <ul className="space-y-5">
              {perks.map((p, i) => (
                <motion.li
                  key={p}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, ease: "easeOut" }}
                  className="flex items-center gap-5 text-lg font-medium text-white/80"
                >
                  <div className="w-8 h-8 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <CheckCircle2 className="w-4 h-4 text-[#E38534]" />
                  </div>
                  {p}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <p className="text-xs text-white/30 font-medium">
            © {new Date().getFullYear()} Legaforce. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── Right panel (Modern Form) ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-20 bg-background relative overflow-y-auto">

        {/* Top Controls */}
        <div className="absolute top-6 right-6 flex items-center gap-3 z-10 bg-background/50 backdrop-blur-md px-4 py-2 rounded-full border border-border/50">
          <LanguageSwitcher />
          <div className="w-px h-4 bg-border" />
          <ThemeToggle />
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden w-full flex items-center justify-between mb-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#005085] to-[#002845] flex items-center justify-center shadow-xl">
              <span className="font-black text-white text-xl">L</span>
            </div>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[460px] py-8"
        >
          {/* Header */}
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-foreground mb-3">
              Create account
            </h2>
            <p className="text-muted-foreground text-base font-medium">
              Already registered?{" "}
              <Link to="/login" className="font-bold text-[#E38534] hover:text-[#005085] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#E38534]/30 hover:after:bg-[#005085]">
                Sign in
              </Link>
            </p>
          </div>

          {/* Error Alert */}
          <AnimatePresence>
            {registerError && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              >
                <Alert variant="destructive" className="border-destructive/20 bg-destructive/5 rounded-2xl">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="font-semibold">{registerError}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Segmented Control / Card Selector */}
          <div className="grid grid-cols-2 gap-3 mb-10 p-1.5 bg-muted/40 rounded-3xl">
            {userTypes.map((type) => (
              <motion.button
                key={type.type}
                type="button"
                onClick={() => setUserType(type.type)}
                className={cn(
                  "relative flex flex-col items-center text-center p-4 rounded-2xl transition-all duration-300 z-10",
                  userType === type.type
                    ? "bg-background shadow-md shadow-black/5 dark:shadow-white/5 border border-border/50"
                    : "hover:bg-muted/50 border border-transparent"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-colors",
                  userType === type.type ? "bg-[#005085] text-white shadow-lg shadow-[#005085]/20" : "bg-muted text-muted-foreground"
                )}>
                  <type.icon className="w-5 h-5" />
                </div>
                <p className={cn(
                  "text-sm font-bold",
                  userType === type.type ? "text-foreground" : "text-muted-foreground"
                )}>
                  {type.label}
                </p>
              </motion.button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-bold text-foreground/80 ml-1">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  placeholder="Juan"
                  className={cn(
                    "h-14 rounded-2xl border-transparent bg-muted/40 hover:bg-muted/60 focus:bg-background focus:border-[#005085] focus:ring-4 focus:ring-[#005085]/10 text-base transition-all duration-300 shadow-sm",
                    errors.firstName && "border-destructive/50 bg-destructive/5 focus:ring-destructive/10"
                  )}
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive font-semibold ml-1">{errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-bold text-foreground/80 ml-1">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  placeholder="dela Cruz"
                  className={cn(
                    "h-14 rounded-2xl border-transparent bg-muted/40 hover:bg-muted/60 focus:bg-background focus:border-[#005085] focus:ring-4 focus:ring-[#005085]/10 text-base transition-all duration-300 shadow-sm",
                    errors.lastName && "border-destructive/50 bg-destructive/5 focus:ring-destructive/10"
                  )}
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive font-semibold ml-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold text-foreground/80 ml-1">
                Email Address
              </Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-[#005085] transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="juan@email.com"
                  className={cn(
                    "pl-12 h-14 rounded-2xl border-transparent bg-muted/40 hover:bg-muted/60 focus:bg-background focus:border-[#005085] focus:ring-4 focus:ring-[#005085]/10 text-base transition-all duration-300 shadow-sm",
                    errors.email && "border-destructive/50 bg-destructive/5 focus:ring-destructive/10"
                  )}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive font-semibold ml-1">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-bold text-foreground/80 ml-1">
                Phone Number
              </Label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-[#005085] transition-colors" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+63 9XX XXX XXXX"
                  className={cn(
                    "pl-12 h-14 rounded-2xl border-transparent bg-muted/40 hover:bg-muted/60 focus:bg-background focus:border-[#005085] focus:ring-4 focus:ring-[#005085]/10 text-base transition-all duration-300 shadow-sm",
                    errors.phone && "border-destructive/50 bg-destructive/5 focus:ring-destructive/10"
                  )}
                  {...register("phone")}
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-destructive font-semibold ml-1">{errors.phone.message}</p>
              )}
            </div>

            {/* Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-bold text-foreground/80 ml-1">
                  Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-[#005085] transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 chars"
                    className={cn(
                      "pl-12 pr-12 h-14 rounded-2xl border-transparent bg-muted/40 hover:bg-muted/60 focus:bg-background focus:border-[#005085] focus:ring-4 focus:ring-[#005085]/10 text-base transition-all duration-300 shadow-sm",
                      errors.password && "border-destructive/50 bg-destructive/5 focus:ring-destructive/10"
                    )}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive font-semibold ml-1">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-bold text-foreground/80 ml-1">
                  Confirm Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-[#005085] transition-colors" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repeat"
                    className={cn(
                      "pl-12 pr-12 h-14 rounded-2xl border-transparent bg-muted/40 hover:bg-muted/60 focus:bg-background focus:border-[#005085] focus:ring-4 focus:ring-[#005085]/10 text-base transition-all duration-300 shadow-sm",
                      errors.confirmPassword && "border-destructive/50 bg-destructive/5 focus:ring-destructive/10"
                    )}
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive font-semibold ml-1">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Premium Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-2xl font-bold text-base bg-gradient-to-r from-[#005085] to-[#003b63] hover:from-[#00406b] hover:to-[#002845] text-white mt-8 transition-all duration-300 shadow-lg shadow-[#005085]/20 hover:shadow-xl hover:shadow-[#005085]/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 group"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Join as {userType === 'applicant' ? 'Applicant' : 'Employer'}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>

            <p className="text-center text-xs font-medium text-muted-foreground mt-6">
              By registering, you agree to our <Link to="/terms" className="text-[#005085] hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-[#005085] hover:underline">Privacy Policy</Link>.
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}