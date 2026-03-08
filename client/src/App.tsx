import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuthStore } from "./stores/authStore";


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

// Pages — Applicant
import {
  ApplicantDashboard,
  ApplicationDetailsPage,
  ApplicationsListPage,
  ComplaintsPage,
  CVBuilderPage,
  DocumentsPage,
  JobDetailsPage,
  JobsListPage,
  ProfilePage,
  RewardsPage,
  SavedJobsPage,
  SettingsPage as ApplicantSettingsPage,
  StatusReportPage,
  SupportPage,
} from "./pages/applicant";

// Pages — Admin
import {
  AdminDashboard,
  ApplicantDetailPage,
  ApplicantsListPage,
  ApplicationsPage,
  ComplaintsListPage,
  CompliancePage,
  DeploymentsListPage,
  EmployerDetailPage,
  EmployersListPage,
  InvoicesPage,
  JobOrdersListPage,
  ReportsPage,
  VerificationPage,
  SettingsPage as AdminSettingsPage,
} from "./pages/admin";

// Pages — Employer (all integrated)
import {
  CandidateDetailsPage,
  CandidatesListPage,
  CompanyProfilePage,
  CreateJobOrderPage,
  DeploymentsPage as EmployerDeploymentsPage,
  EmployerDashboard,
  InterviewsListPage,
  InvoicesListPage as EmployerInvoicesPage,
  JobOrderDetailsPage,
  JobOrdersListPage as EmployerJobOrdersListPage,
  PricingDashboardPage as EmployerPricingPage,
  ReportsPage as EmployerReportsPage,
  SettingsPage as EmployerSettingsPage,
  SupportPage as EmployerSupportPage,
} from "./pages/employer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30 * 1000, // 30s — avoid re-fetching on page navigations
      gcTime: 5 * 60 * 1000, // 5min — keep cached data in memory
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
