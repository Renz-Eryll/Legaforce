import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Briefcase,
  Building2,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Loader2,
  Mail,
  Globe,
  Star,
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
import { adminService } from "@/services/adminService";
import { toast } from "sonner";
import { DetailPageSkeleton } from "@/components/ui/page-skeletons";

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

const STATUS_FLOW = [
  "APPLIED",
  "SHORTLISTED",
  "INTERVIEWED",
  "SELECTED",
  "PROCESSING",
  "DEPLOYED",
];

const getStatusBadge = (status: string) => {
  const configs: Record<string, string> = {
    APPLIED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    SHORTLISTED: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    INTERVIEWED: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    SELECTED: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    PROCESSING: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    DEPLOYED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    REJECTED: "bg-red-500/10 text-red-500 border-red-500/20",
  };
  return configs[status] || configs.APPLIED;
};

function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const response = await adminService.getApplicationDetail(id);
        setApplication(response.data);
      } catch (error) {
        toast.error("Failed to load application details");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;
    try {
      setIsUpdating(true);
      await adminService.updateApplicationStatus(id, newStatus);
      const response = await adminService.getApplicationDetail(id);
      setApplication(response.data);
      toast.success(`Application status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <DetailPageSkeleton />;

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <XCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Application not found</p>
        <Link to="/admin/applications" className="mt-4">
          <Button variant="outline">Back to Applications</Button>
        </Link>
      </div>
    );
  }

  const currentStepIndex = STATUS_FLOW.indexOf(application.status);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-display font-bold">
            Application Details
          </h1>
          <p className="text-sm text-muted-foreground font-mono">
            {application.id}
          </p>
        </div>
        <Badge variant="outline" className={getStatusBadge(application.status)}>
          {application.status}
        </Badge>
      </motion.div>

      {/* Status Pipeline */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <h2 className="text-lg font-display font-semibold mb-4">
          Application Pipeline
        </h2>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {STATUS_FLOW.map((status, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            return (
              <div key={status} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                    ${isCurrent ? "bg-accent text-accent-foreground shadow-lg scale-105" : ""}
                    ${isCompleted && !isCurrent ? "bg-emerald-500/10 text-emerald-600" : ""}
                    ${!isCompleted ? "bg-muted text-muted-foreground" : ""}
                  `}
                >
                  {isCompleted && !isCurrent && (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  {status.replace("_", " ")}
                </div>
                {index < STATUS_FLOW.length - 1 && (
                  <ArrowRight
                    className={`w-4 h-4 shrink-0 ${isCompleted ? "text-emerald-500" : "text-muted-foreground/30"}`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Status Change Action */}
        {application.status !== "DEPLOYED" &&
          application.status !== "REJECTED" && (
            <div className="mt-6 flex items-center gap-4 pt-4 border-t">
              <span className="text-sm font-medium">Change Status:</span>
              <Select
                onValueChange={handleStatusChange}
                disabled={isUpdating}
              >
                <SelectTrigger className="w-56">
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  {[...STATUS_FLOW, "REJECTED"]
                    .filter((s) => s !== application.status)
                    .map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {isUpdating && (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              )}
            </div>
          )}
      </motion.div>

      {/* Info Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Applicant Info */}
        <motion.div variants={fadeInUp} className="card-premium p-6">
          <h3 className="font-display font-semibold flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-blue-500" />
            Applicant Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Name</span>
              <span className="text-sm font-medium">
                {application.applicant?.firstName}{" "}
                {application.applicant?.lastName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Nationality</span>
              <span className="text-sm font-medium">
                {application.applicant?.nationality || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Phone</span>
              <span className="text-sm font-medium">
                {application.applicant?.phone || "N/A"}
              </span>
            </div>
            {application.aiMatchScore && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  AI Match Score
                </span>
                <Badge className="bg-accent/10 text-accent border-accent/20">
                  <Star className="w-3 h-3 mr-1" />
                  {application.aiMatchScore}%
                </Badge>
              </div>
            )}
          </div>
          <Link
            to={`/admin/applicants/${application.applicant?.id}`}
            className="block mt-4"
          >
            <Button variant="outline" size="sm" className="w-full">
              View Full Profile
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>

        {/* Job Order Info */}
        <motion.div variants={fadeInUp} className="card-premium p-6">
          <h3 className="font-display font-semibold flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-emerald-500" />
            Job Order
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Position</span>
              <span className="text-sm font-medium">
                {application.jobOrder?.title}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Employer</span>
              <span className="text-sm font-medium">
                {application.jobOrder?.employer?.companyName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Location</span>
              <span className="text-sm font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {application.jobOrder?.location || "N/A"}
              </span>
            </div>
            {application.jobOrder?.salary && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Salary</span>
                <span className="text-sm font-medium">
                  ₱{application.jobOrder.salary.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Timeline */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <h3 className="font-display font-semibold flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-accent" />
          Application Timeline
        </h3>
        <div className="space-y-4">
          {[
            {
              label: "Applied",
              date: application.createdAt,
              active: true,
            },
            {
              label: "Shortlisted",
              date: application.shortlistedAt,
              active: !!application.shortlistedAt,
            },
            {
              label: "Interviewed",
              date: application.interviewedAt,
              active: !!application.interviewedAt,
            },
            {
              label: "Selected",
              date: application.selectedAt,
              active: !!application.selectedAt,
            },
            {
              label: "Deployed",
              date: application.deployedAt,
              active: !!application.deployedAt,
            },
          ].map((step, index) => (
            <div key={step.label} className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  step.active
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step.active ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Clock className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{step.label}</p>
                <p className="text-xs text-muted-foreground">
                  {step.date
                    ? new Date(step.date).toLocaleString()
                    : "Pending"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Deployment Info (if exists) */}
      {application.deployment && (
        <motion.div variants={fadeInUp} className="card-premium p-6">
          <h3 className="font-display font-semibold flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-blue-500" />
            Deployment Record
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-3 rounded-xl bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">
                Medical Status
              </p>
              <Badge variant="secondary">
                {application.deployment.medicalStatus}
              </Badge>
            </div>
            <div className="p-3 rounded-xl bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Visa Status</p>
              <Badge variant="secondary">
                {application.deployment.visaStatus}
              </Badge>
            </div>
            <div className="p-3 rounded-xl bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">OEC Status</p>
              <Badge variant="secondary">
                {application.deployment.oecStatus}
              </Badge>
            </div>
          </div>
          <Link
            to={`/admin/deployments/${application.deployment.id}`}
            className="block mt-4"
          >
            <Button variant="outline" size="sm" className="w-full">
              View Deployment Details
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      )}

      {/* Interview Notes */}
      {application.interviewNotes && (
        <motion.div variants={fadeInUp} className="card-premium p-6">
          <h3 className="font-display font-semibold mb-3">Interview Notes</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {application.interviewNotes}
          </p>
        </motion.div>
      )}

      {/* Video Interview Link */}
      {application.videoInterviewUrl && (
        <motion.div variants={fadeInUp} className="card-premium p-6">
          <h3 className="font-display font-semibold mb-3">Video Interview</h3>
          <a
            href={application.videoInterviewUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline">
              <Globe className="w-4 h-4 mr-2" />
              Open Interview Link
            </Button>
          </a>
        </motion.div>
      )}
    </motion.div>
  );
}

export default ApplicationDetailPage;
