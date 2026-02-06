import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Users,
  Building2,
  Briefcase,
  TrendingUp,
  ArrowRight,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  DollarSign,
  FileCheck,
  ArrowUpRight,
  Activity,
  Shield,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { adminService } from "@/services/adminService";
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

const priorityConfig: Record<string, { className: string }> = {
  high: { className: "bg-red-500/10 text-red-500 border-red-500/20" },
  medium: { className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  low: { className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
};

const statusConfig: Record<string, { className: string }> = {
  open: { className: "bg-red-500/10 text-red-500 border-red-500/20" },
  "in-progress": {
    className: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
  resolved: {
    className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
  pending: { className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
};

export default function AdminDashboard() {
  const [quickStats, setQuickStats] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [deploymentStats, setDeploymentStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch all data in parallel
        const [
          applicantCountRes,
          employerCountRes,
          jobOrderCountRes,
          deploymentCountRes,
          recentActivityRes,
          pendingApprovalsRes,
          complaintsRes,
          deploymentStatsRes,
        ] = await Promise.all([
          adminService.getApplicantCount().catch(() => ({ data: { data: 0 } })),
          adminService.getEmployerCount().catch(() => ({ data: { data: 0 } })),
          adminService
            .getJobOrderCount("ACTIVE")
            .catch(() => ({ data: { data: 0 } })),
          adminService
            .getDeploymentCount()
            .catch(() => ({ data: { data: 0 } })),
          adminService
            .getRecentActivity(5)
            .catch(() => ({ data: { data: [] } })),
          adminService
            .getPendingApprovals()
            .catch(() => ({ data: { data: [] } })),
          adminService
            .getComplaints("open")
            .catch(() => ({ data: { data: [] } })),
          adminService
            .getDeploymentStats()
            .catch(() => ({ data: { data: null } })),
        ]);

        // Build quick stats from fetched data
        const stats = [
          {
            label: "Total Applicants",
            value: applicantCountRes.data?.data?.toString() || "0",
            icon: Users,
            trend: "+0 this month",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
          },
          {
            label: "Partner Employers",
            value: employerCountRes.data?.data?.toString() || "0",
            icon: Building2,
            trend: "+0 this month",
            color: "text-purple-500",
            bg: "bg-purple-500/10",
          },
          {
            label: "Active Job Orders",
            value: jobOrderCountRes.data?.data?.toString() || "0",
            icon: Briefcase,
            trend: "+0 this week",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Deployments (YTD)",
            value: deploymentCountRes.data?.data?.toString() || "0",
            icon: Globe,
            trend: "0% success rate",
            color: "text-accent",
            bg: "bg-accent/10",
          },
        ];

        setQuickStats(stats);
        setRecentActivity(recentActivityRes.data?.data || []);
        setPendingApprovals(pendingApprovalsRes.data?.data || []);
        setComplaints(complaintsRes.data?.data || []);
        setDeploymentStats(
          deploymentStatsRes.data?.data || {
            thisMonth: 0,
            lastMonth: 0,
            growth: 0,
            byCountry: [],
          },
        );
      } catch (error: any) {
        console.error("Failed to fetch dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
            Admin Dashboard 🛡️
          </h1>
          <p className="text-muted-foreground">
            Platform overview and management tools
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/reports">
            <Button variant="outline">
              <Activity className="w-4 h-4 mr-2" />
              View Reports
            </Button>
          </Link>
          <Link to="/admin/complaints">
            <Button className="gradient-bg-accent text-accent-foreground font-semibold">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Complaints
              <Badge className="ml-2 bg-white/20">5</Badge>
            </Button>
          </Link>
        </div>
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
              <TrendingUp className="h-4 w-4 text-success" />
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
        {/* Left Column - Activity & Deployment */}
        <motion.div variants={fadeInUp} className="lg:col-span-2 space-y-6">
          {/* Recent Activity */}
          <div className="card-premium p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-semibold">
                Recent Activity
              </h2>
              <Button variant="ghost" size="sm" className="text-accent">
                View all
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex items-center justify-center w-9 h-9 rounded-xl shrink-0",
                      activity.type === "applicant" &&
                        "bg-blue-500/10 text-blue-500",
                      activity.type === "employer" &&
                        "bg-purple-500/10 text-purple-500",
                      activity.type === "deployment" &&
                        "bg-emerald-500/10 text-emerald-500",
                      activity.type === "complaint" &&
                        "bg-red-500/10 text-red-500",
                      activity.type === "verification" &&
                        "bg-amber-500/10 text-amber-500",
                    )}
                  >
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deployment Overview */}
          <div className="card-premium p-5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-display font-semibold">
                Deployment Overview
              </h2>
              <Badge className="bg-success/10 text-success border-success/20">
                +{deploymentStats?.growth?.toFixed(1) || "0"}% vs last month
              </Badge>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-display font-bold">
                    {deploymentStats?.thisMonth || 0}
                  </span>
                  <span className="text-muted-foreground">
                    deployments this month
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  vs {deploymentStats?.lastMonth || 0} last month
                </p>
              </div>

              <div className="space-y-3">
                {(deploymentStats?.byCountry || []).map((country: any) => (
                  <div key={country.country}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{country.country}</span>
                      <span className="text-muted-foreground">
                        {country.count}
                      </span>
                    </div>
                    <Progress value={country.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div variants={fadeInUp} className="space-y-6">
          {/* Pending Approvals */}
          <div className="card-premium p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4 text-accent" />
                Pending Approvals
              </h3>
              <Badge variant="secondary">
                {pendingApprovals.reduce(
                  (acc, item) => acc + (item.count || 0),
                  0,
                )}
              </Badge>
            </div>
            <div className="space-y-3">
              {pendingApprovals.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-sm">{item.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.company || item.applicant}
                    </p>
                  </div>
                  <Badge
                    className={
                      statusConfig[item.status]?.className || "bg-amber-500/10"
                    }
                  >
                    {item.count} pending
                  </Badge>
                </div>
              ))}
            </div>
            <Link to="/admin/verification" className="block mt-4">
              <Button variant="outline" size="sm" className="w-full">
                Review All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Open Complaints */}
          <div className="card-premium p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Open Complaints
              </h3>
              <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                {complaints.filter((c: any) => c.status === "open").length} open
              </Badge>
            </div>
            <div className="space-y-3">
              {complaints.map((complaint: any) => (
                <div key={complaint.id} className="p-3 rounded-xl bg-muted/50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm">#{complaint.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {complaint.subject}
                      </p>
                    </div>
                    <Badge
                      className={
                        priorityConfig[complaint.priority]?.className ||
                        "bg-blue-500/10"
                      }
                    >
                      {complaint.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {complaint.date}
                    </span>
                    <Badge
                      className={
                        statusConfig[complaint.status]?.className ||
                        "bg-amber-500/10"
                      }
                    >
                      {complaint.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/admin/complaints" className="block mt-4">
              <Button variant="outline" size="sm" className="w-full">
                View All Complaints
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="card-premium p-5">
            <h3 className="font-display font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/admin/applicants">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Manage Applicants
                </Button>
              </Link>
              <Link to="/admin/employers">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Manage Employers
                </Button>
              </Link>
              <Link to="/admin/reports">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Generate Reports
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
