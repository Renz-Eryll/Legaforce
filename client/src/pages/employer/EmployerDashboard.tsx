import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
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
import { employerService } from "@/services/employerService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

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

const statusConfig: Record<string, { label: string; className: string }> = {
  APPLIED: { label: "Applied", className: "status-applied" },
  SHORTLISTED: { label: "Shortlisted", className: "status-shortlisted" },
  INTERVIEWED: { label: "Interviewed", className: "status-interviewed" },
  SELECTED: { label: "Selected", className: "status-selected" },
  ACTIVE: {
    label: "Active",
    className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
  FILLED: {
    label: "Filled",
    className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-500/10 text-red-500 border-red-500/20",
  },
};

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [employer, setEmployer] = useState<any>(null);
  const [jobOrders, setJobOrders] = useState<any[]>([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState<any[]>([]);
  const [recentCandidates, setRecentCandidates] = useState<any[]>([]);
  const [quickStats, setQuickStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch all data in parallel
        const [
          profileRes,
          jobOrdersRes,
          upcomingInterviewsRes,
          recentCandidatesRes,
          jobOrderCountRes,
          candidateCountRes,
          interviewCountRes,
          deployedWorkerCountRes,
        ] = await Promise.all([
          employerService.getProfile().catch(() => ({ data: { data: null } })),
          employerService.getJobOrders().catch(() => ({ data: { data: [] } })),
          employerService
            .getUpcomingInterviews()
            .catch(() => ({ data: { data: [] } })),
          employerService
            .getRecentCandidates()
            .catch(() => ({ data: { data: [] } })),
          employerService
            .getJobOrderCount("ACTIVE")
            .catch(() => ({ data: { data: 0 } })),
          employerService
            .getCandidateCount()
            .catch(() => ({ data: { data: 0 } })),
          employerService
            .getInterviewCount()
            .catch(() => ({ data: { data: 0 } })),
          employerService
            .getDeployedWorkerCount()
            .catch(() => ({ data: { data: 0 } })),
        ]);

        const employerData = profileRes.data?.data;
        setEmployer(employerData);

        const jobsData = jobOrdersRes.data?.data || [];
        setJobOrders(jobsData);

        const interviewsData = upcomingInterviewsRes.data?.data || [];
        setUpcomingInterviews(interviewsData);

        const candidatesData = recentCandidatesRes.data?.data || [];
        setRecentCandidates(candidatesData);

        // Build quick stats
        const stats = [
          {
            label: "Active Job Orders",
            value: jobOrderCountRes.data?.data?.toString() || "0",
            icon: Briefcase,
            trend: "+0 this month",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
          },
          {
            label: "Total Candidates",
            value: candidateCountRes.data?.data?.toString() || "0",
            icon: Users,
            trend: "+0 this week",
            color: "text-purple-500",
            bg: "bg-purple-500/10",
          },
          {
            label: "Interviews Scheduled",
            value: interviewCountRes.data?.data?.toString() || "0",
            icon: UserCheck,
            trend: "0 today",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Deployed Workers",
            value: deployedWorkerCountRes.data?.data?.toString() || "0",
            icon: Globe,
            trend: "+0 this month",
            color: "text-accent",
            bg: "bg-accent/10",
          },
        ];

        setQuickStats(stats);
      } catch (error: any) {
        console.error("Failed to fetch dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const companyName =
    employer?.companyName || user?.employer?.companyName || "Company";

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
            Welcome, {companyName}! 🏢
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
        {/* Job Orders */}
        <motion.div variants={fadeInUp} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-semibold">
              Active Job Orders
            </h2>
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
                      <Badge
                        className={
                          statusConfig[job.status?.toUpperCase() || "ACTIVE"]
                            ?.className || statusConfig["ACTIVE"].className
                        }
                      >
                        {statusConfig[job.status?.toUpperCase() || "ACTIVE"]
                          ?.label || "Active"}
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
                    <p className="text-2xl font-display font-bold text-blue-500">
                      {job.candidates}
                    </p>
                    <p className="text-xs text-muted-foreground">Candidates</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-muted/50">
                    <p className="text-2xl font-display font-bold text-amber-500">
                      {job.shortlisted}
                    </p>
                    <p className="text-xs text-muted-foreground">Shortlisted</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-muted/50">
                    <p className="text-2xl font-display font-bold text-purple-500">
                      {job.interviewed}
                    </p>
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
              <Badge variant="secondary">
                {upcomingInterviews.length} today
              </Badge>
            </div>
            <div className="space-y-3">
              {upcomingInterviews.map((interview, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/50"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 text-accent font-semibold text-sm shrink-0">
                    {interview.candidate
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {interview.candidate}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {interview.position}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium text-accent">
                      {interview.time.split(",")[0]}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {interview.time.split(",")[1]}
                    </p>
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
                      {candidate.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{candidate.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {candidate.position}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={
                      statusConfig[candidate.status?.toUpperCase() || "APPLIED"]
                        ?.className || statusConfig["APPLIED"].className
                    }
                  >
                    {statusConfig[candidate.status?.toUpperCase() || "APPLIED"]
                      ?.label || "Applied"}
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
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Job Order
                </Button>
              </Link>
              <Link to="/employer/candidates">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Browse Candidates
                </Button>
              </Link>
              <Link to="/employer/reports">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
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
