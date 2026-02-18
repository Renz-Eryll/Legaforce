import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Send,
  Clock,
  CheckCircle,
  MessageSquare,
  Plus,
  Shield,
  Building2,
  FileText,
  HelpCircle,
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

type ComplaintItem = {
  id: string;
  subject: string;
  description: string;
  category?: string;
  date: string;
  status: string;
  priority: string;
  escalationLevel?: number;
};

const mockComplaints: ComplaintItem[] = [
  {
    id: "COMP-001",
    subject: "Salary Discrepancy",
    category: "employer_issue",
    date: "2025-01-15",
    status: "resolved",
    priority: "high",
    description: "Received payment less than agreed upon salary",
    escalationLevel: 2,
  },
  {
    id: "COMP-002",
    subject: "Work Schedule Issue",
    category: "employer_issue",
    date: "2025-01-10",
    status: "in-progress",
    priority: "medium",
    description: "Excessive overtime hours not properly compensated",
    escalationLevel: 1,
  },
  {
    id: "COMP-003",
    subject: "Deployment delay – no update",
    category: "deployment_delay",
    date: "2025-01-05",
    status: "open",
    priority: "high",
    description: "Selected 2 months ago but no processing update",
    escalationLevel: 1,
  },
];

const statusConfig = {
  open: { label: "Open", color: "bg-blue-50 text-blue-700", icon: AlertCircle },
  "in-progress": {
    label: "In Progress",
    color: "bg-amber-50 text-amber-700",
    icon: Clock,
  },
  resolved: {
    label: "Resolved",
    color: "bg-emerald-50 text-emerald-700",
    icon: CheckCircle,
  },
};

function ComplaintsPage() {
  const [complaints, setComplaints] = useState(mockComplaints);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    type: "other",
  });
  const [confidentialAck, setConfidentialAck] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confidentialAck) return;
    const newComplaint = {
      id: `COMP-${complaints.length + 1}`,
      subject: formData.subject,
      category: formData.type,
      description: formData.description,
      date: new Date().toISOString().split("T")[0],
      status: "open",
      priority: "medium",
      escalationLevel: 1,
    };
    setComplaints([newComplaint, ...complaints]);
    setFormData({ subject: "", description: "", type: "other" });
    setConfidentialAck(false);
    setShowForm(false);
  };

  const filteredComplaints =
    filterStatus === "all"
      ? complaints
      : complaints.filter((c) => c.status === filterStatus);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Header - Worker Safety & Protection Module */}
      <motion.div
        variants={fadeInUp}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-8 h-8 text-accent" />
            <h1 className="text-3xl font-display font-bold">
              Worker Safety & Protection
            </h1>
          </div>
          <p className="text-muted-foreground">
            Confidential report or complaint. Escalation: Admin → Compliance →
            Legal / Welfare.
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="gradient-bg-accent text-accent-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Confidential Report
        </Button>
      </motion.div>

      {/* Escalation levels */}
      <motion.div variants={fadeInUp} className="card-premium p-4">
        <h3 className="text-sm font-semibold mb-3">Escalation levels</h3>
        <div className="flex flex-wrap gap-4">
          {ESCALATION_LEVELS.map((e) => (
            <div
              key={e.level}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <span className="font-medium text-foreground">{e.name}</span>
              <span>– {e.description}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid sm:grid-cols-3 gap-4">
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Complaints</p>
          <p className="text-2xl font-display font-bold">{complaints.length}</p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Open</p>
          <p className="text-2xl font-display font-bold text-blue-600">
            {complaints.filter((c) => c.status === "open").length}
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Resolved</p>
          <p className="text-2xl font-display font-bold text-emerald-600">
            {complaints.filter((c) => c.status === "resolved").length}
          </p>
        </div>
      </motion.div>

      {/* Confidential Report Form */}
      {showForm && (
        <motion.div variants={fadeInUp} className="card-premium p-6">
          <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Your report is confidential and will be handled according to our
            escalation process.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Category
              </label>
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
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Description
              </label>
              <textarea
                placeholder="Detailed description (kept confidential)"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-3 border rounded-lg border-input"
                rows={4}
              />
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={confidentialAck}
                onChange={(e) => setConfidentialAck(e.target.checked)}
                className="rounded border-input"
              />
              I understand this is a confidential report and will be handled per
              escalation (Admin → Compliance → Legal/Welfare).
            </label>
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={!confidentialAck}
                className="gradient-bg-accent text-accent-foreground"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Confidential Report
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
        </motion.div>
      )}

      {/* Filter */}
      <motion.div variants={fadeInUp} className="card-premium p-4">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Complaints List */}
      <motion.div variants={fadeInUp} className="space-y-4">
        {filteredComplaints.map((complaint: ComplaintItem) => {
          const statusInfo =
            statusConfig[complaint.status as keyof typeof statusConfig];
          const StatusIcon = statusInfo?.icon;
          const categoryLabel =
            COMPLAINT_TYPE_OPTIONS.find((o) => o.value === complaint.category)
              ?.label || "Other";

          return (
            <div key={complaint.id} className="card-premium p-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">
                    {complaint.subject}
                  </h3>
                  <Badge variant="outline" className="mb-2 text-xs">
                    {categoryLabel}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {complaint.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={
                      complaint.priority === "high"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {complaint.priority}
                  </Badge>
                  <Badge variant="outline" className={statusInfo?.color}>
                    {StatusIcon && <StatusIcon className="w-3 h-3 mr-1" />}
                    {statusInfo?.label}
                  </Badge>
                  {complaint.escalationLevel != null && (
                    <Badge variant="secondary">
                      Level: {ESCALATION_LEVELS[complaint.escalationLevel - 1]?.name || complaint.escalationLevel}
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Filed on {new Date(complaint.date).toLocaleDateString()}
              </p>
            </div>
          );
        })}
      </motion.div>

      {filteredComplaints.length === 0 && (
        <motion.div variants={fadeInUp} className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">No complaints to display</p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default ComplaintsPage;
