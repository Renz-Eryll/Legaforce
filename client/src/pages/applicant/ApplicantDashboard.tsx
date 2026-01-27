import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Briefcase,
  FileText,
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
  Eye,
  Sparkles,
  Clock,
  ArrowUpRight,
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
    salary: "$2,500/mo",
  },
  {
    id: "2",
    jobTitle: "Staff Nurse - ICU",
    company: "Dubai Health Authority",
    location: "Dubai, UAE",
    status: "shortlisted",
    matchScore: 88,
    appliedDate: "Jan 18, 2026",
    salary: "$2,800/mo",
  },
  {
    id: "3",
    jobTitle: "Senior Nurse",
    company: "Hamad Medical Corporation",
    location: "Doha, Qatar",
    status: "applied",
    matchScore: 85,
    appliedDate: "Jan 22, 2026",
    salary: "$2,600/mo",
  },
];

const notifications = [
  {
    id: "1",
    type: "success",
    title: "Interview Confirmed",
    message: "Your interview with King Faisal Hospital is scheduled for Jan 28",
    time: "2 hours ago",
  },
  {
    id: "2",
    type: "info",
    title: "New Job Match",
    message: "OR Nurse position in Kuwait matches your profile (89% match)",
    time: "5 hours ago",
  },
  {
    id: "3",
    type: "warning",
    title: "Document Expiring",
    message: "Your medical certificate expires in 30 days",
    time: "1 day ago",
  },
];

const quickStats = [
  {
    label: "Active Applications",
    value: "3",
    icon: Briefcase,
    trend: "+1 this week",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Profile Views",
    value: "47",
    icon: Eye,
    trend: "+12 this week",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    label: "Match Score",
    value: "92%",
    icon: TrendingUp,
    trend: "+5% improvement",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Reward Points",
    value: "250",
    icon: Star,
    trend: "Redeem for benefits",
    color: "text-accent",
    bg: "bg-accent/10",
  },
];

const recommendedJobs = [
  {
    title: "OR Nurse",
    company: "Kuwait Hospital",
    location: "Kuwait City",
    match: 89,
  },
  {
    title: "ER Nurse",
    company: "Al Mafraq Hospital",
    location: "Abu Dhabi, UAE",
    match: 87,
  },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  applied: { label: "Applied", className: "status-applied" },
  shortlisted: { label: "Shortlisted", className: "status-shortlisted" },
  interviewed: { label: "Interviewed", className: "status-interviewed" },
  selected: { label: "Selected", className: "status-selected" },
  processing: { label: "Processing", className: "status-processing" },
  deployed: { label: "Deployed", className: "status-deployed" },
  rejected: { label: "Rejected", className: "status-rejected" },
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
      <motion.div
        variants={fadeInUp}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1">
            Welcome back, Juan!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your job applications
          </p>
        </div>
        <Link to="/app/jobs">
          <Button className="gradient-bg-accent text-accent-foreground font-semibold shadow-lg hover:shadow-xl hover:shadow-accent/20 transition-all">
            <Sparkles className="w-4 h-4 mr-2" />
            Browse Jobs
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </motion.div>

      {/* Profile Completion Card */}
      {profileCompletion < 100 && (
        <motion.div
          variants={fadeInUp}
          className="card-premium p-5 sm:p-6 border-accent/20"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10">
                  <AlertCircle className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">Complete Your Profile</h3>
                  <p className="text-sm text-muted-foreground">
                    A complete profile increases your chances of getting hired
                    by 3x
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">
                    Profile completion
                  </span>
                  <span className="font-medium text-accent">
                    {profileCompletion}%
                  </span>
                </div>
                <Progress value={profileCompletion} className="h-2" />
              </div>
            </div>
            <Link to="/app/profile">
              <Button className="gradient-bg-accent text-accent-foreground font-semibold">
                Complete Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Quick Stats */}
      <motion.div
        variants={fadeInUp}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-premium p-5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={cn("p-2.5 rounded-xl", stat.bg)}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-display font-bold mb-1">
              {stat.value}
            </p>
            <p className="text-sm font-medium text-foreground mb-1">
              {stat.label}
            </p>
            <p className="text-xs text-muted-foreground">{stat.trend}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Applications */}
        <motion.div variants={fadeInUp} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-semibold">
              Recent Applications
            </h2>
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
                className="card-premium p-5 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-muted font-display font-bold text-lg shrink-0">
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
                      <Badge
                        className={statusConfig[application.status].className}
                      >
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
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <ArrowUpRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div variants={fadeInUp} className="space-y-6">
          {/* Notifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-display font-semibold">
                Notifications
              </h2>
              <Button variant="ghost" size="sm" className="text-accent text-xs">
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
                  className="card-premium p-4"
                >
                  <div className="flex gap-3">
                    <div
                      className={cn(
                        "flex items-center justify-center w-9 h-9 rounded-xl shrink-0",
                        notification.type === "success" &&
                          "bg-success/10 text-success",
                        notification.type === "info" &&
                          "bg-blue-500/10 text-blue-500",
                        notification.type === "warning" &&
                          "bg-warning/10 text-warning",
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
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recommended Jobs */}
          <div className="card-premium p-5">
            <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              Recommended for You
            </h3>
            <div className="space-y-3">
              {recommendedJobs.map((job, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-sm">{job.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {job.company} • {job.location}
                    </p>
                  </div>
                  <Badge className="bg-accent/10 text-accent border-accent/20">
                    {job.match}% match
                  </Badge>
                </div>
              ))}
            </div>
            <Link to="/app/jobs" className="block mt-4">
              <Button variant="outline" size="sm" className="w-full">
                View More Jobs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="card-premium p-5">
            <h3 className="font-display font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/app/cv-builder">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Update CV
                </Button>
              </Link>
              <Link to="/app/documents">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  Upload Documents
                </Button>
              </Link>
              <Link to="/app/complaints">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
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
