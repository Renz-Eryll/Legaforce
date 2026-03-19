import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Loader2,
  Clock,
  Eye,
  ArrowRight,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

const getStatusBadge = (status: string) => {
  const configs: Record<string, string> = {
    ACTIVE: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    FILLED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
    EXPIRED: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  };
  return configs[status] || configs.ACTIVE;
};

const getAppStatusBadge = (status: string) => {
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

function JobOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [jobOrder, setJobOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchJobOrder = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const response = await adminService.getJobOrderDetail(id);
        setJobOrder(response.data);
      } catch (error) {
        toast.error("Failed to load job order details");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobOrder();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;
    try {
      setIsUpdating(true);
      await adminService.updateJobOrderStatus(id, newStatus);
      const response = await adminService.getJobOrderDetail(id);
      setJobOrder(response.data);
      toast.success(`Job order status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!jobOrder) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <XCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Job order not found</p>
        <Link to="/admin/job-orders" className="mt-4">
          <Button variant="outline">Back to Job Orders</Button>
        </Link>
      </div>
    );
  }

  const requirements =
    typeof jobOrder.requirements === "object"
      ? jobOrder.requirements
      : {};

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
            {jobOrder.title}
          </h1>
          <p className="text-sm text-muted-foreground font-mono">
            {jobOrder.id}
          </p>
        </div>
        <Badge
          variant="outline"
          className={`text-sm px-3 py-1 ${getStatusBadge(jobOrder.status)}`}
        >
          {jobOrder.status}
        </Badge>
      </motion.div>

      {/* Admin Actions */}
      <motion.div variants={fadeInUp} className="card-premium p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <span className="text-sm font-medium">Admin Actions:</span>
          <div className="flex flex-wrap gap-2">
            {jobOrder.status === "ACTIVE" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-emerald-600 hover:text-emerald-700"
                  onClick={() => handleStatusChange("FILLED")}
                  disabled={isUpdating}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Mark as Filled
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleStatusChange("CANCELLED")}
                  disabled={isUpdating}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </>
            )}
            {jobOrder.status === "CANCELLED" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStatusChange("ACTIVE")}
                disabled={isUpdating}
              >
                Reactivate
              </Button>
            )}
            {isUpdating && (
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Description */}
          <motion.div variants={fadeInUp} className="card-premium p-6">
            <h3 className="font-display font-semibold flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-accent" />
              Job Description
            </h3>
            <div className="text-sm whitespace-pre-wrap text-muted-foreground leading-relaxed">
              {jobOrder.description}
            </div>
          </motion.div>

          {/* Requirements */}
          {(requirements.skills?.length > 0 ||
            requirements.experience ||
            requirements.education) && (
            <motion.div variants={fadeInUp} className="card-premium p-6">
              <h3 className="font-display font-semibold mb-4">Requirements</h3>
              <div className="space-y-3">
                {requirements.skills?.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {requirements.skills.map((skill: string, i: number) => (
                        <Badge key={i} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {requirements.experience && (
                  <div>
                    <p className="text-xs text-muted-foreground">Experience</p>
                    <p className="text-sm font-medium">
                      {requirements.experience}
                    </p>
                  </div>
                )}
                {requirements.education && (
                  <div>
                    <p className="text-xs text-muted-foreground">Education</p>
                    <p className="text-sm font-medium">
                      {requirements.education}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Applications */}
          <motion.div variants={fadeInUp} className="card-premium p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Applications ({jobOrder._count?.applications || 0})
              </h3>
            </div>
            {jobOrder.applications?.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Nationality</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobOrder.applications.map((app: any) => (
                      <TableRow key={app.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {app.applicant?.firstName} {app.applicant?.lastName}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {app.applicant?.nationality || "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getAppStatusBadge(app.status)}
                          >
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Link to={`/admin/applications/${app.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center py-8">
                <Users className="w-10 h-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  No applications yet
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Job Details */}
          <motion.div variants={fadeInUp} className="card-premium p-6">
            <h3 className="font-display font-semibold mb-4">Job Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Positions</span>
                <span className="text-sm font-medium">
                  {jobOrder.positions}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Location</span>
                <span className="text-sm font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {jobOrder.location}
                </span>
              </div>
              {jobOrder.salary && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Salary</span>
                  <span className="text-sm font-medium">
                    ₱{jobOrder.salary.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Posted</span>
                <span className="text-sm font-medium">
                  {new Date(jobOrder.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Employer */}
          <motion.div variants={fadeInUp} className="card-premium p-6">
            <h3 className="font-display font-semibold flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-purple-500" />
              Employer
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Company</span>
                <span className="text-sm font-medium">
                  {jobOrder.employer?.companyName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Contact</span>
                <span className="text-sm font-medium">
                  {jobOrder.employer?.contactPerson || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Country</span>
                <span className="text-sm font-medium">
                  {jobOrder.employer?.country || "N/A"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default JobOrderDetailPage;
