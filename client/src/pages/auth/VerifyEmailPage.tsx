import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/stores/authStore";
import {
  ArrowRight,
  Mail,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ThemeToggle } from "@/components/ThemeToggle";

const verifySchema = z.object({
  otp: z.string().length(6, "Please enter the 6-digit code"),
});

type VerifyFormData = z.infer<typeof verifySchema>;

export default function VerifyEmailPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { checkAuth } = useAuthStore();
  
  // Get email from router state or local storage (if preserved)
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      toast.error("No email found. Please register or login first.");
      navigate("/login");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const {
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
  });

  const otpValue = watch("otp");

  const onComplete = async (otp: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.verifyEmail({
        email,
        otp,
      });

      if (response.success) {
        toast.success("Email verified successfully!");
        
        // Update auth store
        await checkAuth();

        // Navigate based on role (which we can get from the response or just default to dashboard and let the protected route handle it)
        const user = response.data.user;
        if (user?.role === "EMPLOYER") {
          navigate("/employer/dashboard");
        } else {
          navigate("/app/dashboard");
        }
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Verification failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (data: VerifyFormData) => {
    onComplete(data.otp);
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    
    setIsResending(true);
    setError(null);
    
    try {
      const response = await authService.resendOtp(email);
      console.log("Resend OTP Response:", response);
      toast.success("New verification code sent!");
      setCountdown(60); // 60 seconds cooldown
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to resend code";
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
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

          <div className="max-w-sm space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold leading-tight">
                Check Your Email
              </h1>
              <p className="text-primary-foreground/70 text-lg">
                We've sent a 6-digit verification code to
              </p>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 inline-flex items-center gap-2 mt-2 border border-white/20">
                <Mail className="w-4 h-4" />
                <span className="font-medium">{email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-primary-foreground/50">
          © 2026 Legaforce. POEA Licensed Platform.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-8">
        <div className="lg:hidden w-full flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
              L
            </div>
            <span className="font-bold">Legaforce</span>
          </Link>
          <ThemeToggle />
        </div>

        <div className="hidden lg:flex absolute top-8 right-8">
          <ThemeToggle />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 space-y-2 text-center lg:text-left">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto lg:mx-0">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Verify Account</h1>
            <p className="text-muted-foreground">
              Enter the code sent to your email address.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Alert
                variant="destructive"
                className="mb-6 border-destructive/50 bg-destructive/5"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2 flex flex-col items-center lg:items-start">
              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={(val) => setValue("otp", val)}
                onComplete={onComplete}
                disabled={isLoading}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              {errors.otp && (
                <p className="text-xs text-destructive font-medium mt-2">
                  {errors.otp.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11"
              disabled={isLoading || !otpValue || otpValue.length < 6}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </div>
              ) : (
                <>
                  Verify Email
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <div className="text-sm text-muted-foreground">
              Didn't receive the code?{" "}
              <button
                onClick={handleResendOtp}
                disabled={isResending || countdown > 0}
                className="text-primary hover:underline font-medium disabled:opacity-50 disabled:no-underline"
              >
                {isResending ? (
                  "Sending..."
                ) : countdown > 0 ? (
                  `Resend in ${countdown}s`
                ) : (
                  "Resend Code"
                )}
              </button>
            </div>

            <Link
              to="/login"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowRight className="w-3 h-3 rotate-180" />
              Back to Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
