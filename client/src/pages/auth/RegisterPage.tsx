import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { Eye, EyeOff, Users, Building2, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthHeading, AuthShell, ButtonSpinner } from "@/components/auth/AuthShell";
import { cn } from "@/lib/utils";
import { getErrorMessage, hasResponse } from "@/lib/errors";

const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain uppercase, lowercase, and a number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;
type UserType = "applicant" | "employer";

const userTypes = [
  { type: "applicant" as UserType, icon: Users, label: "Looking for work", desc: "Find global jobs" },
  { type: "employer" as UserType, icon: Building2, label: "I'm hiring", desc: "Find skilled talent" },
];

const perks = [
  "AI-generated CV in minutes",
  "Real-time application tracking",
  "POEA-compliant process",
  "Worker protection built-in",
];

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-sm font-medium text-destructive">{message}</p> : null;
}

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
        sessionStorage.setItem("pending_verify_email", data.email);
        navigate("/verify-email", { state: { email: data.email } });
      } else if (response?.data?.token) {
        toast.success("Account created successfully!");
        const redirect = userType === "applicant" ? "/app/dashboard" : "/employer/dashboard";
        setTimeout(() => navigate(redirect), 500);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error, "Registration failed. Please try again.");
      setRegisterError(errorMessage);
      if (!hasResponse(error)) toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Join the platform"
      title={
        <>
          Open the door to global <span className="text-accent">opportunity.</span>
        </>
      }
      panelExtra={
        <ul className="divide-y divide-sidebar-border border-y border-sidebar-border">
          {perks.map((perk) => (
            <li key={perk} className="flex items-center gap-3 py-3.5 text-[15px] font-medium">
              <span className="diamond bg-accent" aria-hidden="true" />
              {perk}
            </li>
          ))}
        </ul>
      }
    >
      <div className="w-full max-w-[460px]">
        <AuthHeading title="Create account">
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-primary underline-offset-4 hover:underline dark:text-accent">
            Sign in
          </Link>
        </AuthHeading>

        <AnimatePresence>
          {registerError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="font-medium">{registerError}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-7 grid grid-cols-2 gap-3" role="group" aria-label="Account type">
          {userTypes.map((type) => {
            const selected = userType === type.type;
            return (
              <button
                key={type.type}
                type="button"
                onClick={() => setUserType(type.type)}
                aria-pressed={selected}
                className={cn(
                  "flex items-start gap-3 rounded-lg border p-3.5 text-left transition-colors",
                  selected
                    ? "border-primary bg-primary/[0.06] shadow-[inset_0_0_0_1px_hsl(var(--primary))] dark:border-accent dark:bg-accent/10 dark:shadow-[inset_0_0_0_1px_hsl(var(--accent))]"
                    : "border-border bg-card hover:border-border-strong",
                )}
              >
                <type.icon
                  className={cn("mt-0.5 h-5 w-5 shrink-0", selected ? "text-primary dark:text-accent" : "text-muted-foreground")}
                  strokeWidth={1.8}
                />
                <span>
                  <span className="block text-sm font-semibold">{type.label}</span>
                  <span className="block text-xs text-muted-foreground">{type.desc}</span>
                </span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" placeholder="Juan" autoComplete="given-name" className="h-11" aria-invalid={!!errors.firstName} {...register("firstName")} />
              <FieldError message={errors.firstName?.message} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" placeholder="dela Cruz" autoComplete="family-name" className="h-11" aria-invalid={!!errors.lastName} {...register("lastName")} />
              <FieldError message={errors.lastName?.message} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="juan@email.com" autoComplete="email" className="h-11" aria-invalid={!!errors.email} {...register("email")} />
            <FieldError message={errors.email?.message} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" placeholder="+63 9XX XXX XXXX" autoComplete="tel" className="h-11" aria-invalid={!!errors.phone} {...register("phone")} />
            <FieldError message={errors.phone?.message} />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
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
              <FieldError message={errors.password?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="h-11 pr-11"
                  aria-invalid={!!errors.confirmPassword}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <FieldError message={errors.confirmPassword?.message} />
            </div>
          </div>

          <Button type="submit" size="xl" disabled={isLoading} className="mt-3 w-full">
            {isLoading ? (
              <>
                <ButtonSpinner />
                Creating account…
              </>
            ) : (
              <>
                Join as {userType === "applicant" ? "applicant" : "employer"}
                <ArrowRight />
              </>
            )}
          </Button>

          <p className="pt-2 text-center text-xs text-muted-foreground">
            By registering, you agree to our{" "}
            <Link to="/terms" className="font-medium text-foreground underline underline-offset-2">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="font-medium text-foreground underline underline-offset-2">
              Privacy Policy
            </Link>
            .
          </p>
        </form>
      </div>
    </AuthShell>
  );
}
