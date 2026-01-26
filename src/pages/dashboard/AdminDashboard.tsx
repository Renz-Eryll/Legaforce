import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users,
  Building2,
  FileText,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
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
const stats = [
  {
    label: "Total Applicants",
    value: "12,458",
    change: "+12%",
    trend: "up",
    icon: Users,
  },
  {
    label: "Active Employers",
    value: "234",
    change: "+8%",
    trend: "up",
    icon: Building2,
  },
  {
    label: "Deployments This Month",
    value: "89",
    change: "+23%",
    trend: "up",
    icon: FileText,
  },
  {
    label: "Open Complaints",
    value: "12",
    change: "-5%",
    trend: "down",
    icon: AlertTriangle,
  },
];

const recentApplications = [
  {
    id: "1",
    applicant: "Maria Santos",
    job: "Registered Nurse",
    employer: "King Faisal Hospital",
    status: "processing",
    date: "2 hours ago",
  },
  {
    id: "2",
    applicant: "Jose Reyes",
    job: "ICU Nurse",
    employer: "Dubai Health Authority",
    status: "selected",
    date: "4 hours ago",
  },
  {
    id: "3",
    applicant: "Anna Cruz",
    job: "OR Nurse",
    employer: "Hamad Medical Corporation",
    status: "interviewed",
    date: "6 hours ago",
  },
  {
    id: "4",
    applicant: "Pedro Garcia",
    job: "Staff Nurse",
    employer: "MOH Kuwait",
    status: "shortlisted",
    date: "8 hours ago",
  },
];

const pendingTasks = [
  {
    id: "1",
    type: "Document Verification",
    count: 15,
    priority: "high",
  },
  {
    id: "2",
    type: "Interview Scheduling",
    count: 8,
    priority: "medium",
  },
  {
    id: "3",
    type: "Contract Review",
    count: 5,
    priority: "high",
  },
  {
    id: "4",
    type: "Medical Clearance",
    count: 12,
    priority: "medium",
  },
];

const deploymentMetrics = {
  averageDays: 28,
  target: 30,
  thisMonth: 89,
  lastMonth: 72,
};

export default function AdminDashboard() {
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
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of platform activity and metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button variant="premium">View Analytics</Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={fadeInUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-4 sm:p-6 rounded-xl border border-border bg-card"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-muted">
                <stat.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === "up" ? "text-success" : "text-destructive"
                }`}
              >
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                {stat.change}
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <motion.div variants={fadeInUp} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Applications</h2>
            <Link
              to="/admin/applications"
              className="text-sm text-accent hover:underline flex items-center gap-1"
            >
              View all
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                      Applicant
                    </th>
                    <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                      Job / Employer
                    </th>
                    <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                      Status
                    </th>
                    <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                      Date
                    </th>
                    <th className="text-right text-sm font-medium text-muted-foreground px-4 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <p className="font-medium">{app.applicant}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm">{app.job}</p>
                        <p className="text-xs text-muted-foreground">
                          {app.employer}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            app.status === "selected"
                              ? "selected"
                              : app.status === "processing"
                              ? "processing"
                              : app.status === "interviewed"
                              ? "interviewed"
                              : "shortlisted"
                          }
                        >
                          {app.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {app.date}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div variants={fadeInUp} className="space-y-6">
          {/* Pending Tasks */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Pending Tasks</h2>
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-card"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        task.priority === "high"
                          ? "bg-destructive"
                          : "bg-warning"
                      }`}
                    />
                    <span className="text-sm">{task.type}</span>
                  </div>
                  <Badge variant="secondary">{task.count}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Deployment Metrics */}
          <div className="p-4 rounded-xl border border-border bg-card">
            <h3 className="font-semibold mb-4">Deployment Performance</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Avg. Deployment Time</span>
                  <span className="font-semibold text-success">
                    {deploymentMetrics.averageDays} days
                  </span>
                </div>
                <Progress
                  value={
                    ((deploymentMetrics.target - deploymentMetrics.averageDays) /
                      deploymentMetrics.target) *
                      100 +
                    100
                  }
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Target: {deploymentMetrics.target} days
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">
                    {deploymentMetrics.thisMonth}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Month</p>
                  <p className="text-2xl font-bold text-muted-foreground">
                    {deploymentMetrics.lastMonth}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Building2 className="h-4 w-4 mr-2" />
              Verify Employers
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Review Complaints
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <DollarSign className="h-4 w-4 mr-2" />
              Generate Invoices
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
