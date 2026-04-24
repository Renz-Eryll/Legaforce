import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  Globe2,
  ShieldCheck,
  Users2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import api from "@/services/api";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const stats = [
  { icon: Users2, value: "50,000+", label: "OFWs Deployed" },
  { icon: Globe2, value: "25+", label: "Countries" },
  { icon: ShieldCheck, value: "POEA", label: "Licensed Agency" },
  { icon: Zap, value: "21–30", label: "Days Deployment" },
];

export default function LoginPage() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthStore();

  usePreventNavigation();

  useEffect(() => {
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
      if (response?.data?.requiresVerification) {
        toast.info(response.message || "Please verify your email");
        navigate("/verify-email", { state: { email: response.data.email } });
        return;
      }
      toast.success("Login successful!");
      const userRole = response?.data?.user?.role || "APPLICANT";
      const dashboardRoute = getDashboardRoute(userRole);
      setTimeout(() => {
        navigate(dashboardRoute, { replace: true });
      }, 500);
    } catch (error: any) {
      let errorMessage = "Login failed. Please check your credentials and try again.";
      if (error.response?.data?.message) errorMessage = error.response.data.message;
      else if (error.response?.data?.error) errorMessage = error.response.data.error;
      else if (error.message) errorMessage = error.message;
      setLoginError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background font-sans text-foreground selection:bg-[#E38534]/30 selection:text-[#005085]">
      {/* ── Left panel (Modern Glass Branding) ── */}
      <div className="hidden lg:flex lg:w-[50%] relative flex-col overflow-hidden bg-[#000814]">
        {/* Dynamic Organic Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#005085] via-[#002845] to-[#000814]" />
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-[#E38534]/30 blur-[120px] mix-blend-screen pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[0%] -left-[20%] w-[60%] h-[60%] rounded-full bg-[#00a8e8]/20 blur-[100px] mix-blend-screen pointer-events-none" />

        {/* Ultra-fine mesh overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col justify-between h-full p-12 xl:p-20">
          {/* Modern Logo Area */}
          <Link to="/" className="flex items-center gap-4 group w-fit">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:bg-white/20">
              <span className="text-3xl font-black text-white tracking-tighter">L</span>
            </div>
            <div>
              <p className="text-2xl font-black text-white tracking-widest leading-none">
                LEGA<span className="text-[#E38534]">FORCE</span>
              </p>
              <p className="text-[10px] text-white/60 tracking-[0.3em] uppercase mt-1 font-semibold">
                Manpower Recruitment
              </p>
            </div>
          </Link>

          {/* Hero Typography & Glass Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-10"
          >
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-5 py-2 shadow-xl">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E38534] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E38534]"></span>
                </div>
                <span className="text-white/90 text-xs font-bold tracking-widest uppercase">
                  POEA Licensed Platform
                </span>
              </div>
              <h1 className="text-5xl xl:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 leading-[1.05] tracking-tighter">
                Your Global<br />
                Career Starts<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E38534] to-[#f4a259]">Here.</span>
              </h1>
              <p className="text-white/60 text-lg leading-relaxed max-w-md font-medium">
                Connect with verified international employers. Experience a transparent, lightning-fast, and worker-first recruitment ecosystem.
              </p>
            </div>

        
           
          </motion.div>

          <p className="text-xs text-white/30 font-medium">
            © {new Date().getFullYear()} Legaforce. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── Right panel (Modern Form) ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-20 relative overflow-y-auto">
        
        {/* Top Controls */}
        <div className="absolute top-6 right-6 flex items-center gap-3 z-10 bg-background/50 backdrop-blur-md px-4 py-2 rounded-full border border-border/50">
          <LanguageSwitcher />
          <div className="w-px h-4 bg-border" />
          <ThemeToggle />
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden w-full flex items-center justify-between mb-12">
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
          className="w-full max-w-[420px]"
        >
          {/* Header */}
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-foreground mb-3">
              Welcome back
            </h2>
            <p className="text-muted-foreground text-base font-medium">
              New to Legaforce?{" "}
              <Link to="/register" className="font-bold text-[#E38534] hover:text-[#005085] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#E38534]/30 hover:after:bg-[#005085]">
                Create an account
              </Link>
            </p>
          </div>

          {/* Error Alert */}
          <AnimatePresence>
            {loginError && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginBottom: 0 }} 
                animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              >
                <Alert variant="destructive" className="border-destructive/20 bg-destructive/5 rounded-2xl">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="font-semibold">{loginError}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Modern Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Fluid Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold text-foreground/80 ml-1">
                Email Address
              </Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-[#005085] transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
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

            {/* Fluid Password Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1 mr-1">
                <Label htmlFor="password" className="text-sm font-bold text-foreground/80">
                  Password
                </Label>
                <Link to="/forgot-password" className="text-sm font-bold text-muted-foreground hover:text-[#005085] transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-[#005085] transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive font-semibold ml-1">{errors.password.message}</p>
              )}
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
                  Authenticating...
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In to Dashboard
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

        </motion.div>
      </div>
    </div>
  );
}