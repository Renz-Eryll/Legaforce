import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Users,
  TrendingUp,
  DollarSign,
  ArrowRight,
  ChevronRight,
  CheckCircle,
  Clock,
  Calendar,
  ArrowUpRight,
  UserCheck,
  Globe,
  FileText,
  Plus,
  Eye,
  Building2,
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
const quickStats = [
  { label: "Active Job Orders", value: "5", icon: Briefcase, trend: "+2 this month", color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Total Candidates", value: "128", icon: Users, trend: "+23 this week", color: "text-purple-500", bg: "bg-purple-500/10" },
  { label: "Interviews Scheduled", value: "12", icon: UserCheck, trend: "3 today", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Deployed Workers", value: "45", icon: Globe, trend: "+5 this month", color: "text-accent", bg: "bg-accent/10" },
];

const jobOrders = [
  {
    id: "1",
    title: "Registered Nurse (20 positions)",
    department: "Nursing",
    candidates: 45,
    shortlisted: 12,
    interviewed: 8,
    status: "active",
    deadline: "Feb 15, 2026",
  },
  {
    id: "2",
    title: "Civil Engineer (5 positions)",
    department: "Engineering",
    candidates: 28,
    shortlisted: 8,
    interviewed: 4,
    status: "active",
    deadline: "Feb 20, 2026",
  },
  {
    id: "3",
    title: "Hotel Manager (2 positions)",
    department: "Hospitality",
    candidates: 15,
    shortlisted: 5,
    interviewed: 3,
    status: "active",
    deadline: "Mar 1, 2026",
  },
];

const recentCandidates = [
  { name: "Maria Santos", position: "Registered Nurse", status: "interviewed", matchScore: 92 },
  { name: "Jose Reyes", position: "Civil Engineer", status: "shortlisted", matchScore: 88 },
  { name: "Anna Cruz", position: "Hotel Manager", status: "applied", matchScore: 85 },
  { name: "Pedro Garcia", position: "Registered Nurse", status: "selected", matchScore: 95 },
];

const upcomingInterviews = [
  { candidate: "Maria Santos", position: "Registered Nurse", time: "Today, 2:00 PM", type: "Video Call" },
  { candidate: "Jose Reyes", position: "Civil Engineer", time: "Today, 4:00 PM", type: "Video Call" },
  { candidate: "Anna Cruz", position: "Hotel Manager", time: "Tomorrow, 10:00 AM", type: "Video Call" },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  applied: { label: "Applied", className: "status-applied" },
  shortlisted: { label: "Shortlisted", className: "status-shortlisted" },
  interviewed: { label: "Interviewed", className: "status-interviewed" },
  selected: { label: "Selected", className: "status-selected" },
  active: { label: "Active", className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
};

export default function EmployerDashboard() {
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
          <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1">
            Welcome, ABC Company! 🏢
          </h1>
          <p className="text-muted-foreground">
            Manage your job orders and find the best Filipino talent
          </p>
        </div>
        <Link to="/employer/job-orders">
          <Button className="gradient-bg-accent text-accent-foreground font-semibold shadow-lg hover:shadow-xl hover:shadow-accent/20 transition-all">
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
        </Link>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={fadeInUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
            <p className="text-2xl sm:text-3xl font-display font-bold mb-1">{stat.value}</p>
            <p className="text-sm font-medium text-foreground mb-1">{stat.label}</p>
            <p className="text-xs text-muted-foreground">{stat.trend}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Job Orders */}
        <motion.div variants={fadeInUp} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-semibold">Active Job Orders</h2>
            <Link
              to="/employer/job-orders"
              className="text-sm text-accent hover:underline flex items-center gap-1"
            >
              View all
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {jobOrders.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-premium p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{job.title}</h3>
                      <Badge className={statusConfig[job.status].className}>
                        {statusConfig[job.status].label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      {job.department}
                      <span className="text-border">•</span>
                      <Calendar className="h-4 w-4" />
                      Deadline: {job.deadline}
                    </p>
                  </div>
                  <Link to={`/employer/job-orders/${job.id}`}>
                    <Button variant="outline" size="sm">
                      Manage
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                {/* Pipeline Progress */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 rounded-xl bg-muted/50">
                    <p className="text-2xl font-display font-bold text-blue-500">{job.candidates}</p>
                    <p className="text-xs text-muted-foreground">Candidates</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-muted/50">
                    <p className="text-2xl font-display font-bold text-amber-500">{job.shortlisted}</p>
                    <p className="text-xs text-muted-foreground">Shortlisted</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-muted/50">
                    <p className="text-2xl font-display font-bold text-purple-500">{job.interviewed}</p>
                    <p className="text-xs text-muted-foreground">Interviewed</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div variants={fadeInUp} className="space-y-6">
          {/* Upcoming Interviews */}
          <div className="card-premium p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-accent" />
                Upcoming Interviews
              </h3>
              <Badge variant="secondary">{upcomingInterviews.length} today</Badge>
            </div>
            <div className="space-y-3">
              {upcomingInterviews.map((interview, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/50"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 text-accent font-semibold text-sm shrink-0">
                    {interview.candidate.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{interview.candidate}</p>
                    <p className="text-xs text-muted-foreground">{interview.position}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium text-accent">{interview.time.split(",")[0]}</p>
                    <p className="text-xs text-muted-foreground">{interview.time.split(",")[1]}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/employer/interviews" className="block mt-4">
              <Button variant="outline" size="sm" className="w-full">
                View All Interviews
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Recent Candidates */}
          <div className="card-premium p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-accent" />
                Recent Candidates
              </h3>
            </div>
            <div className="space-y-3">
              {recentCandidates.map((candidate, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary dark:text-foreground font-semibold text-xs">
                      {candidate.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{candidate.name}</p>
                      <p className="text-xs text-muted-foreground">{candidate.position}</p>
                    </div>
                  </div>
                  <Badge className={statusConfig[candidate.status].className}>
                    {statusConfig[candidate.status].label}
                  </Badge>
                </div>
              ))}
            </div>
            <Link to="/employer/candidates" className="block mt-4">
              <Button variant="outline" size="sm" className="w-full">
                View All Candidates
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="card-premium p-5">
            <h3 className="font-display font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/employer/job-orders">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Job Order
                </Button>
              </Link>
              <Link to="/employer/candidates">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Eye className="h-4 w-4 mr-2" />
                  Browse Candidates
                </Button>
              </Link>
              <Link to="/employer/reports">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  View Reports
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
