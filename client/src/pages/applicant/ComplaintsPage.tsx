import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  Send,
  Clock,
  CheckCircle,
  MessageSquare,
  Plus,
  Shield,
  Loader2,
  X,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COMPLAINT_CATEGORIES } from "@/utils/constants";
import { applicantService } from "@/services/applicantService";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

// Worker Safety & Protection: confidential reports; escalation: Admin → Compliance → Legal/Welfare
const COMPLAINT_TYPE_OPTIONS = [
  { value: "employer_issue", label: COMPLAINT_CATEGORIES.EMPLOYER_ISSUE.label },
  { value: "agency_issue", label: COMPLAINT_CATEGORIES.AGENCY_ISSUE.label },
  { value: "deployment_delay", label: COMPLAINT_CATEGORIES.DEPLOYMENT_DELAY.label },
  { value: "abuse", label: COMPLAINT_CATEGORIES.ABUSE.label },
  { value: "contract_violation", label: COMPLAINT_CATEGORIES.CONTRACT_VIOLATION.label },
  { value: "other", label: COMPLAINT_CATEGORIES.OTHER.label },
];

const ESCALATION_LEVELS = [
  { level: 1, name: "Admin", description: "Initial review" },
  { level: 2, name: "Compliance", description: "Policy & compliance check" },
  { level: 3, name: "Legal / Welfare", description: "Legal or welfare support" },
];

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  SUBMITTED: { label: "Submitted", color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: AlertCircle },
  UNDER_REVIEW: { label: "Under Review", color: "bg-amber-500/10 text-amber-500 border-amber-500/20", icon: Clock },
  ESCALATED: { label: "Escalated", color: "bg-red-500/10 text-red-500 border-red-500/20", icon: AlertTriangle },
  RESOLVED: { label: "Resolved", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", icon: CheckCircle },
  CLOSED: { label: "Closed", color: "bg-gray-500/10 text-gray-500 border-gray-500/20", icon: CheckCircle },
};

const categoryMap: Record<string, string> = {
  EMPLOYER_ISSUE: "Employer Issue",
  AGENCY_ISSUE: "Agency Issue",
  DEPLOYMENT_DELAY: "Deployment Delay",
  CONTRACT_VIOLATION: "Contract Violation",
  ABUSE: "Abuse",
  OTHER: "Other",
};

function ComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    type: "other",
    isAnonymous: false,
  });
  const [confidentialAck, setConfidentialAck] = useState(false);

  const fetchComplaints = async (status?: string) => {
    try {
      setIsLoading(true);
      const params = status && status !== "all" ? { status } : undefined;
      const data = await applicantService.getComplaints(params);
      setComplaints(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
      toast.error("Failed to load complaints");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confidentialAck || !formData.description.trim()) return;

    try {
      setIsSubmitting(true);
      await applicantService.createComplaint({
        category: formData.type,
        subject: formData.subject,
        description: formData.description,
      });
      toast.success("Complaint submitted successfully! It will be reviewed by our team.");
      setFormData({ subject: "", description: "", type: "other", isAnonymous: false });
      setConfidentialAck(false);
      setShowForm(false);
      // Refresh the list
      await fetchComplaints();
    } catch (error) {
      console.error("Failed to submit complaint:", error);
      toast.error("Failed to submit complaint. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredComplaints = filterStatus === "all"
    ? complaints
    : complaints.filter((c) => c.status === filterStatus);

  const stats = {
    total: complaints.length,
    open: complaints.filter((c) => c.status === "SUBMITTED" || c.status === "UNDER_REVIEW").length,
    resolved: complaints.filter((c) => c.status === "RESOLVED" || c.status === "CLOSED").length,
  };

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
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-8 h-8 text-accent" />
            <h1 className="text-2xl sm:text-3xl font-display font-bold">
              Worker Safety & Protection
            </h1>
          </div>
          <p className="text-muted-foreground">
            File confidential reports or complaints. Escalation: Admin → Compliance → Legal / Welfare.
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="gradient-bg-accent text-accent-foreground"
        >
          {showForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          {showForm ? "Cancel" : "File Report"}
        </Button>
      </motion.div>

      {/* Escalation levels */}
      <motion.div variants={fadeInUp} className="card-premium p-4">
        <h3 className="text-sm font-semibold mb-3">Escalation Process</h3>
        <div className="flex flex-wrap gap-4">
          {ESCALATION_LEVELS.map((e, idx) => (
            <div key={e.level} className="flex items-center gap-2 text-sm">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold">
                {e.level}
              </div>
              <span className="font-medium text-foreground">{e.name}</span>
              <span className="text-muted-foreground">– {e.description}</span>
              {idx < ESCALATION_LEVELS.length - 1 && (
                <span className="text-muted-foreground ml-2">→</span>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid sm:grid-cols-3 gap-4">
        <div className="card-premium p-5">
          <p className="text-sm text-muted-foreground mb-1">Total Reports</p>
          <p className="text-2xl font-display font-bold">{stats.total}</p>
        </div>
        <div className="card-premium p-5">
          <p className="text-sm text-muted-foreground mb-1">Open / Under Review</p>
          <p className="text-2xl font-display font-bold text-amber-500">{stats.open}</p>
        </div>
        <div className="card-premium p-5">
          <p className="text-sm text-muted-foreground mb-1">Resolved</p>
          <p className="text-2xl font-display font-bold text-emerald-500">{stats.resolved}</p>
        </div>
      </motion.div>

      {/* Confidential Report Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="card-premium p-6 border-accent/20">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-accent" />
                <p className="text-sm text-muted-foreground">
                  Your report is confidential and will be handled according to our escalation process.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select
                    value={formData.type}
                    onValueChange={(val) => setFormData({ ...formData, type: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPLAINT_TYPE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Input
                    placeholder="Brief subject of your report"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <textarea
                    placeholder="Detailed description of your complaint or report (kept confidential)"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 border rounded-xl border-input bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
                    rows={4}
                    required
                  />
                </div>
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confidentialAck}
                    onChange={(e) => setConfidentialAck(e.target.checked)}
                    className="rounded border-input mt-0.5"
                  />
                  <span className="text-muted-foreground">
                    I understand this is a confidential report and will be handled per
                    escalation (Admin → Compliance → Legal/Welfare).
                  </span>
                </label>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={!confidentialAck || isSubmitting || !formData.description.trim()}
                    className="gradient-bg-accent text-accent-foreground"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Confidential Report
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter */}
      <motion.div variants={fadeInUp} className="card-premium p-4">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="SUBMITTED">Submitted</SelectItem>
            <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
            <SelectItem value="ESCALATED">Escalated</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Complaints List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : (
        <motion.div variants={fadeInUp} className="space-y-4">
          {filteredComplaints.map((complaint: any) => {
            const statusInfo = statusConfig[complaint.status] || statusConfig.SUBMITTED;
            const StatusIcon = statusInfo?.icon;
            const categoryLabel = categoryMap[complaint.category] || complaint.category || "Other";

            return (
              <motion.div
                key={complaint.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-premium p-5 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {categoryLabel}
                      </Badge>
                      {complaint.isAnonymous && (
                        <Badge variant="secondary" className="text-xs">
                          Anonymous
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {complaint.description}
                    </p>
                    {complaint.resolution && (
                      <div className="mt-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                        <p className="text-xs font-semibold text-emerald-600 mb-1">Resolution:</p>
                        <p className="text-sm text-muted-foreground">{complaint.resolution}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    <Badge variant="outline" className={cn("text-xs", statusInfo.color)}>
                      {StatusIcon && <StatusIcon className="w-3 h-3 mr-1" />}
                      {statusInfo.label}
                    </Badge>
                    {complaint.escalationLevel != null && complaint.escalationLevel > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        Level {complaint.escalationLevel}: {ESCALATION_LEVELS[complaint.escalationLevel - 1]?.name || complaint.escalationLevel}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Filed on {new Date(complaint.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {!isLoading && filteredComplaints.length === 0 && (
        <motion.div variants={fadeInUp} className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium text-muted-foreground mb-2">No reports found</p>
          <p className="text-sm text-muted-foreground">
            {filterStatus !== "all" ? "Try changing your status filter." : "File a report if you have any concerns."}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default ComplaintsPage;
