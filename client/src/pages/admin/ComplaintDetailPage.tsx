import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  AlertTriangle,
  User,
  Calendar,
  Clock,
  Shield,
  MessageCircle,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  Loader2,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminService } from "@/services/adminService";
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

const COMPLAINT_STATUSES = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "ESCALATED",
  "RESOLVED",
  "CLOSED",
];

const getStatusBadge = (status: string) => {
  const configs: Record<string, string> = {
    SUBMITTED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    UNDER_REVIEW: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    ESCALATED: "bg-red-500/10 text-red-500 border-red-500/20",
    RESOLVED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    CLOSED: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  };
  return configs[status] || configs.SUBMITTED;
};

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    EMPLOYER_ISSUE: "Employer Issue",
    AGENCY_ISSUE: "Agency Issue",
    DEPLOYMENT_DELAY: "Deployment Delay",
    CONTRACT_VIOLATION: "Contract Violation",
    ABUSE: "Abuse",
    OTHER: "Other",
  };
  return labels[category] || category;
};

function ComplaintDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [status, setStatus] = useState("");
  const [resolution, setResolution] = useState("");

  useEffect(() => {
    const fetchComplaint = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const response = await adminService.getComplaintDetail(id);
        const c = response.data;
        setComplaint(c);
        setStatus(c.status);
        setResolution(c.resolution || "");
      } catch (error) {
        toast.error("Failed to load complaint details");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    try {
      setIsSaving(true);
      await adminService.updateComplaint(id, {
        status,
        resolution: resolution || undefined,
      });
      toast.success("Complaint updated successfully");
      // Refresh
      const response = await adminService.getComplaintDetail(id);
      setComplaint(response.data);
    } catch (error) {
      toast.error("Failed to update complaint");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuickAction = async (newStatus: string) => {
    if (!id) return;
    try {
      setIsSaving(true);
      setStatus(newStatus);
      await adminService.updateComplaint(id, { status: newStatus });
      toast.success(`Complaint ${newStatus.toLowerCase().replace("_", " ")}`);
      const response = await adminService.getComplaintDetail(id);
      setComplaint(response.data);
      setStatus(response.data.status);
    } catch (error) {
      toast.error("Failed to update complaint");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <XCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Complaint not found</p>
        <Link to="/admin/complaints" className="mt-4">
          <Button variant="outline">Back to Complaints</Button>
        </Link>
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
      <motion.div
        variants={fadeInUp}
        className="flex flex-col sm:flex-row sm:items-center gap-4"
      >
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-display font-bold">
            Complaint Details 🛡️
          </h1>
          <p className="text-sm text-muted-foreground font-mono">
            {complaint.id}
          </p>
        </div>
        <Badge variant="outline" className={getStatusBadge(complaint.status)}>
          {complaint.status.replace("_", " ")}
        </Badge>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={fadeInUp} className="card-premium p-5">
        <h3 className="font-display font-semibold mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          {complaint.status === "SUBMITTED" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuickAction("UNDER_REVIEW")}
              disabled={isSaving}
            >
              <Clock className="w-4 h-4 mr-1" />
              Start Review
            </Button>
          )}
          {["SUBMITTED", "UNDER_REVIEW"].includes(complaint.status) && (
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 hover:text-red-700"
              onClick={() => handleQuickAction("ESCALATED")}
              disabled={isSaving}
            >
              <ArrowUpRight className="w-4 h-4 mr-1" />
              Escalate
            </Button>
          )}
          {complaint.status !== "RESOLVED" &&
            complaint.status !== "CLOSED" && (
              <Button
                size="sm"
                variant="outline"
                className="text-emerald-600 hover:text-emerald-700"
                onClick={() => handleQuickAction("RESOLVED")}
                disabled={isSaving}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Mark Resolved
              </Button>
            )}
          {complaint.status === "RESOLVED" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuickAction("CLOSED")}
              disabled={isSaving}
            >
              <XCircle className="w-4 h-4 mr-1" />
              Close Case
            </Button>
          )}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Complaint Description */}
          <motion.div variants={fadeInUp} className="card-premium p-6">
            <h3 className="font-display font-semibold flex items-center gap-2 mb-4">
              <MessageCircle className="w-5 h-5 text-accent" />
              Complaint Details
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Category</p>
                <Badge variant="secondary">
                  {getCategoryLabel(complaint.category)}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Description
                </p>
                <div className="p-4 rounded-xl bg-muted/50 text-sm whitespace-pre-wrap">
                  {complaint.description}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Filed</p>
                  <p className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(complaint.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Escalation Level
                  </p>
                  <Badge
                    variant="outline"
                    className={
                      complaint.escalationLevel > 0
                        ? "bg-red-500/10 text-red-500 border-red-500/20"
                        : ""
                    }
                  >
                    Level {complaint.escalationLevel}
                  </Badge>
                </div>
              </div>
              {complaint.isAnonymous && (
                <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/20">
                  <Shield className="w-3 h-3 mr-1" />
                  Filed Anonymously
                </Badge>
              )}
            </div>
          </motion.div>

          {/* Resolution */}
          <motion.div variants={fadeInUp} className="card-premium p-6">
            <h3 className="font-display font-semibold flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              Resolution
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground block mb-2">
                  Status
                </label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full sm:w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPLAINT_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-2">
                  Resolution Notes
                </label>
                <Textarea
                  placeholder="Enter resolution details, actions taken, or notes..."
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  rows={4}
                />
              </div>
              {complaint.resolvedAt && (
                <p className="text-xs text-muted-foreground">
                  Resolved on:{" "}
                  {new Date(complaint.resolvedAt).toLocaleString()}
                </p>
              )}
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="gradient-bg-accent text-accent-foreground"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Complainant Info */}
          <motion.div variants={fadeInUp} className="card-premium p-6">
            <h3 className="font-display font-semibold flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-blue-500" />
              Complainant
            </h3>
            {!complaint.isAnonymous && complaint.applicant ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Name</span>
                  <span className="text-sm font-medium">
                    {complaint.applicant.firstName}{" "}
                    {complaint.applicant.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="text-sm font-medium">
                    {complaint.applicant.user?.email || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Phone</span>
                  <span className="text-sm font-medium">
                    {complaint.applicant.phone || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Nationality
                  </span>
                  <span className="text-sm font-medium">
                    {complaint.applicant.nationality || "N/A"}
                  </span>
                </div>
                <Link
                  to={`/admin/applicants/${complaint.applicant.id}`}
                  className="block mt-2"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    View Profile
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center py-4">
                <Shield className="w-8 h-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Anonymous Complaint
                </p>
              </div>
            )}
          </motion.div>

          {/* Status Timeline */}
          <motion.div variants={fadeInUp} className="card-premium p-6">
            <h3 className="font-display font-semibold flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-accent" />
              Timeline
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Submitted</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(complaint.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              {complaint.updatedAt !== complaint.createdAt && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(complaint.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              {complaint.resolvedAt && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Resolved</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(complaint.resolvedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default ComplaintDetailPage;
