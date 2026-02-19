import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  DollarSign,
  MapPin,
  Users,
  Calendar,
  Edit2,
  Trash2,
  Eye,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const statusConfig: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "Active", color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" },
  FILLED: { label: "Filled", color: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400" },
  CANCELLED: { label: "Cancelled", color: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400" },
  EXPIRED: { label: "Expired", color: "bg-gray-50 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400" },
};

const applicationStatusConfig: Record<string, { label: string; color: string }> = {
  applied: { label: "Applied", color: "bg-gray-50 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400" },
  shortlisted: { label: "Shortlisted", color: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400" },
  interviewed: { label: "Interviewed", color: "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400" },
  selected: { label: "Selected", color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" },
  processing: { label: "Processing", color: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" },
  deployed: { label: "Deployed", color: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400" },
  rejected: { label: "Rejected", color: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400" },
};

function JobOrderDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [jobOrder, setJobOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchJobOrder = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const data = await employerService.getJobOrder(id);
      setJobOrder(data);
    } catch (error) {
      console.error("Failed to fetch job order:", error);
      toast.error("Failed to load job order");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobOrder();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !confirm("Are you sure you want to delete this job order?")) return;
    try {
      await employerService.deleteJobOrder(id);
      toast.success("Job order deleted");
      navigate("/employer/job-orders");
    } catch (error) {
      toast.error("Failed to delete job order");
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;
    try {
      await employerService.updateJobOrder(id, { status: newStatus });
      toast.success(`Job order ${newStatus.toLowerCase()}`);
      fetchJobOrder();
    } catch (error) {
      toast.error("Failed to update job order status");
    }
  };

  const handleApplicationStatusChange = async (applicationId: string, newStatus: string) => {
    try {
      await employerService.updateApplicationStatus(applicationId, { status: newStatus });
      toast.success(`Application status updated to ${newStatus.toLowerCase()}`);
      fetchJobOrder();
    } catch (error) {
      toast.error("Failed to update application status");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-accent mx-auto mb-3" />
          <p className="text-muted-foreground">Loading job order...</p>
        </div>
      </div>
    );
  }

  if (!jobOrder) {
    return (
      <div className="text-center py-16">
        <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
        <h2 className="text-xl font-semibold mb-2">Job Order Not Found</h2>
        <p className="text-muted-foreground mb-4">This job order may have been deleted.</p>
        <Button onClick={() => navigate("/employer/job-orders")}>Back to Job Orders</Button>
      </div>
    );
  }

  const requirements = jobOrder.requirements || {};
  const reqList = Array.isArray(requirements) ? requirements
    : Array.isArray(requirements.items) ? requirements.items
    : typeof requirements === "object" ? Object.values(requirements).flat()
    : [];

  const selectedCount = (jobOrder.statusCounts?.SELECTED || 0) + (jobOrder.statusCounts?.DEPLOYED || 0);
  const fillPercentage = jobOrder.positions > 0 ? (selectedCount / jobOrder.positions) * 100 : 0;

  const statusInfo = statusConfig[jobOrder.status] || statusConfig.ACTIVE;

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Back Button */}
      <motion.button
        variants={fadeInUp}
        onClick={() => navigate("/employer/job-orders")}
        className="flex items-center gap-2 text-accent hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Job Orders
      </motion.button>

      {/* Header */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-display font-bold mb-2">
              {jobOrder.title}
            </h1>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {jobOrder.location}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Posted {new Date(jobOrder.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Select onValueChange={handleStatusChange}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Change status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Set Active</SelectItem>
                <SelectItem value="FILLED">Mark Filled</SelectItem>
                <SelectItem value="CANCELLED">Cancel</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Key Info */}
        <div className="grid sm:grid-cols-4 gap-4 p-4 bg-secondary rounded-lg">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Salary</p>
            <p className="font-semibold text-accent">
              {jobOrder.salary ? `$${Number(jobOrder.salary).toLocaleString()}/mo` : "TBD"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Applicants</p>
            <p className="font-medium">{jobOrder.applicantCount || 0}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Positions</p>
            <p className="font-medium">{jobOrder.positions}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Status</p>
            <Badge variant="secondary" className={statusInfo.color}>
              {statusInfo.label}
            </Badge>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <motion.div variants={fadeInUp} className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-3">Job Description</h2>
            <p className="text-muted-foreground whitespace-pre-line">{jobOrder.description}</p>
          </motion.div>

          {/* Requirements */}
          {reqList.length > 0 && (
            <motion.div variants={fadeInUp} className="card-premium p-6">
              <h2 className="text-xl font-semibold mb-4">Requirements</h2>
              <ul className="space-y-2">
                {reqList.map((req: string, idx: number) => (
                  <li key={idx} className="flex gap-3 text-muted-foreground">
                    <span className="text-accent mt-1">•</span>
                    {typeof req === "string" ? req : JSON.stringify(req)}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Applications / Candidates */}
          <motion.div variants={fadeInUp} className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-4">
              Applications ({jobOrder.candidates?.length || 0})
            </h2>
            <div className="space-y-3">
              {(!jobOrder.candidates || jobOrder.candidates.length === 0) ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No applications received yet
                </p>
              ) : (
                jobOrder.candidates.map((cand: any) => {
                  const appStatus = applicationStatusConfig[cand.status] || applicationStatusConfig.applied;
                  return (
                    <div key={cand.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent font-semibold text-xs flex items-center justify-center">
                          {(cand.name || "?").split(" ").map((n: string) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{cand.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Applied {new Date(cand.appliedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={appStatus.color}>
                          {appStatus.label}
                        </Badge>
                        <Select
                          onValueChange={(val) => handleApplicationStatusChange(cand.id, val)}
                        >
                          <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue placeholder="Action" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SHORTLISTED">Shortlist</SelectItem>
                            <SelectItem value="INTERVIEWED">Interviewed</SelectItem>
                            <SelectItem value="SELECTED">Select</SelectItem>
                            <SelectItem value="REJECTED">Reject</SelectItem>
                            <SelectItem value="DEPLOYED">Deploy</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Positions */}
          <motion.div
            variants={fadeInUp}
            className="card-premium p-6 sticky top-20"
          >
            <h3 className="font-semibold mb-4">Position Progress</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Filled / Selected</span>
                  <span className="font-semibold">
                    {selectedCount}/{jobOrder.positions}
                  </span>
                </div>
                <Progress value={fillPercentage} className="h-2" />
              </div>
              <div className="text-xs text-muted-foreground">
                {jobOrder.positions - selectedCount} position
                {jobOrder.positions - selectedCount !== 1 ? "s" : ""} remaining
              </div>
            </div>
          </motion.div>

          {/* Application Status Breakdown */}
          {jobOrder.statusCounts && Object.keys(jobOrder.statusCounts).length > 0 && (
            <motion.div variants={fadeInUp} className="card-premium p-6">
              <h3 className="font-semibold mb-4">Status Breakdown</h3>
              <div className="space-y-2">
                {Object.entries(jobOrder.statusCounts).map(([status, count]) => (
                  <div key={status} className="flex justify-between items-center p-2 bg-secondary rounded-lg">
                    <span className="text-sm capitalize">{status.toLowerCase()}</span>
                    <Badge variant="secondary">{String(count)}</Badge>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default JobOrderDetailsPage;
