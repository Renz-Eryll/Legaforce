import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { adminService } from "@/services/adminService";
import { toast } from "sonner";
import {
  Activity,
  Download,
  Calendar,
  TrendingUp,
  Users,
  Building2,
  Briefcase,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

function ReportsPage() {
  const [reportType, setReportType] = useState("monthly");
  const [dateRange, setDateRange] = useState("jan-2026");

  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState([
    {
      id: 1,
      title: "Recruitment Summary",
      icon: Users,
      color: "bg-blue-500/10 text-blue-500",
      metrics: [
        { label: "Total Applicants", value: "0", change: "—" },
        { label: "Job Orders Active", value: "0", change: "—" },
        { label: "Applications Processed", value: "0", change: "—" },
        { label: "Recent Applications", value: "0", change: "—" },
      ],
    },
    {
      id: 2,
      title: "Deployment Analytics",
      icon: Globe,
      color: "bg-emerald-500/10 text-emerald-500",
      metrics: [
        { label: "Deployed Workers", value: "0", change: "—" },
        { label: "Complaints Received", value: "0", change: "—" },
        { label: "Pending Approvals", value: "0", change: "—" },
        { label: "Success Rate", value: "98%", change: "—" },
      ],
    },
    {
      id: 3,
      title: "Financial Report",
      icon: TrendingUp,
      color: "bg-amber-500/10 text-amber-500",
      metrics: [
        { label: "Total Revenue Paid", value: "₱0", change: "—" },
        { label: "Pending Revenue", value: "₱0", change: "—" },
        { label: "Invoices Overdue", value: "0", change: "—" },
        { label: "Avg Placement Fee", value: "₱45K", change: "—" },
      ],
    },
    {
      id: 4,
      title: "Employer Management",
      icon: Building2,
      color: "bg-purple-500/10 text-purple-500",
      metrics: [
        { label: "Total Employers", value: "0", change: "—" },
        { label: "Verified Partners", value: "0", change: "—" },
        { label: "Pending Verification", value: "0", change: "—" },
        { label: "Total Open Positions", value: "0", change: "—" },
      ],
    },
  ]);

  useEffect(() => {
    const loadLiveData = async () => {
      try {
        setIsLoading(true);
        const [statsRes, invoicesRes] = await Promise.all([
          adminService.getDashboardStats().catch(() => ({ data: {} })),
          adminService.getInvoices().catch(() => ({ data: [] }))
        ]);

        const s = statsRes.data || {};
        const invoices = invoicesRes.data || [];

        const totalRevenue = invoices.filter((i: any) => i.status === "PAID").reduce((sum: number, i: any) => sum + i.amount, 0);
        const pendingRevenue = invoices.filter((i: any) => i.status === "PENDING" || i.status === "SENT").reduce((sum: number, i: any) => sum + i.amount, 0);
        const overdueInvoices = invoices.filter((i: any) => i.status === "OVERDUE").length;
        
        const totalOpenPositions = s.pipeline ? Object.values(s.pipeline).reduce((a: any, b: any) => a + b, 0) : 0;

        setReports([
          {
            id: 1,
            title: "Recruitment Summary",
            icon: Users,
            color: "bg-blue-500/10 text-blue-500",
            metrics: [
              { label: "Total Applicants", value: (s.totalApplicants || 0).toString(), change: "—" },
              { label: "Job Orders Active", value: (s.totalJobOrders || 0).toString(), change: "—" },
              { label: "Applications Processed", value: (s.totalApplications || 0).toString(), change: "—" },
              { label: "Recent Applications", value: (s.recentApplications || 0).toString(), change: "—" },
            ],
          },
          {
            id: 2,
            title: "Deployment Analytics",
            icon: Globe,
            color: "bg-emerald-500/10 text-emerald-500",
            metrics: [
              { label: "Deployed Workers", value: (s.totalDeployments || 0).toString(), change: "—" },
              { label: "Complaints Received", value: (s.totalComplaints || 0).toString(), change: "—" },
              { label: "Pending Approvals", value: (s.pipeline?.PENDING || 0).toString(), change: "—" },
              { label: "Success Rate", value: "98%", change: "—" },
            ],
          },
          {
            id: 3,
            title: "Financial Report",
            icon: TrendingUp,
            color: "bg-amber-500/10 text-amber-500",
            metrics: [
              { label: "Total Revenue Paid", value: `₱${totalRevenue.toLocaleString()}`, change: "—" },
              { label: "Pending Revenue", value: `₱${pendingRevenue.toLocaleString()}`, change: "—" },
              { label: "Invoices Overdue", value: overdueInvoices.toString(), change: "—" },
              { label: "Avg Placement Fee", value: "₱45K", change: "—" },
            ],
          },
          {
            id: 4,
            title: "Employer Management",
            icon: Building2,
            color: "bg-purple-500/10 text-purple-500",
            metrics: [
              { label: "Total Employers", value: (s.totalEmployers || 0).toString(), change: "—" },
              { label: "Verified Partners", value: ((s.totalEmployers || 0) - (s.pendingVerifications || 0)).toString(), change: "—" },
              { label: "Pending Verification", value: (s.pendingVerifications || 0).toString(), change: "—" },
              { label: "Applications in Pipeline", value: String(totalOpenPositions), change: "—" },
            ],
          },
        ]);

      } catch (err) {
        console.error("Failed to fetch reports dat:", err);
        toast.error("Failed to load live report data");
      } finally {
        setIsLoading(false);
      }
    };

    loadLiveData();
  }, [dateRange, reportType]);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={fadeInUp}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-display font-bold mb-1">
            Reports & Analytics 📊
          </h1>
          <p className="text-muted-foreground">
            Comprehensive platform statistics and insights
          </p>
        </div>
        <Button className="gradient-bg-accent text-accent-foreground">
          <Download className="w-4 h-4 mr-2" />
          Export All Reports
        </Button>
      </motion.div>

      {/* Filter Options */}
      <motion.div variants={fadeInUp} className="card-premium p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-full sm:w-48">
              <Activity className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily Report</SelectItem>
              <SelectItem value="weekly">Weekly Report</SelectItem>
              <SelectItem value="monthly">Monthly Report</SelectItem>
              <SelectItem value="yearly">Yearly Report</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full sm:w-48">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jan-2026">January 2026</SelectItem>
              <SelectItem value="dec-2025">December 2025</SelectItem>
              <SelectItem value="nov-2025">November 2025</SelectItem>
              <SelectItem value="ytd-2026">Year to Date 2026</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="ml-auto">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </motion.div>

      {/* Report Cards */}
      <motion.div variants={fadeInUp} className="space-y-6">
        {reports.map((report, idx) => {
          const Icon = report.icon;
          return (
            <div key={report.id} className="card-premium p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                    <div className={`p-2.5 rounded-lg ${report.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {report.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Period:{" "}
                    {dateRange === "jan-2026"
                      ? "January 2026"
                      : "December 2025"}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>

              {/* Metrics Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {report.metrics.map((metric, metricIdx) => (
                  <div
                    key={metricIdx}
                    className="p-4 rounded-lg bg-muted/50 border border-border/50"
                  >
                    <p className="text-sm text-muted-foreground mb-1">
                      {metric.label}
                    </p>
                    <div className="flex items-end justify-between">
                      <p className="text-2xl font-display font-bold">
                        {metric.value}
                      </p>
                      <Badge
                        variant="outline"
                        className={
                          metric.change.includes("+")
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : metric.change.includes("-") &&
                                metric.change !== "—"
                              ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                              : ""
                        }
                      >
                        {metric.change}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Additional Insights */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
            <p className="text-sm">
              <span className="font-semibold">📈 Trending Up:</span> Applicant
              registrations increased by 12% this month, indicating strong
              platform adoption.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
            <p className="text-sm">
              <span className="font-semibold"> Success Rate:</span> Current
              deployment success rate stands at 98%, with an average processing
              time of 18 days.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
            <p className="text-sm">
              <span className="font-semibold">💰 Revenue Growth:</span> Total
              revenue reached ₱2.5M this month, up 22% from last month.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
            <p className="text-sm">
              <span className="font-semibold">🤝 Partner Growth:</span> 12 new
              employers onboarded this month with an average trust score of
              87.5.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ReportsPage;
