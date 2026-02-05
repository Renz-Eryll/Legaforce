import { useState } from "react";
import { motion } from "framer-motion";
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

  const reports = [
    {
      id: 1,
      title: "Recruitment Summary",
      icon: Users,
      color: "bg-blue-500/10 text-blue-500",
      metrics: [
        { label: "New Applicants", value: "1,234", change: "+12%" },
        { label: "Job Orders Posted", value: "45", change: "+8%" },
        { label: "Applications Received", value: "5,678", change: "+23%" },
        { label: "Hires Completed", value: "345", change: "+15%" },
      ],
    },
    {
      id: 2,
      title: "Deployment Analytics",
      icon: Globe,
      color: "bg-emerald-500/10 text-emerald-500",
      metrics: [
        { label: "Deployed Workers", value: "1,245", change: "+18%" },
        { label: "Countries Served", value: "8", change: "—" },
        { label: "Avg Processing Time", value: "18 days", change: "-3 days" },
        { label: "Success Rate", value: "98%", change: "+0.5%" },
      ],
    },
    {
      id: 3,
      title: "Financial Report",
      icon: TrendingUp,
      color: "bg-amber-500/10 text-amber-500",
      metrics: [
        { label: "Total Revenue", value: "₱2.5M", change: "+22%" },
        { label: "Invoices Paid", value: "₱2.3M", change: "+20%" },
        { label: "Outstanding", value: "₱125K", change: "-5%" },
        { label: "Commission Earned", value: "₱450K", change: "+28%" },
      ],
    },
    {
      id: 4,
      title: "Employer Management",
      icon: Building2,
      color: "bg-purple-500/10 text-purple-500",
      metrics: [
        { label: "Active Employers", value: "456", change: "+12" },
        { label: "Verified Partners", value: "445", change: "+10" },
        { label: "Pending Verification", value: "11", change: "+2" },
        { label: "Avg Partner Score", value: "87.5", change: "+1.2" },
      ],
    },
  ];

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
              <span className="font-semibold">✅ Success Rate:</span> Current
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
