import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Send,
  FileText,
  Clock,
  CheckCircle,
  MessageSquare,
  Plus,
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

const mockComplaints = [
  {
    id: "COMP-001",
    subject: "Salary Discrepancy",
    date: "2025-01-15",
    status: "resolved",
    priority: "high",
    description: "Received payment less than agreed upon salary",
  },
  {
    id: "COMP-002",
    subject: "Work Schedule Issue",
    date: "2025-01-10",
    status: "in-progress",
    priority: "medium",
    description: "Excessive overtime hours not properly compensated",
  },
  {
    id: "COMP-003",
    subject: "Accommodation Problem",
    date: "2025-01-05",
    status: "open",
    priority: "high",
    description: "Poor living conditions at provided accommodation",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newComplaint = {
      id: `COMP-${complaints.length + 1}`,
      subject: formData.subject,
      description: formData.description,
      date: new Date().toISOString().split("T")[0],
      status: "open",
      priority: "medium",
    };
    setComplaints([newComplaint, ...complaints]);
    setFormData({ subject: "", description: "", type: "other" });
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
      {/* Header */}
      <motion.div
        variants={fadeInUp}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-display font-bold mb-1">Complaints</h1>
          <p className="text-muted-foreground">
            Report and track your concerns
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="gradient-bg-accent text-accent-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          File Complaint
        </Button>
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

      {/* Form */}
      {showForm && (
        <motion.div variants={fadeInUp} className="card-premium p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Complaint Type
              </label>
              <Select
                defaultValue="other"
                onValueChange={(val) => setFormData({ ...formData, type: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salary">Salary Issue</SelectItem>
                  <SelectItem value="hours">Work Hours</SelectItem>
                  <SelectItem value="accommodation">Accommodation</SelectItem>
                  <SelectItem value="safety">Safety Concern</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <Input
                placeholder="Complaint subject"
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
                placeholder="Detailed description of your complaint"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-3 border rounded-lg border-input"
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                className="gradient-bg-accent text-accent-foreground"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Complaint
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
        {filteredComplaints.map((complaint) => {
          const statusInfo =
            statusConfig[complaint.status as keyof typeof statusConfig];
          const StatusIcon = statusInfo?.icon;

          return (
            <div key={complaint.id} className="card-premium p-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">
                    {complaint.subject}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {complaint.description}
                  </p>
                </div>
                <div className="flex gap-2">
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
