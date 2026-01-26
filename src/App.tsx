import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import { PublicLayout, DashboardLayout } from "@/components/layout";

// Pages
import LandingPage from "./pages/LandingPage";
import { LoginPage, RegisterPage } from "./pages/auth";
import { ApplicantDashboard, EmployerDashboard, AdminDashboard } from "./pages/dashboard";
import NotFound from "./pages/NotFound";

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
            <Route path="/applicants" element={<LandingPage />} />
            <Route path="/employers" element={<LandingPage />} />
            <Route path="/services" element={<LandingPage />} />
            <Route path="/about" element={<LandingPage />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Dashboard Routes - Applicant */}
          <Route path="/app" element={<DashboardLayout userRole="applicant" />}>
            <Route path="dashboard" element={<ApplicantDashboard />} />
            <Route path="applications" element={<ApplicantDashboard />} />
            <Route path="jobs" element={<ApplicantDashboard />} />
            <Route path="profile" element={<ApplicantDashboard />} />
            <Route path="rewards" element={<ApplicantDashboard />} />
            <Route path="support" element={<ApplicantDashboard />} />
            <Route path="settings" element={<ApplicantDashboard />} />
          </Route>

          {/* Dashboard Routes - Employer */}
          <Route path="/employer" element={<DashboardLayout userRole="employer" />}>
            <Route path="dashboard" element={<EmployerDashboard />} />
          </Route>

          {/* Dashboard Routes - Admin */}
          <Route path="/admin" element={<DashboardLayout userRole="admin" />}>
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
