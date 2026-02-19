import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Briefcase,
  Users,
  ArrowRight,
  ChevronRight,
  Clock,
  Calendar,
  ArrowUpRight,
  UserCheck,
  Globe,
  FileText,
  Plus,
  Eye,
  Building2,
  Video,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { employerService } from "@/services/employerService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

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

        const [
          profileData,
          jobOrdersData,
          interviewsData,
          candidatesData,
          statsData,
        ] = await Promise.all([
          employerService.getProfile().catch(() => null),
          employerService.getJobOrders().catch(() => []),
          employerService.getUpcomingInterviews().catch(() => []),
          employerService.getRecentCandidates().catch(() => []),
          employerService.getDashboardStats().catch(() => ({
            activeJobOrders: 0,
            candidateCount: 0,
            interviewCount: 0,
            deployedCount: 0,
          })),
        ]);

        setEmployer(profileData);
        setJobOrders(Array.isArray(jobOrdersData) ? jobOrdersData : []);
        setUpcomingInterviews(Array.isArray(interviewsData) ? interviewsData : []);
        setRecentCandidates(Array.isArray(candidatesData) ? candidatesData : []);

        // Build quick stats from actual API response
        const s = statsData as any || {};
        const stats = [
          {
            label: "Active Job Orders",
            value: String(s.activeJobOrders ?? 0),
            icon: Briefcase,
            trend: `${s.activeJobOrders ?? 0} total`,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
          },
          {
            label: "Total Candidates",
            value: String(s.candidateCount ?? 0),
            icon: Users,
            trend: "across all jobs",
            color: "text-purple-500",
            bg: "bg-purple-500/10",
          },
          {
            label: "Interviews Scheduled",
            value: String(s.interviewCount ?? 0),
            icon: UserCheck,
            trend: "shortlisted & interviewed",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Deployed Workers",
            value: String(s.deployedCount ?? 0),
            icon: Globe,
            trend: "deployed total",
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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
        <Link to="/employer/create-job-order">
          <Button className="gradient-bg-accent text-accent-foreground font-semibold shadow-lg hover:shadow-xl hover:shadow-accent/20 transition-all">
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
        </Link>
      </motion.div>

      {/* Recruitment cost optimization callout */}
      <motion.div variants={fadeInUp} className="card-premium p-4 flex flex-wrap items-center gap-4 bg-muted/30">
        <span className="font-medium">Recruitment cost optimization</span>
        <span className="text-sm text-muted-foreground flex items-center gap-2">
          <Video className="w-4 h-4" />
          No physical interviews
        </span>
        <span className="text-sm text-muted-foreground flex items-center gap-2">
          <Users className="w-4 h-4" />
          No repeated sourcing
        </span>
        <Link to="/employer/pricing">
          <Button variant="outline" size="sm">
            <Wallet className="w-4 h-4 mr-2" />
            Transparent pricing
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

          {jobOrders.length === 0 ? (
            <div className="card-premium p-8 text-center">
              <Briefcase className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-muted-foreground mb-4">No job orders yet</p>
              <Link to="/employer/create-job-order">
                <Button className="gradient-bg-accent text-accent-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Post Your First Job
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {jobOrders.slice(0, 5).map((job, index) => (
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
                        {job.location}
                        <span className="text-border">•</span>
                        <Calendar className="h-4 w-4" />
                        {job.salary ? `$${job.salary}/mo` : "Salary TBD"}
                        <span className="text-border">•</span>
                        {job.positions} position{job.positions !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <Link to={`/employer/job-orders/${job.id}`}>
                      <Button variant="outline" size="sm">
                        Manage
                        <ArrowUpRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
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
                {upcomingInterviews.length} total
              </Badge>
            </div>
            <div className="space-y-3">
              {upcomingInterviews.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No upcoming interviews</p>
              ) : (
                upcomingInterviews.map((interview, index) => (
                  <div
                    key={interview.id || index}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/50"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 text-accent font-semibold text-sm shrink-0">
                      {(interview.candidateName || "?")
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {interview.candidateName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {interview.position}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-medium text-accent">
                        {interview.date ? new Date(interview.date).toLocaleDateString() : "TBD"}
                      </p>
                    </div>
                  </div>
                ))
              )}
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
              {recentCandidates.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No candidates yet</p>
              ) : (
                recentCandidates.map((candidate, index) => (
                  <div
                    key={candidate.id || index}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary dark:text-foreground font-semibold text-xs">
                        {(candidate.name || "?")
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{candidate.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {candidate.position}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
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
              <Link to="/employer/create-job-order">
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
