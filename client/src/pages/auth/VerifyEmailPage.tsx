import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import { getErrorMessage, hasResponse } from "@/lib/errors";
import { useAuthStore } from "@/stores/authStore";
import { getDashboardRoute } from "@/hooks/useNavigation";
import { ArrowLeft, ArrowRight, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthHeading, AuthShell, ButtonSpinner } from "@/components/auth/AuthShell";

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
  
  // Router state is lost on refresh, so fall back to the copy saved by Login/Register
  const email: string | undefined =
    location.state?.email ?? sessionStorage.getItem("pending_verify_email") ?? undefined;

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

        sessionStorage.removeItem("pending_verify_email");
        navigate(getDashboardRoute(response.data.user?.role ?? "APPLICANT"), { replace: true });
      }
    } catch (err) {
      setError(getErrorMessage(err, "Verification failed"));
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
      await authService.resendOtp(email);
      toast.success("New verification code sent!");
      setCountdown(60); // 60 seconds cooldown
    } catch (err) {
      if (!hasResponse(err)) toast.error(getErrorMessage(err, "Failed to resend code"));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthShell
      eyebrow="One last step"
      title={
        <>
          Check your <span className="text-accent">email.</span>
        </>
      }
      description="We've sent a 6-digit verification code to"
      panelExtra={
        <p className="inline-flex max-w-full items-center gap-2 rounded-md border border-sidebar-border bg-sidebar-accent px-3 py-2 font-mono text-sm">
          <Mail className="h-4 w-4 shrink-0 text-accent" />
          <span className="truncate">{email}</span>
        </p>
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm"
      >
        <AuthHeading title="Verify account">
          Enter the code sent to <span className="font-semibold text-foreground lg:hidden">{email}</span>
          <span className="hidden lg:inline">your email address.</span>
        </AuthHeading>

        {error && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-medium">{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <InputOTP
              maxLength={6}
              value={otpValue}
              onChange={(val) => setValue("otp", val)}
              onComplete={onComplete}
              disabled={isLoading}
              containerClassName="justify-between"
            >
              <InputOTPGroup className="w-full justify-between gap-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="h-14 w-full rounded-md border border-input bg-card font-mono text-xl first:rounded-md last:rounded-md"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
            {errors.otp && <p className="text-sm font-medium text-destructive">{errors.otp.message}</p>}
          </div>

          <Button type="submit" size="xl" className="w-full" disabled={isLoading || !otpValue || otpValue.length < 6}>
            {isLoading ? (
              <>
                <ButtonSpinner />
                Verifying…
              </>
            ) : (
              <>
                Verify email
                <ArrowRight />
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 flex flex-col gap-4 border-t pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground">
            Didn't get it?{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isResending || countdown > 0}
              className="font-semibold text-primary underline-offset-4 hover:underline disabled:text-muted-foreground disabled:no-underline dark:text-accent"
            >
              {isResending ? "Sending…" : countdown > 0 ? (
                <span className="font-mono">Resend in {countdown}s</span>
              ) : (
                "Resend code"
              )}
            </button>
          </p>
          <Link to="/login" className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
        </div>
      </motion.div>
    </AuthShell>
  );
}
