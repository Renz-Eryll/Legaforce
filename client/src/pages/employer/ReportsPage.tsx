import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  DollarSign,
  Briefcase,
  Download,
  Loader2,
  Globe,
  Clock,
  CheckCircle,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { employerService } from "@/services/employerService";
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

function ReportsPage() {
  const [stats, setStats] = useState<any>(null);
  const [jobOrders, setJobOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [statsData, jobsData] = await Promise.all([
          employerService.getDashboardStats(),
          employerService.getJobOrders(),
        ]);
        setStats(statsData);
        setJobOrders(Array.isArray(jobsData) ? jobsData : []);
      } catch (error) {
        console.error("Failed to fetch reports data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExport = () => {
    toast.success("Report export will be available in a future update.");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <p className="text-muted-foreground">Loading reports...</p>
        </div>
      </div>
    );
  }

  const totalApplications = stats?.candidateCount || 0;
  const deployedCount = stats?.deployedCount || 0;
  const interviewCount = stats?.interviewCount || 0;
  const activeJobs = stats?.activeJobOrders || 0;
  const conversionRate = totalApplications > 0
    ? Math.round((deployedCount / totalApplications) * 100)
    : 0;
  const interviewRate = totalApplications > 0
    ? Math.round((interviewCount / totalApplications) * 100)
    : 0;

  // Group jobs by status
  const jobsByStatus = jobOrders.reduce((acc: any, job: any) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {});

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
          <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground">
            Data-driven insights into your recruitment pipeline.
          </p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={fadeInUp} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-premium p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-xl bg-accent/10">
              <Briefcase className="w-5 h-5 text-accent" />
            </div>
            <p className="text-sm text-muted-foreground">Active Jobs</p>
          </div>
          <p className="text-3xl font-display font-bold">{activeJobs}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {jobOrders.length} total job orders
          </p>
        </div>
        <div className="card-premium p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-xl bg-blue-500/10">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-sm text-muted-foreground">Total Applicants</p>
          </div>
          <p className="text-3xl font-display font-bold">{totalApplications}</p>
          <p className="text-xs text-muted-foreground mt-1">
            across all job orders
          </p>
        </div>
        <div className="card-premium p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-xl bg-amber-500/10">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-sm text-muted-foreground">Interviews</p>
          </div>
          <p className="text-3xl font-display font-bold">{interviewCount}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {interviewRate}% of total applicants
          </p>
        </div>
        <div className="card-premium p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-xl bg-emerald-500/10">
              <Globe className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-sm text-muted-foreground">Deployed</p>
          </div>
          <p className="text-3xl font-display font-bold text-emerald-600">{deployedCount}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {conversionRate}% conversion rate
          </p>
        </div>
      </motion.div>

      {/* Hiring Funnel */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent" />
          Hiring Funnel
        </h2>
        <div className="space-y-4">
          {[
            { stage: "Applied", count: totalApplications, color: "bg-blue-500" },
            { stage: "Shortlisted / Interviewed", count: interviewCount, color: "bg-amber-500" },
            { stage: "Deployed", count: deployedCount, color: "bg-emerald-500" },
          ].map((item) => {
            const pct = totalApplications > 0
              ? Math.round((item.count / totalApplications) * 100)
              : 0;
            return (
              <div key={item.stage}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{item.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{item.count}</span>
                    <Badge variant="secondary" className="text-xs">{pct}%</Badge>
                  </div>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={`h-full rounded-full ${item.color}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Job Order Status Breakdown */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-accent" />
          Job Order Status Breakdown
        </h2>
        {jobOrders.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No job orders to analyze yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { status: "ACTIVE", label: "Active", color: "text-emerald-600 bg-emerald-500/10" },
              { status: "FILLED", label: "Filled", color: "text-blue-600 bg-blue-500/10" },
              { status: "CANCELLED", label: "Cancelled", color: "text-red-600 bg-red-500/10" },
              { status: "EXPIRED", label: "Expired", color: "text-gray-500 bg-gray-500/10" },
            ].map((item) => (
              <div key={item.status} className="p-4 rounded-xl bg-muted/30 text-center">
                <p className="text-2xl font-display font-bold">
                  {jobsByStatus[item.status] || 0}
                </p>
                <Badge variant="secondary" className={`text-xs mt-2 ${item.color}`}>
                  {item.label}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Key Metrics */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          Key Metrics
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-muted/30">
            <p className="text-sm text-muted-foreground mb-1">Conversion Rate</p>
            <p className="text-2xl font-display font-bold">{conversionRate}%</p>
            <p className="text-xs text-muted-foreground">applicant → deployed</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/30">
            <p className="text-sm text-muted-foreground mb-1">Interview Rate</p>
            <p className="text-2xl font-display font-bold">{interviewRate}%</p>
            <p className="text-xs text-muted-foreground">applicant → interviewed</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/30">
            <p className="text-sm text-muted-foreground mb-1">Avg. Applicants / Job</p>
            <p className="text-2xl font-display font-bold">
              {activeJobs > 0 ? Math.round(totalApplications / activeJobs) : 0}
            </p>
            <p className="text-xs text-muted-foreground">per active job order</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ReportsPage;
