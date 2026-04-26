import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuthStore } from "./stores/authStore";

// Layouts — loaded eagerly (used on every page)
import { PublicLayout, DashboardLayout } from "@/components/layout";

// Auth pages — loaded eagerly (first thing users see)
import { LoginPage, RegisterPage, VerifyEmailPage } from "./pages/auth";

// ── Lazy-loaded pages (only fetched when the route is visited) ──
// Public
const LandingPage = lazy(() => import("./pages/public/LandingPage"));
const AboutPage = lazy(() => import("./pages/public/AboutPage"));
const ForApplicantsPage = lazy(() => import("./pages/public/ForApplicantsPage"));
const ForEmployersPage = lazy(() => import("./pages/public/ForEmployersPage"));
const ServicesPage = lazy(() => import("./pages/public/ServicesPage"));
const NotFound = lazy(() => import("./pages/public/NotFound"));

// Applicant pages
const ApplicantDashboard = lazy(() => import("./pages/applicant/ApplicantDashboard"));
const ApplicationDetailsPage = lazy(() => import("./pages/applicant/ApplicationDetailsPage"));
const ApplicationsListPage = lazy(() => import("./pages/applicant/ApplicationsListPage"));
const ComplaintsPage = lazy(() => import("./pages/applicant/ComplaintsPage"));
const CVBuilderPage = lazy(() => import("./pages/applicant/CVBuilderPage"));
const DocumentsPage = lazy(() => import("./pages/applicant/DocumentsPage"));
const JobDetailsPage = lazy(() => import("./pages/applicant/JobDetailsPage"));
const JobsListPage = lazy(() => import("./pages/applicant/JobsListPage"));
const ProfilePage = lazy(() => import("./pages/applicant/ProfilePage"));
const RewardsPage = lazy(() => import("./pages/applicant/RewardsPage"));
const SavedJobsPage = lazy(() => import("./pages/applicant/SavedJobsPage"));
const ApplicantSettingsPage = lazy(() => import("./pages/applicant/SettingsPage"));
const StatusReportPage = lazy(() => import("./pages/applicant/StatusReportPage"));
const SupportPage = lazy(() => import("./pages/applicant/SupportPage"));

// Admin pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const ApplicantDetailPage = lazy(() => import("./pages/admin/ApplicantDetailPage"));
const ApplicantsListPage = lazy(() => import("./pages/admin/ApplicantsListPage"));
const ApplicationsPage = lazy(() => import("./pages/admin/ApplicationsPage"));
const AdminApplicationDetailPage = lazy(() => import("./pages/admin/ApplicationDetailPage"));
const ComplaintsListPage = lazy(() => import("./pages/admin/ComplaintsListPage"));
const ComplaintDetailPage = lazy(() => import("./pages/admin/ComplaintDetailPage"));
const CompliancePage = lazy(() => import("./pages/admin/CompliancePage"));
const DeploymentsListPage = lazy(() => import("./pages/admin/DeploymentsListPage"));
const DeploymentDetailPage = lazy(() => import("./pages/admin/DeploymentDetailPage"));
const EmployerDetailPage = lazy(() => import("./pages/admin/EmployerDetailPage"));
const EmployersListPage = lazy(() => import("./pages/admin/EmployersListPage"));
const InvoicesPage = lazy(() => import("./pages/admin/InvoicesPage"));
const InvoiceDetailPage = lazy(() => import("./pages/admin/InvoiceDetailPage"));
const JobOrdersListPage = lazy(() => import("./pages/admin/JobOrdersListPage"));
const AdminJobOrderDetailPage = lazy(() => import("./pages/admin/JobOrderDetailPage"));
const ReportsPage = lazy(() => import("./pages/admin/ReportsPage"));
const VerificationPage = lazy(() => import("./pages/admin/VerificationPage"));
const AdminSettingsPage = lazy(() => import("./pages/admin/SettingsPage"));
const SystemHealthPage = lazy(() => import("./pages/admin/SystemHealthPage"));

// Employer pages
const CandidateDetailsPage = lazy(() => import("./pages/employer/CandidateDetailsPage"));
const CandidatesListPage = lazy(() => import("./pages/employer/CandidatesListPage"));
const CompanyProfilePage = lazy(() => import("./pages/employer/CompanyProfilePage"));
const CreateJobOrderPage = lazy(() => import("./pages/employer/CreateJobOrderPage"));
const EmployerDeploymentsPage = lazy(() => import("./pages/employer/DeploymentsPage"));
const EmployerDashboard = lazy(() => import("./pages/employer/EmployerDashboard"));
const InterviewsListPage = lazy(() => import("./pages/employer/InterviewsListPage"));
const EmployerInvoicesPage = lazy(() => import("./pages/employer/InvoicesListPage"));
const JobOrderDetailsPage = lazy(() => import("./pages/employer/JobOrderDetailsPage"));
const EmployerJobOrdersListPage = lazy(() => import("./pages/employer/JobOrdersListPage"));
const EmployerPricingPage = lazy(() => import("./pages/employer/PricingDashboardPage"));
const EmployerReportsPage = lazy(() => import("./pages/employer/ReportsPage"));
const EmployerSettingsPage = lazy(() => import("./pages/employer/SettingsPage"));
const EmployerSupportPage = lazy(() => import("./pages/employer/SupportPage"));

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-3 border-accent/30 border-t-accent rounded-full animate-spin" />
      <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000,      // 60s — avoid redundant refetches
      gcTime: 10 * 60 * 1000,    // 10min — keep cached data longer
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
          <Suspense fallback={<PageLoader />}>
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
                {/*  All Applicant pages — fully integrated */}
                <Route path="dashboard" element={<ApplicantDashboard />} />
                <Route path="jobs" element={<JobsListPage />} />
                <Route path="jobs/:id" element={<JobDetailsPage />} />
                <Route path="applications" element={<ApplicationsListPage />} />
                <Route path="applications/:id" element={<ApplicationDetailsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="saved-jobs" element={<SavedJobsPage />} />
                <Route path="documents" element={<DocumentsPage />} />
                <Route path="cv-builder" element={<CVBuilderPage />} />
                <Route path="rewards" element={<RewardsPage />} />
                <Route path="support" element={<SupportPage />} />
                <Route path="complaints" element={<ComplaintsPage />} />
                <Route path="status-report" element={<StatusReportPage />} />
                <Route path="settings" element={<ApplicantSettingsPage />} />
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
                {/*  All employer pages */}
                <Route path="dashboard" element={<EmployerDashboard />} />
                <Route path="job-orders" element={<EmployerJobOrdersListPage />} />
                <Route path="job-orders/:id" element={<JobOrderDetailsPage />} />
                <Route path="create-job-order" element={<CreateJobOrderPage />} />
                <Route path="candidates" element={<CandidatesListPage />} />
                <Route path="candidates/:id" element={<CandidateDetailsPage />} />
                <Route path="interviews" element={<InterviewsListPage />} />
                <Route path="profile" element={<CompanyProfilePage />} />
                <Route path="deployments" element={<EmployerDeploymentsPage />} />
                <Route path="invoices" element={<EmployerInvoicesPage />} />
                <Route path="pricing" element={<EmployerPricingPage />} />
                <Route path="reports" element={<EmployerReportsPage />} />
                <Route path="support" element={<EmployerSupportPage />} />
                <Route path="settings" element={<EmployerSettingsPage />} />
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
                <Route path="applicants/:id" element={<ApplicantDetailPage />} />
                <Route path="employers" element={<EmployersListPage />} />
                <Route path="employers/:id" element={<EmployerDetailPage />} />
                <Route path="job-orders" element={<JobOrdersListPage />} />
                <Route path="job-orders/:id" element={<AdminJobOrderDetailPage />} />
                <Route path="applications" element={<ApplicationsPage />} />
                <Route path="applications/:id" element={<AdminApplicationDetailPage />} />
                <Route path="deployments" element={<DeploymentsListPage />} />
                <Route path="deployments/:id" element={<DeploymentDetailPage />} />
                <Route path="compliance" element={<CompliancePage />} />
                <Route path="invoices" element={<InvoicesPage />} />
                <Route path="invoices/:id" element={<InvoiceDetailPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="complaints" element={<ComplaintsListPage />} />
                <Route path="complaints/:id" element={<ComplaintDetailPage />} />
                <Route path="verification" element={<VerificationPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
                <Route path="health" element={<SystemHealthPage />} />
                <Route index element={<Navigate to="dashboard" replace />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
