import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  MapPin,
  DollarSign,
  Calendar,
  Building2,
  CheckCircle,
  Clock,
  AlertCircle,
  Video,
  FileText,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { applicantService } from "@/services/applicantService";
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

const statusConfig: Record<string, { label: string; className: string; color: string }> = {
  APPLIED: { label: "Applied", className: "status-applied", color: "blue" },
  SHORTLISTED: { label: "Shortlisted", className: "status-shortlisted", color: "amber" },
  INTERVIEWED: { label: "Interviewed", className: "status-interviewed", color: "purple" },
  SELECTED: { label: "Selected", className: "status-selected", color: "emerald" },
  PROCESSING: { label: "Processing", className: "status-processing", color: "orange" },
  DEPLOYED: { label: "Deployed", className: "status-deployed", color: "green" },
  REJECTED: { label: "Rejected", className: "status-rejected", color: "red" },
};

const TIMELINE_STAGES = ["APPLIED", "SHORTLISTED", "INTERVIEWED", "SELECTED", "PROCESSING", "DEPLOYED"];

function buildTimeline(application: any) {
  const currentIndex = TIMELINE_STAGES.indexOf(application.status);
  return TIMELINE_STAGES.map((stage, idx) => {
    let date = "Pending";
    if (stage === "APPLIED" && application.createdAt) {
      date = new Date(application.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } else if (stage === "SHORTLISTED" && application.shortlistedAt) {
      date = new Date(application.shortlistedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } else if (stage === "INTERVIEWED" && application.interviewedAt) {
      date = new Date(application.interviewedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } else if (stage === "SELECTED" && application.selectedAt) {
      date = new Date(application.selectedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } else if (stage === "DEPLOYED" && application.deployedAt) {
      date = new Date(application.deployedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }

    const completed = idx <= currentIndex;
    const isCurrent = idx === currentIndex;

    return {
      stage: statusConfig[stage]?.label || stage,
      date,
      completed,
      isCurrent,
    };
  });
}

function ApplicationDetailsPage() {
  const { id } = useParams();
  const [application, setApplication] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await applicantService.getApplication(id);
        setApplication(data);
      } catch (error: any) {
        console.error("Failed to fetch application:", error);
        toast.error("Failed to load application details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplication();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <p className="text-muted-foreground">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground text-lg">Application not found</p>
        <Button variant="outline" asChild>
          <Link to="/app/applications">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Applications
          </Link>
        </Button>
      </div>
    );
  }

  const position = application.jobOrder?.title || "Untitled Position";
  const employer = application.jobOrder?.employer?.companyName || application.jobOrder?.employer || "Unknown Employer";
  const location = application.jobOrder?.location || "N/A";
  const salary = application.jobOrder?.salary;
  const description = application.jobOrder?.description || "";
  const requirements = application.jobOrder?.requirements || [];
  const status = application.status || "APPLIED";
  const matchScore = application.aiMatchScore || 0;
  const timeline = buildTimeline(application);
  const videoUrl = application.videoInterviewUrl;
  const interviewNotes = application.interviewNotes;
  const appliedDate = application.createdAt
    ? new Date(application.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "N/A";

  // Parse requirements if it's a JSON field
  let reqList: string[] = [];
  if (Array.isArray(requirements)) {
    reqList = requirements;
  } else if (typeof requirements === "object" && requirements !== null) {
    // Could be { skills: [...], experience: [...], etc }
    reqList = Object.entries(requirements).flatMap(([key, val]) => {
      if (Array.isArray(val)) return val.map((v: string) => `${key}: ${v}`);
      if (typeof val === "string") return [`${key}: ${val}`];
      return [];
    });
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/app/applications">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Applications
          </Link>
        </Button>
      </motion.div>

      {/* Main Card */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold mb-2">
              {position}
            </h1>
            <div className="flex flex-col gap-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 shrink-0" />
                <span>{employer}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>{location}</span>
              </div>
            </div>
          </div>
          <Badge className={cn("text-sm px-3 py-1", statusConfig[status]?.className || "status-applied")}>
            {statusConfig[status]?.label || status}
          </Badge>
        </div>

        {/* Status & Match Score */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6 pb-6 border-b border-border">
          <div className="p-4 rounded-xl bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Applied Date</p>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <p className="font-semibold">{appliedDate}</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">AI Match Score</p>
            <div className="flex items-center gap-2">
              <Progress value={matchScore} className="flex-1 h-2" />
              <span className="font-bold text-accent">{matchScore}%</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Salary</p>
            <p className="font-semibold flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {salary ? `$${salary.toLocaleString()}/mo` : "Not specified"}
            </p>
          </div>
        </div>

        {/* Description */}
        {description && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Job Description
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>
        )}

        {/* Video Interview Link */}
        {videoUrl && (
          <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Video className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">Video Interview Scheduled</p>
                <p className="text-xs text-muted-foreground">Click to join the interview session</p>
              </div>
              <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="gradient-bg-accent text-accent-foreground">
                  Join Meeting
                </Button>
              </a>
            </div>
          </div>
        )}

        {/* Interview Notes */}
        {interviewNotes && (
          <div className="p-4 rounded-xl bg-muted/50">
            <h3 className="font-semibold text-sm mb-2">Interview Notes</h3>
            <p className="text-sm text-muted-foreground">{interviewNotes}</p>
          </div>
        )}
      </motion.div>

      {/* Requirements */}
      {reqList.length > 0 && (
        <motion.div variants={fadeInUp} className="card-premium p-6">
          <h2 className="text-lg font-display font-semibold mb-4">Job Requirements</h2>
          <ul className="space-y-3">
            {reqList.map((req, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm">{req}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Application Timeline */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <h2 className="text-lg font-display font-semibold mb-2">
          Application Timeline
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Track your application journey from submission to deployment.
        </p>
        <div className="space-y-0">
          {timeline.map((item, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.15, type: "spring", stiffness: 200 }}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                    item.completed
                      ? "bg-emerald-500/10 text-emerald-500"
                      : item.isCurrent
                        ? "bg-accent/10 text-accent ring-2 ring-accent/30"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {item.completed ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Clock className="w-5 h-5" />
                  )}
                </motion.div>
                {idx < timeline.length - 1 && (
                  <div className={cn(
                    "w-0.5 h-12 mt-2 transition-colors",
                    item.completed ? "bg-emerald-500/30" : "bg-border"
                  )} />
                )}
              </div>
              <div className="pt-2 pb-4">
                <p className={cn(
                  "font-medium",
                  item.isCurrent && "text-accent"
                )}>
                  {item.stage}
                  {item.isCurrent && (
                    <Badge variant="outline" className="ml-2 text-xs bg-accent/10 text-accent border-accent/20">
                      Current
                    </Badge>
                  )}
                </p>
                <p className="text-sm text-muted-foreground">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Rejected notice */}
      {status === "REJECTED" && (
        <motion.div variants={fadeInUp} className="card-premium p-6 border-destructive/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-destructive shrink-0" />
            <div>
              <h3 className="font-semibold text-destructive mb-1">Application Rejected</h3>
              <p className="text-sm text-muted-foreground">
                Unfortunately, your application was not selected for this position.
                Don't be discouraged — browse more jobs and apply again!
              </p>
              <Link to="/app/jobs">
                <Button variant="outline" size="sm" className="mt-3">
                  Browse More Jobs
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default ApplicationDetailsPage;
