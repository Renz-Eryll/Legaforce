// src/App.tsx - UPDATED VERSION WITH PROTECTED ROUTES
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import { PublicLayout, DashboardLayout } from "@/components/layout";

// Pages
import {
  AboutPage,
  ForApplicantsPage,
  ForEmployersPage,
  LandingPage,
  NotFound,
  ServicesPage,
} from "./pages/public";

import { LoginPage, RegisterPage } from "./pages/auth";
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
  SettingsPage,
  SupportPage,
} from "./pages/applicant";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuthStore } from "./stores/authStore";
import { AdminDashboard } from "./pages/admin";
import { EmployerDashboard } from "./pages/employer";

// Placeholder component for pages not yet implemented
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
      <svg
        className="w-8 h-8 text-accent"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    </div>
    <h1 className="text-2xl font-display font-bold mb-2">{title}</h1>
    <p className="text-muted-foreground max-w-md">
      This page is under construction. Check back soon for updates!
    </p>
  </div>
);

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
              <Route path="/applicants" element={<ForApplicantsPage />} />
              <Route path="/employers" element={<ForEmployersPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Dashboard Routes - Applicant */}
            <Route
              path="/app"
              element={
                <ProtectedRoute allowedRoles={["APPLICANT"]}>
                  <DashboardLayout userRole="applicant" />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<ApplicantDashboard />} />
              <Route
                path="jobs"
                element={<JobsListPage title="Browse Jobs" />}
              />
              <Route
                path="jobs/:id"
                element={<JobDetailsPage title="Job Details" />}
              />

              <Route
                path="applications"
                element={<ApplicationsListPage title="My Applications" />}
              />
              <Route
                path="applications/:id"
                element={<ApplicationDetailsPage title="Application Details" />}
              />
              <Route
                path="saved-jobs"
                element={<SavedJobsPage title="Saved Jobs" />}
              />
              <Route
                path="profile"
                element={<ProfilePage title="My Profile" />}
              />
              <Route
                path="documents"
                element={<DocumentsPage title="My Documents" />}
              />
              <Route
                path="cv-builder"
                element={<CVBuilderPage title="CV Builder" />}
              />
              <Route path="rewards" element={<RewardsPage title="Rewards" />} />
              <Route path="support" element={<SupportPage title="Support" />} />
              <Route
                path="complaints"
                element={<ComplaintsPage title="Complaints" />}
              />
              <Route
                path="settings"
                element={<SettingsPage title="Settings" />}
              />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* Protected Dashboard Routes - Employer */}
            <Route
              path="/employer"
              element={
                <ProtectedRoute allowedRoles={["EMPLOYER"]}>
                  <DashboardLayout userRole="employer" />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<EmployerDashboard />} />
              <Route
                path="job-orders"
                element={<PlaceholderPage title="Job Orders" />}
              />
              <Route
                path="job-orders/:id"
                element={<PlaceholderPage title="Job Order Details" />}
              />
              <Route
                path="candidates"
                element={<PlaceholderPage title="Candidates" />}
              />
              <Route
                path="interviews"
                element={<PlaceholderPage title="Interviews" />}
              />
              <Route
                path="deployments"
                element={<PlaceholderPage title="Deployments" />}
              />
              <Route
                path="invoices"
                element={<PlaceholderPage title="Invoices" />}
              />
              <Route
                path="reports"
                element={<PlaceholderPage title="Reports" />}
              />
              <Route
                path="profile"
                element={<PlaceholderPage title="Company Profile" />}
              />
              <Route
                path="support"
                element={<PlaceholderPage title="Support" />}
              />
              <Route
                path="settings"
                element={<PlaceholderPage title="Settings" />}
              />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* Protected Dashboard Routes - Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <DashboardLayout userRole="admin" />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route
                path="applicants"
                element={<PlaceholderPage title="Manage Applicants" />}
              />
              <Route
                path="employers"
                element={<PlaceholderPage title="Manage Employers" />}
              />
              <Route
                path="job-orders"
                element={<PlaceholderPage title="Job Orders" />}
              />
              <Route
                path="applications"
                element={<PlaceholderPage title="Applications" />}
              />
              <Route
                path="deployments"
                element={<PlaceholderPage title="Deployments" />}
              />
              <Route
                path="compliance"
                element={<PlaceholderPage title="Compliance" />}
              />
              <Route
                path="invoices"
                element={<PlaceholderPage title="Invoices" />}
              />
              <Route
                path="reports"
                element={<PlaceholderPage title="Reports" />}
              />
              <Route
                path="complaints"
                element={<PlaceholderPage title="Complaints" />}
              />
              <Route
                path="verification"
                element={<PlaceholderPage title="User Verification" />}
              />
              <Route
                path="settings"
                element={<PlaceholderPage title="Settings" />}
              />
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
