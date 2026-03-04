import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FileCheck,
  Search,
  Filter,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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

function CompliancePage() {
  const [deployments, setDeployments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDeployments = async () => {
      try {
        setIsLoading(true);
        const response = await adminService.getDeployments();
        setDeployments(response.data || []);
      } catch (error) {
        toast.error("Failed to load compliance data");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeployments();
  }, []);

  const filteredCompliance = deployments.filter((item) => {
    const applicantName = `${item.applicant?.firstName} ${item.applicant?.lastName}`;
    const matchesSearch =
      applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.position?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.deploymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const complianceStats = {
    total: deployments.length,
    ready: deployments.filter(
      (d) =>
        d.medicalStatus === "approved" &&
        d.visaStatus === "approved" &&
        d.oecStatus === "approved",
    ).length,
    inProgress: deployments.filter(
      (d) =>
        !(
          d.medicalStatus === "approved" &&
          d.visaStatus === "approved" &&
          d.oecStatus === "approved"
        ) &&
        !(
          d.medicalStatus === "rejected" ||
          d.visaStatus === "rejected" ||
          d.oecStatus === "rejected"
        ),
    ).length,
    delayed: deployments.filter(
      (d) =>
        d.medicalStatus === "rejected" ||
        d.visaStatus === "rejected" ||
        d.oecStatus === "rejected",
    ).length,
  };

  const getComplianceStatusBadge = (status: string) => {
    const configs: Record<string, string> = {
      approved:
        "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 flex items-center gap-1",
      pending:
        "bg-amber-500/10 text-amber-500 border-amber-500/20 flex items-center gap-1",
      in_progress:
        "bg-blue-500/10 text-blue-500 border-blue-500/20 flex items-center gap-1",
      rejected:
        "bg-red-500/10 text-red-500 border-red-500/20 flex items-center gap-1",
    };
    return configs[status] || configs.pending;
  };

  const getOverallStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ready: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      in_progress: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      delayed: "bg-red-500/10 text-red-500 border-red-500/20",
      completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    };
    return colors[status] || colors.in_progress;
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
          <h1 className="text-3xl font-display font-bold mb-1">
            Compliance Management 📋
          </h1>
          <p className="text-muted-foreground">
            Track deployment compliance and documents
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Compliance Report
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid grid-cols-4 gap-4">
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">In Deployment</p>
          <p className="text-2xl font-display font-bold">
            {complianceStats.total}
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">
            Documentation Ready
          </p>
          <p className="text-2xl font-display font-bold text-emerald-500">
            {complianceStats.ready}
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">In Progress</p>
          <p className="text-2xl font-display font-bold text-amber-500">
            {complianceStats.inProgress}
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Delayed</p>
          <p className="text-2xl font-display font-bold text-red-500">
            {complianceStats.delayed}
          </p>
        </div>
      </motion.div>

      {/* Filters & Search */}
      <motion.div variants={fadeInUp} className="card-premium p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by applicant or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ready">Ready to Deploy</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="delayed">Delayed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Compliance Items */}
      {isLoading ? (
        <motion.div
          variants={fadeInUp}
          className="flex items-center justify-center py-12"
        >
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </motion.div>
      ) : filteredCompliance.length === 0 ? (
        <motion.div variants={fadeInUp} className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">No compliance records found</p>
        </motion.div>
      ) : (
        <motion.div variants={fadeInUp} className="space-y-4">
          {filteredCompliance.map((item) => (
            <div key={item.id} className="card-premium p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 pb-4 border-b">
                <div>
                  <h3 className="text-lg font-semibold">
                    {item.applicant?.firstName} {item.applicant?.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.position}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={getOverallStatusColor(item.deploymentStatus)}
                  >
                    {item.deploymentStatus}
                  </Badge>
                  <Link to={`/admin/deployments/${item.id}`}>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Compliance Documents Grid */}
              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                {/* Medical */}
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Medical Exam</span>
                    {item.medicalStatus === "approved" ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : item.medicalStatus === "pending" ? (
                      <Clock className="w-4 h-4 text-amber-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className={getComplianceStatusBadge(item.medicalStatus)}
                  >
                    {item.medicalStatus}
                  </Badge>
                </div>

                {/* Visa */}
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Visa</span>
                    {item.visaStatus === "approved" ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : item.visaStatus === "in_progress" ? (
                      <Clock className="w-4 h-4 text-blue-500" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className={getComplianceStatusBadge(item.visaStatus)}
                  >
                    {item.visaStatus}
                  </Badge>
                </div>

                {/* OEC */}
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">OEC Clearance</span>
                    {item.oecStatus === "approved" ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className={getComplianceStatusBadge(item.oecStatus)}
                  >
                    {item.oecStatus}
                  </Badge>
                </div>
              </div>

              {/* Deployment Info */}
              <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
                <p className="text-sm">
                  <span className="font-medium">Expected Deployment:</span>{" "}
                  <span className="text-accent">
                    {item.expectedDeploymentDate
                      ? new Date(
                          item.expectedDeploymentDate,
                        ).toLocaleDateString()
                      : "TBD"}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

export default CompliancePage;
