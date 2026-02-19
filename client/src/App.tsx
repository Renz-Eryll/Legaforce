// src/App.tsx - UPDATED WITH COMING SOON PAGES FOR NON-INTEGRATED ROUTES
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuthStore } from "./stores/authStore";
import ComingSoonPage from "./components/ComingSoonPage";

// Layouts
import { PublicLayout, DashboardLayout } from "@/components/layout";
import { LoginPage, RegisterPage, VerifyEmailPage } from "./pages/auth";

// Pages — Public
import {
  AboutPage,
  ForApplicantsPage,
  ForEmployersPage,
  LandingPage,
  NotFound,
  ServicesPage,
} from "./pages/public";

// Pages — Applicant (integrated)
import {
  ApplicantDashboard,
  ApplicationsListPage,
  JobDetailsPage,
  JobsListPage,
  ProfilePage,
} from "./pages/applicant";

// Pages — Admin
import {
  AdminDashboard,
  ApplicantsListPage,
  ApplicationsPage,
  ComplaintsListPage,
  CompliancePage,
  DeploymentsListPage,
  EmployersListPage,
  InvoicesPage,
  JobOrdersListPage,
  ReportsPage,
  VerificationPage,
  SettingsPage as AdminSettingsPage,
} from "./pages/admin";

// Pages — Employer (integrated)
import {
  CandidateDetailsPage,
  CandidatesListPage,
  CompanyProfilePage,
  CreateJobOrderPage,
  EmployerDashboard,
  InterviewsListPage,
  JobOrderDetailsPage,
  JobOrdersListPage as EmployerJobOrdersListPage,
} from "./pages/employer";

// Icons for Coming Soon pages
import {
  FileText,
  Bookmark,
  FolderOpen,
  FileEdit,
  Gift,
  HeadphonesIcon,
  AlertTriangle,
  Settings,
  Send,
  Receipt,
  Wallet,
  BarChart3,
  Truck,
} from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/jobs" element={<ForApplicantsPage />} />
              <Route path="/recruitment" element={<ForEmployersPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />

            {/* ─────────────────────────────────────────── */}
            {/* Protected Dashboard Routes - Applicant      */}
            {/* ─────────────────────────────────────────── */}
            <Route
              path="/app"
              element={
                <ProtectedRoute allowedRoles={["APPLICANT"]}>
                  <DashboardLayout userRole="applicant" />
                </ProtectedRoute>
              }
            >
              {/* ✅ Integrated pages */}
              <Route path="dashboard" element={<ApplicantDashboard />} />
              <Route path="jobs" element={<JobsListPage />} />
              <Route path="jobs/:id" element={<JobDetailsPage />} />
              <Route path="applications" element={<ApplicationsListPage />} />
              <Route path="profile" element={<ProfilePage />} />

              {/* 🚧 Coming Soon — Applicant */}
              <Route
                path="applications/:id"
                element={
                  <ComingSoonPage
                    title="Application Details"
                    description="Track your application progress, view interview schedules, and communicate with employers — all in one place."
                    icon={Send}
                    features={[
                      "Real-time application status tracking",
                      "Interview schedule and video call links",
                      "Direct messaging with employers",
                      "Document submission timeline",
                    ]}
                    backTo="/app/applications"
                    backLabel="Back to Applications"
                  />
                }
              />
              <Route
                path="saved-jobs"
                element={
                  <ComingSoonPage
                    title="Saved Jobs"
                    description="Bookmark job opportunities you're interested in and apply when you're ready."
                    icon={Bookmark}
                    features={[
                      "Save jobs for later review",
                      "Get notified when saved jobs are about to close",
                      "Quick-apply to saved positions",
                    ]}
                    backTo="/app/dashboard"
                    backLabel="Back to Dashboard"
                  />
                }
              />
              <Route
                path="documents"
                element={
                  <ComingSoonPage
                    title="Documents"
                    description="Upload and manage your important documents — from passports to certifications."
                    icon={FolderOpen}
                    features={[
                      "Secure document upload & storage",
                      "Automatic document verification",
                      "Organized by document type",
                      "Share documents with employers",
                    ]}
                    backTo="/app/dashboard"
                    backLabel="Back to Dashboard"
                  />
                }
              />
              <Route
                path="cv-builder"
                element={
                  <ComingSoonPage
                    title="AI CV Builder"
                    description="Let our AI craft a professional CV tailored to overseas recruitment standards."
                    icon={FileEdit}
                    features={[
                      "AI-powered CV generation",
                      "Industry-specific templates",
                      "Auto-fill from your profile data",
                      "Export as PDF or share link",
                    ]}
                    backTo="/app/dashboard"
                    backLabel="Back to Dashboard"
                  />
                }
              />
              <Route
                path="rewards"
                element={
                  <ComingSoonPage
                    title="Rewards"
                    description="Earn points for completing your profile, referring friends, and engaging with the platform."
                    icon={Gift}
                    features={[
                      "Earn points for profile completion",
                      "Referral bonus system",
                      "Redeem rewards for premium features",
                      "Leaderboard & achievements",
                    ]}
                    backTo="/app/dashboard"
                    backLabel="Back to Dashboard"
                  />
                }
              />
              <Route
                path="support"
                element={
                  <ComingSoonPage
                    title="Support Center"
                    description="Get help with your account, applications, or deployment questions."
                    icon={HeadphonesIcon}
                    features={[
                      "Live chat support",
                      "FAQ & knowledge base",
                      "Ticket tracking system",
                      "24/7 emergency hotline for deployed workers",
                    ]}
                    backTo="/app/dashboard"
                    backLabel="Back to Dashboard"
                  />
                }
              />
              <Route
                path="complaints"
                element={
                  <ComingSoonPage
                    title="Complaints"
                    description="File and track complaints through our transparent dispute resolution system."
                    icon={AlertTriangle}
                    features={[
                      "Anonymous complaint filing",
                      "Full audit trail & status tracking",
                      "Escalation to DOLE/DMW when needed",
                      "Resolution timeline guarantees",
                    ]}
                    backTo="/app/dashboard"
                    backLabel="Back to Dashboard"
                  />
                }
              />
              <Route
                path="settings"
                element={
                  <ComingSoonPage
                    title="Settings"
                    description="Manage your account preferences, notifications, and security settings."
                    icon={Settings}
                    features={[
                      "Account & password management",
                      "Notification preferences",
                      "Language & theme settings",
                      "Two-factor authentication",
                    ]}
                    backTo="/app/dashboard"
                    backLabel="Back to Dashboard"
                  />
                }
              />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* ─────────────────────────────────────────── */}
            {/* Protected Dashboard Routes - Employer       */}
            {/* ─────────────────────────────────────────── */}
            <Route
              path="/employer"
              element={
                <ProtectedRoute allowedRoles={["EMPLOYER"]}>
                  <DashboardLayout userRole="employer" />
                </ProtectedRoute>
              }
            >
              {/* ✅ Integrated pages */}
              <Route path="dashboard" element={<EmployerDashboard />} />
              <Route path="job-orders" element={<EmployerJobOrdersListPage />} />
              <Route path="job-orders/:id" element={<JobOrderDetailsPage />} />
              <Route path="create-job-order" element={<CreateJobOrderPage />} />
              <Route path="candidates" element={<CandidatesListPage />} />
              <Route path="candidates/:id" element={<CandidateDetailsPage />} />
              <Route path="interviews" element={<InterviewsListPage />} />
              <Route path="profile" element={<CompanyProfilePage />} />

              {/* 🚧 Coming Soon — Employer */}
              <Route
                path="deployments"
                element={
                  <ComingSoonPage
                    title="Deployments"
                    description="Track your deployed workers — from visa processing to arrival and performance."
                    icon={Truck}
                    features={[
                      "Real-time deployment status tracking",
                      "Visa & document processing timeline",
                      "Worker arrival confirmations",
                      "Post-deployment performance reviews",
                    ]}
                    backTo="/employer/dashboard"
                    backLabel="Back to Dashboard"
                  />
                }
              />
              <Route
                path="invoices"
                element={
                  <ComingSoonPage
                    title="Invoices"
                    description="View and manage your recruitment invoices and payment history."
                    icon={Receipt}
                    features={[
                      "Itemized invoice breakdown",
                      "Payment status tracking",
                      "Download invoices as PDF",
                      "Automated billing reminders",
                    ]}
                    backTo="/employer/dashboard"
                    backLabel="Back to Dashboard"
                  />
                }
              />
              <Route
                path="pricing"
                element={
                  <ComingSoonPage
                    title="Pricing Plans"
                    description="Transparent, no-hidden-fee pricing for ethical overseas recruitment."
                    icon={Wallet}
                    features={[
                      "Per-hire and subscription pricing",
                      "Volume discount tiers",
                      "Compare plan features side-by-side",
                      "Custom enterprise quotes",
                    ]}
                    backTo="/employer/dashboard"
                    backLabel="Back to Dashboard"
                  />
                }
              />
              <Route
                path="reports"
                element={
                  <ComingSoonPage
                    title="Reports & Analytics"
                    description="Data-driven insights into your recruitment pipeline and hiring performance."
                    icon={BarChart3}
                    features={[
                      "Hiring funnel analytics",
                      "Time-to-fill metrics",
                      "Cost-per-hire reports",
                      "Export reports as CSV or PDF",
                    ]}
                    backTo="/employer/dashboard"
                    backLabel="Back to Dashboard"
                  />
                }
              />
              <Route
                path="support"
                element={
                  <ComingSoonPage
                    title="Support Center"
                    description="Get dedicated support for your recruitment needs."
                    icon={HeadphonesIcon}
                    features={[
                      "Priority email & chat support",
                      "Dedicated account manager",
                      "Knowledge base & guides",
                      "Onboarding assistance",
                    ]}
                    backTo="/employer/dashboard"
                    backLabel="Back to Dashboard"
                  />
                }
              />
              <Route
                path="settings"
                element={
                  <ComingSoonPage
                    title="Settings"
                    description="Manage your company account, team access, and preferences."
                    icon={Settings}
                    features={[
                      "Team member management & roles",
                      "Notification preferences",
                      "API key management",
                      "Security & audit logs",
                    ]}
                    backTo="/employer/dashboard"
                    backLabel="Back to Dashboard"
                  />
                }
              />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* ─────────────────────────────────────────── */}
            {/* Protected Dashboard Routes - Admin          */}
            {/* ─────────────────────────────────────────── */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <DashboardLayout userRole="admin" />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="applicants" element={<ApplicantsListPage />} />
              <Route path="employers" element={<EmployersListPage />} />
              <Route path="job-orders" element={<JobOrdersListPage />} />
              <Route path="applications" element={<ApplicationsPage />} />
              <Route path="deployments" element={<DeploymentsListPage />} />
              <Route path="compliance" element={<CompliancePage />} />
              <Route path="invoices" element={<InvoicesPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="complaints" element={<ComplaintsListPage />} />
              <Route path="verification" element={<VerificationPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
