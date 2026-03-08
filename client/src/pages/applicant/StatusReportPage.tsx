import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  CheckCircle,
  Clock,
  AlertCircle,
  Briefcase,
  Globe,
  Loader2,
  ChevronRight,
  TrendingUp,
  FileCheck,
  Plane,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { applicantService } from "@/services/applicantService";
import { toast } from "sonner";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  APPLIED: { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20" },
  SHORTLISTED: { bg: "bg-indigo-500/10", text: "text-indigo-500", border: "border-indigo-500/20" },
  INTERVIEWED: { bg: "bg-purple-500/10", text: "text-purple-500", border: "border-purple-500/20" },
  SELECTED: { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/20" },
  PROCESSING: { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20" },
  DEPLOYED: { bg: "bg-green-500/10", text: "text-green-600", border: "border-green-500/20" },
  REJECTED: { bg: "bg-red-500/10", text: "text-red-500", border: "border-red-500/20" },
};

const pipelineSteps = [
  { key: "APPLIED", label: "Applied", icon: ClipboardList },
  { key: "SHORTLISTED", label: "Shortlisted", icon: CheckCircle },
  { key: "INTERVIEWED", label: "Interviewed", icon: Briefcase },
  { key: "SELECTED", label: "Selected", icon: TrendingUp },
  { key: "PROCESSING", label: "Processing", icon: FileCheck },
  { key: "DEPLOYED", label: "Deployed", icon: Globe },
];

function StatusReportPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await applicantService.getApplications();
        setApplications(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
        toast.error("Failed to load status report");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate summary statistics
  const statusCounts = applications.reduce((acc: Record<string, number>, app: any) => {
    const status = app.status || "APPLIED";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const totalApps = applications.length;
  const activeApps = applications.filter(
    (a: any) => !["REJECTED", "DEPLOYED"].includes(a.status),
  ).length;
  const deployedApps = statusCounts["DEPLOYED"] || 0;
  const rejectedApps = statusCounts["REJECTED"] || 0;

  // Calculate overall progress (weighted)
  const stepWeights: Record<string, number> = {
    APPLIED: 10,
    SHORTLISTED: 25,
    INTERVIEWED: 45,
    SELECTED: 65,
    PROCESSING: 80,
    DEPLOYED: 100,
    REJECTED: 0,
  };

  const avgProgress =
    totalApps > 0
      ? Math.round(
          applications.reduce(
            (sum: number, app: any) => sum + (stepWeights[app.status] || 0),
            0,
          ) / totalApps,
        )
      : 0;

  // Get progress step index for an application
  const getStepIndex = (status: string) => {
    const idx = pipelineSteps.findIndex((s) => s.key === status);
    return idx >= 0 ? idx : 0;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading status report...</p>
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
      {/* Header */}
      <motion.div variants={fadeInUp}>
        <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1">
          Application Status Report
        </h1>
        <p className="text-muted-foreground">
          Track your application progress and deployment status
        </p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        variants={fadeInUp}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div className="card-premium p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <ClipboardList className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-display font-bold">{totalApps}</p>
          <p className="text-sm text-muted-foreground">Total Applications</p>
        </div>

        <div className="card-premium p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <p className="text-2xl font-display font-bold">{activeApps}</p>
          <p className="text-sm text-muted-foreground">In Progress</p>
        </div>

        <div className="card-premium p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Globe className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <p className="text-2xl font-display font-bold">{deployedApps}</p>
          <p className="text-sm text-muted-foreground">Deployed</p>
        </div>

        <div className="card-premium p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <p className="text-2xl font-display font-bold">{avgProgress}%</p>
          <p className="text-sm text-muted-foreground">Avg. Progress</p>
        </div>
      </motion.div>

      {/* Pipeline Overview */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <h2 className="text-lg font-display font-semibold mb-5">
          Application Pipeline
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {pipelineSteps.map((step) => {
            const count = statusCounts[step.key] || 0;
            const sc = statusColors[step.key];
            return (
              <div
                key={step.key}
                className={`p-3 rounded-xl border text-center transition-all ${
                  count > 0
                    ? `${sc.bg} ${sc.border}`
                    : "bg-muted/30 border-border/50"
                }`}
              >
                <step.icon
                  className={`w-5 h-5 mx-auto mb-2 ${
                    count > 0 ? sc.text : "text-muted-foreground"
                  }`}
                />
                <p
                  className={`text-xl font-bold ${
                    count > 0 ? sc.text : "text-muted-foreground"
                  }`}
                >
                  {count}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
        {rejectedApps > 0 && (
          <div className="mt-3 flex items-center gap-2 text-sm text-red-500">
            <AlertCircle className="w-4 h-4" />
            {rejectedApps} application{rejectedApps > 1 ? "s" : ""} rejected
          </div>
        )}
      </motion.div>

      {/* Individual Application Cards */}
      <motion.div variants={fadeInUp}>
        <h2 className="text-lg font-display font-semibold mb-4">
          Application Details
        </h2>

        {applications.length === 0 ? (
          <div className="card-premium p-12 text-center">
            <ClipboardList className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">
              No Applications Yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Start applying to jobs to track your progress here
            </p>
            <Link to="/app/jobs">
              <Button className="gradient-bg-accent text-accent-foreground">
                <Briefcase className="w-4 h-4 mr-2" />
                Browse Jobs
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app: any) => {
              const sc = statusColors[app.status] || statusColors.APPLIED;
              const currentStep = getStepIndex(app.status);
              const progressPercent =
                app.status === "REJECTED"
                  ? 0
                  : ((currentStep + 1) / pipelineSteps.length) * 100;

              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card-premium p-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1">
                        {app.jobTitle ||
                          app.jobOrder?.title ||
                          "Job Position"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {app.company ||
                          app.jobOrder?.employer?.companyName ||
                          "Company"}{" "}
                        •{" "}
                        {app.location ||
                          app.jobOrder?.location ||
                          "Location"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className={`${sc.bg} ${sc.text} ${sc.border}`}
                      >
                        {app.status?.replace(/_/g, " ")}
                      </Badge>
                      <Link
                        to={`/app/applications/${app.id}`}
                      >
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Progress Steps */}
                  {app.status !== "REJECTED" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>{Math.round(progressPercent)}%</span>
                      </div>
                      <Progress
                        value={progressPercent}
                        className="h-2"
                      />
                      <div className="flex justify-between">
                        {pipelineSteps.map((step, idx) => {
                          const isCompleted = idx <= currentStep;
                          const isCurrent = idx === currentStep;
                          return (
                            <div
                              key={step.key}
                              className={`flex flex-col items-center gap-1 ${
                                isCurrent
                                  ? sc.text
                                  : isCompleted
                                    ? "text-emerald-500"
                                    : "text-muted-foreground/40"
                              }`}
                            >
                              <step.icon className="w-3.5 h-3.5" />
                              <span className="text-[10px] hidden sm:block">
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {app.status === "REJECTED" && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/5 border border-red-500/10 text-sm text-red-500">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      This application was not selected. Don't give up — keep
                      applying!
                    </div>
                  )}

                  {/* Dates */}
                  <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-border/50 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Applied:{" "}
                      {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                    {app.shortlistedAt && (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Shortlisted:{" "}
                        {new Date(app.shortlistedAt).toLocaleDateString()}
                      </span>
                    )}
                    {app.interviewedAt && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        Interviewed:{" "}
                        {new Date(app.interviewedAt).toLocaleDateString()}
                      </span>
                    )}
                    {app.selectedAt && (
                      <span className="flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Selected:{" "}
                        {new Date(app.selectedAt).toLocaleDateString()}
                      </span>
                    )}
                    {app.deployedAt && (
                      <span className="flex items-center gap-1">
                        <Plane className="w-3 h-3" />
                        Deployed:{" "}
                        {new Date(app.deployedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default StatusReportPage;
