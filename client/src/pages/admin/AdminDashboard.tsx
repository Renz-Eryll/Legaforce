import { motion } from "framer-motion";
import { Link } from "react-router-dom";
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
  { label: "Total Applicants", value: "12,458", icon: Users, trend: "+234 this month", color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Partner Employers", value: "523", icon: Building2, trend: "+12 this month", color: "text-purple-500", bg: "bg-purple-500/10" },
  { label: "Active Job Orders", value: "89", icon: Briefcase, trend: "+8 this week", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Deployments (YTD)", value: "1,245", icon: Globe, trend: "98% success rate", color: "text-accent", bg: "bg-accent/10" },
];

const recentActivity = [
  { type: "applicant", message: "New applicant registered: Maria Santos", time: "5 min ago", icon: Users },
  { type: "employer", message: "ABC Company posted new job order", time: "15 min ago", icon: Building2 },
  { type: "deployment", message: "Juan Reyes deployed to Saudi Arabia", time: "1 hour ago", icon: Globe },
  { type: "complaint", message: "New complaint filed: ID #2345", time: "2 hours ago", icon: AlertTriangle },
  { type: "verification", message: "Document verification pending: 5 applicants", time: "3 hours ago", icon: FileCheck },
];

const pendingApprovals = [
  { type: "Employer Registration", company: "XYZ Holdings", status: "pending", count: 3 },
  { type: "Document Verification", applicant: "Multiple", status: "pending", count: 12 },
  { type: "Job Order Approval", company: "ABC Corp", status: "pending", count: 5 },
  { type: "Deployment Clearance", applicant: "Multiple", status: "pending", count: 8 },
];

const complaints = [
  { id: "2345", subject: "Delayed processing", status: "open", priority: "high", date: "Jan 25, 2026" },
  { id: "2344", subject: "Document issue", status: "open", priority: "medium", date: "Jan 24, 2026" },
  { id: "2343", subject: "Payment inquiry", status: "in-progress", priority: "low", date: "Jan 23, 2026" },
];

const deploymentStats = {
  thisMonth: 45,
  lastMonth: 38,
  growth: 18.4,
  byCountry: [
    { country: "Saudi Arabia", count: 156, percentage: 35 },
    { country: "UAE", count: 112, percentage: 25 },
    { country: "Qatar", count: 89, percentage: 20 },
    { country: "Others", count: 88, percentage: 20 },
  ],
};

const priorityConfig: Record<string, { className: string }> = {
  high: { className: "bg-red-500/10 text-red-500 border-red-500/20" },
  medium: { className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  low: { className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
};

const statusConfig: Record<string, { className: string }> = {
  open: { className: "bg-red-500/10 text-red-500 border-red-500/20" },
  "in-progress": { className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  resolved: { className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  pending: { className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
};

export default function AdminDashboard() {
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
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
            <p className="text-2xl sm:text-3xl font-display font-bold mb-1">{stat.value}</p>
            <p className="text-sm font-medium text-foreground mb-1">{stat.label}</p>
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
              <h2 className="text-lg font-display font-semibold">Recent Activity</h2>
              <Button variant="ghost" size="sm" className="text-accent">
                View all
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-xl shrink-0",
                    activity.type === "applicant" && "bg-blue-500/10 text-blue-500",
                    activity.type === "employer" && "bg-purple-500/10 text-purple-500",
                    activity.type === "deployment" && "bg-emerald-500/10 text-emerald-500",
                    activity.type === "complaint" && "bg-red-500/10 text-red-500",
                    activity.type === "verification" && "bg-amber-500/10 text-amber-500",
                  )}>
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
              <h2 className="text-lg font-display font-semibold">Deployment Overview</h2>
              <Badge className="bg-success/10 text-success border-success/20">
                +{deploymentStats.growth}% vs last month
              </Badge>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-display font-bold">{deploymentStats.thisMonth}</span>
                  <span className="text-muted-foreground">deployments this month</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  vs {deploymentStats.lastMonth} last month
                </p>
              </div>
              
              <div className="space-y-3">
                {deploymentStats.byCountry.map((country) => (
                  <div key={country.country}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{country.country}</span>
                      <span className="text-muted-foreground">{country.count}</span>
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
              <Badge variant="secondary">{pendingApprovals.reduce((acc, item) => acc + item.count, 0)}</Badge>
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
                  <Badge className={statusConfig[item.status].className}>
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
              <Badge className="bg-red-500/10 text-red-500 border-red-500/20">{complaints.filter(c => c.status === "open").length} open</Badge>
            </div>
            <div className="space-y-3">
              {complaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="p-3 rounded-xl bg-muted/50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm">#{complaint.id}</p>
                      <p className="text-xs text-muted-foreground">{complaint.subject}</p>
                    </div>
                    <Badge className={priorityConfig[complaint.priority].className}>
                      {complaint.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{complaint.date}</span>
                    <Badge className={statusConfig[complaint.status].className}>
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
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Applicants
                </Button>
              </Link>
              <Link to="/admin/employers">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Building2 className="h-4 w-4 mr-2" />
                  Manage Employers
                </Button>
              </Link>
              <Link to="/admin/reports">
                <Button variant="outline" size="sm" className="w-full justify-start">
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
