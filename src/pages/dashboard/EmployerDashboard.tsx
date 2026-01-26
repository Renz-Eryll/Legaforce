import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Users,
  FileText,
  TrendingUp,
  Plus,
  ArrowRight,
  MapPin,
  Calendar,
  Eye,
  ChevronRight,
  Star,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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
const jobOrders = [
  {
    id: "1",
    title: "Registered Nurses (10 positions)",
    location: "Riyadh, Saudi Arabia",
    applicants: 45,
    shortlisted: 12,
    status: "active",
    postedDate: "Jan 10, 2026",
    deadline: "Feb 10, 2026",
  },
  {
    id: "2",
    title: "ICU Nurses (5 positions)",
    location: "Dubai, UAE",
    applicants: 28,
    shortlisted: 8,
    status: "active",
    postedDate: "Jan 15, 2026",
    deadline: "Feb 15, 2026",
  },
  {
    id: "3",
    title: "OR Nurses (3 positions)",
    location: "Doha, Qatar",
    applicants: 15,
    shortlisted: 4,
    status: "interviewing",
    postedDate: "Jan 5, 2026",
    deadline: "Feb 5, 2026",
  },
];

const topCandidates = [
  {
    id: "1",
    name: "Maria Santos",
    role: "Registered Nurse",
    experience: "8 years",
    matchScore: 95,
    status: "Available",
  },
  {
    id: "2",
    name: "Jose Reyes",
    role: "ICU Nurse",
    experience: "6 years",
    matchScore: 92,
    status: "Available",
  },
  {
    id: "3",
    name: "Anna Cruz",
    role: "OR Nurse",
    experience: "5 years",
    matchScore: 88,
    status: "Interviewing",
  },
];

const stats = [
  { label: "Active Job Orders", value: "5", icon: Briefcase, color: "text-blue-500" },
  { label: "Total Applicants", value: "128", icon: Users, color: "text-green-500" },
  { label: "Shortlisted", value: "24", icon: FileText, color: "text-amber-500" },
  { label: "Hired This Month", value: "8", icon: TrendingUp, color: "text-purple-500" },
];

export default function EmployerDashboard() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Employer Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your job orders and candidates
          </p>
        </div>
        <Button variant="premium">
          <Plus className="mr-2 h-4 w-4" />
          Post New Job
        </Button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={fadeInUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-4 sm:p-6 rounded-xl border border-border bg-card"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Job Orders */}
        <motion.div variants={fadeInUp} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Active Job Orders</h2>
            <Link
              to="/employer/jobs"
              className="text-sm text-accent hover:underline flex items-center gap-1"
            >
              View all
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {jobOrders.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 sm:p-5 rounded-xl border border-border bg-card hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{job.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                    </div>
                    <Badge
                      variant={job.status === "active" ? "success" : "warning"}
                    >
                      {job.status === "active" ? "Active" : "Interviewing"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Applicants</p>
                      <p className="font-semibold">{job.applicants}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Shortlisted</p>
                      <p className="font-semibold">{job.shortlisted}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Posted</p>
                      <p className="font-semibold">{job.postedDate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Deadline</p>
                      <p className="font-semibold">{job.deadline}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View Applicants
                    </Button>
                    <Button variant="subtle" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top Candidates */}
        <motion.div variants={fadeInUp} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Top Candidates</h2>
            <Link
              to="/employer/candidates"
              className="text-sm text-accent hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {topCandidates.map((candidate, index) => (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl border border-border bg-card"
              >
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 text-accent font-semibold text-sm">
                    {candidate.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium truncate">{candidate.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {candidate.role}
                        </p>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        {candidate.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {candidate.experience}
                      </div>
                      <div className="flex items-center gap-1 text-accent">
                        <Star className="h-3 w-3" />
                        {candidate.matchScore}% match
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Hiring Progress */}
          <div className="p-4 rounded-xl border border-border bg-muted/30">
            <h3 className="font-medium mb-4">Hiring Pipeline</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Screening</span>
                  <span className="font-medium">45</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Shortlisted</span>
                  <span className="font-medium">24</span>
                </div>
                <Progress value={53} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Interviewing</span>
                  <span className="font-medium">12</span>
                </div>
                <Progress value={27} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Selected</span>
                  <span className="font-medium">8</span>
                </div>
                <Progress value={18} className="h-2" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
