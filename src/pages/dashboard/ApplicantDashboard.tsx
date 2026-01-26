import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Briefcase,
  FileText,
  Clock,
  TrendingUp,
  Star,
  Bell,
  ArrowRight,
  MapPin,
  Building2,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Mock data
const applications = [
  {
    id: "1",
    jobTitle: "Registered Nurse",
    company: "King Faisal Hospital",
    location: "Riyadh, Saudi Arabia",
    status: "interviewed",
    matchScore: 92,
    appliedDate: "Jan 15, 2026",
  },
  {
    id: "2",
    jobTitle: "Staff Nurse - ICU",
    company: "Dubai Health Authority",
    location: "Dubai, UAE",
    status: "shortlisted",
    matchScore: 88,
    appliedDate: "Jan 18, 2026",
  },
  {
    id: "3",
    jobTitle: "Senior Nurse",
    company: "Hamad Medical Corporation",
    location: "Doha, Qatar",
    status: "applied",
    matchScore: 85,
    appliedDate: "Jan 22, 2026",
  },
];

const notifications = [
  {
    id: "1",
    type: "success",
    message: "Your interview with King Faisal Hospital is confirmed",
    time: "2 hours ago",
  },
  {
    id: "2",
    type: "info",
    message: "New job matching your profile: OR Nurse in Kuwait",
    time: "5 hours ago",
  },
  {
    id: "3",
    type: "warning",
    message: "Your medical certificate expires in 30 days",
    time: "1 day ago",
  },
];

const quickStats = [
  { label: "Active Applications", value: "3", icon: Briefcase, trend: "+1" },
  { label: "Profile Views", value: "47", icon: TrendingUp, trend: "+12" },
  { label: "Match Score", value: "92%", icon: Star, trend: "+5%" },
  { label: "Reward Points", value: "250", icon: Star, trend: "+50" },
];

const statusConfig: Record<
  string,
  { label: string; variant: "applied" | "shortlisted" | "interviewed" | "selected" | "processing" | "deployed" | "rejected" }
> = {
  applied: { label: "Applied", variant: "applied" },
  shortlisted: { label: "Shortlisted", variant: "shortlisted" },
  interviewed: { label: "Interviewed", variant: "interviewed" },
  selected: { label: "Selected", variant: "selected" },
  processing: { label: "Processing", variant: "processing" },
  deployed: { label: "Deployed", variant: "deployed" },
  rejected: { label: "Rejected", variant: "rejected" },
};

export default function ApplicantDashboard() {
  const profileCompletion = 75;

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Welcome Section */}
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, Juan! 👋</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your job search
          </p>
        </div>
        <Link to="/app/jobs">
          <Button variant="premium">
            Browse Jobs
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </motion.div>

      {/* Profile Completion Card */}
      {profileCompletion < 100 && (
        <motion.div
          variants={fadeInUp}
          className="p-4 sm:p-6 rounded-2xl border border-accent/20 bg-accent/5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-accent" />
                <h3 className="font-semibold">Complete Your Profile</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                A complete profile increases your chances of getting hired by 3x
              </p>
              <Progress value={profileCompletion} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {profileCompletion}% complete
              </p>
            </div>
            <Link to="/app/profile">
              <Button variant="premium" size="sm">
                Complete Now
              </Button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Quick Stats */}
      <motion.div variants={fadeInUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => (
          <div
            key={stat.label}
            className="p-4 sm:p-6 rounded-xl border border-border bg-card hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-muted">
                <stat.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <Badge variant="success" className="text-xs">
                {stat.trend}
              </Badge>
            </div>
            <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Applications */}
        <motion.div variants={fadeInUp} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Applications</h2>
            <Link
              to="/app/applications"
              className="text-sm text-accent hover:underline flex items-center gap-1"
            >
              View all
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {applications.map((application, index) => (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 sm:p-5 rounded-xl border border-border bg-card hover:shadow-md hover:border-accent/20 transition-all group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-muted text-muted-foreground font-bold text-lg shrink-0">
                    {application.company.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-semibold group-hover:text-accent transition-colors">
                          {application.jobTitle}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building2 className="h-4 w-4" />
                          {application.company}
                        </div>
                      </div>
                      <Badge variant={statusConfig[application.status].variant}>
                        {statusConfig[application.status].label}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {application.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {application.appliedDate}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-accent" />
                        <span className="text-accent font-medium">
                          {application.matchScore}% match
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link to={`/app/applications/${application.id}`}>
                    <Button variant="ghost" size="icon-sm" className="shrink-0">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div variants={fadeInUp} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <Button variant="ghost" size="sm" className="text-accent">
              Mark all read
            </Button>
          </div>

          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl border border-border bg-card"
              >
                <div className="flex gap-3">
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full shrink-0",
                      notification.type === "success" && "bg-success/10 text-success",
                      notification.type === "info" && "bg-blue-500/10 text-blue-500",
                      notification.type === "warning" && "bg-warning/10 text-warning"
                    )}
                  >
                    {notification.type === "success" && (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    {notification.type === "info" && (
                      <Bell className="h-4 w-4" />
                    )}
                    {notification.type === "warning" && (
                      <AlertCircle className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="p-4 rounded-xl border border-border bg-muted/30">
            <h3 className="font-medium mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/app/profile">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Update CV
                </Button>
              </Link>
              <Link to="/app/jobs">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Browse Jobs
                </Button>
              </Link>
              <Link to="/app/support">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  File a Complaint
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
