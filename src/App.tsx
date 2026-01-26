import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import { PublicLayout, DashboardLayout } from "@/components/layout";

// Pages
import LandingPage from "./pages/LandingPage";
import ForApplicantsPage from "./pages/ForApplicantsPage";
import ForEmployersPage from "./pages/ForEmployersPage";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import { LoginPage, RegisterPage } from "./pages/auth";
import { ApplicantDashboard, EmployerDashboard, AdminDashboard } from "./pages/dashboard";
import NotFound from "./pages/NotFound";

// Placeholder component for pages not yet implemented
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
      <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    </div>
    <h1 className="text-2xl font-display font-bold mb-2">{title}</h1>
    <p className="text-muted-foreground max-w-md">
      This page is under construction. Check back soon for updates!
    </p>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
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

          {/* Dashboard Routes - Applicant */}
          <Route path="/app" element={<DashboardLayout userRole="applicant" />}>
            <Route path="dashboard" element={<ApplicantDashboard />} />
            <Route path="jobs" element={<PlaceholderPage title="Browse Jobs" />} />
            <Route path="applications" element={<PlaceholderPage title="My Applications" />} />
            <Route path="applications/:id" element={<PlaceholderPage title="Application Details" />} />
            <Route path="saved-jobs" element={<PlaceholderPage title="Saved Jobs" />} />
            <Route path="profile" element={<PlaceholderPage title="My Profile" />} />
            <Route path="documents" element={<PlaceholderPage title="Documents" />} />
            <Route path="cv-builder" element={<PlaceholderPage title="CV Builder" />} />
            <Route path="rewards" element={<PlaceholderPage title="Rewards" />} />
            <Route path="support" element={<PlaceholderPage title="Support" />} />
            <Route path="complaints" element={<PlaceholderPage title="File a Complaint" />} />
            <Route path="settings" element={<PlaceholderPage title="Settings" />} />
          </Route>

          {/* Dashboard Routes - Employer */}
          <Route path="/employer" element={<DashboardLayout userRole="employer" />}>
            <Route path="dashboard" element={<EmployerDashboard />} />
            <Route path="job-orders" element={<PlaceholderPage title="Job Orders" />} />
            <Route path="job-orders/:id" element={<PlaceholderPage title="Job Order Details" />} />
            <Route path="candidates" element={<PlaceholderPage title="Candidates" />} />
            <Route path="interviews" element={<PlaceholderPage title="Interviews" />} />
            <Route path="deployments" element={<PlaceholderPage title="Deployments" />} />
            <Route path="invoices" element={<PlaceholderPage title="Invoices" />} />
            <Route path="reports" element={<PlaceholderPage title="Reports" />} />
            <Route path="profile" element={<PlaceholderPage title="Company Profile" />} />
            <Route path="support" element={<PlaceholderPage title="Support" />} />
            <Route path="settings" element={<PlaceholderPage title="Settings" />} />
          </Route>

          {/* Dashboard Routes - Admin */}
          <Route path="/admin" element={<DashboardLayout userRole="admin" />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="applicants" element={<PlaceholderPage title="Manage Applicants" />} />
            <Route path="employers" element={<PlaceholderPage title="Manage Employers" />} />
            <Route path="job-orders" element={<PlaceholderPage title="Job Orders" />} />
            <Route path="applications" element={<PlaceholderPage title="Applications" />} />
            <Route path="deployments" element={<PlaceholderPage title="Deployments" />} />
            <Route path="compliance" element={<PlaceholderPage title="Compliance" />} />
            <Route path="invoices" element={<PlaceholderPage title="Invoices" />} />
            <Route path="reports" element={<PlaceholderPage title="Reports" />} />
            <Route path="complaints" element={<PlaceholderPage title="Complaints" />} />
            <Route path="verification" element={<PlaceholderPage title="User Verification" />} />
            <Route path="settings" element={<PlaceholderPage title="Settings" />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
