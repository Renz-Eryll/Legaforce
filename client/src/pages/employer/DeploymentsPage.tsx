import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Plane,
  CheckCircle,
  AlertCircle,
  MapPin,
  Calendar,
  Users,
  Loader2,
  Clock,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { employerService } from "@/services/employerService";

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

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  DEPLOYED: { label: "Active", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", icon: CheckCircle },
  PROCESSING: { label: "Processing", color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: Clock },
  SELECTED: { label: "Selected", color: "bg-amber-500/10 text-amber-600 border-amber-500/20", icon: Users },
};

const complianceConfig: Record<string, { label: string; color: string }> = {
  APPROVED: { label: "Approved", color: "text-emerald-600 bg-emerald-500/10" },
  PENDING: { label: "Pending", color: "text-amber-600 bg-amber-500/10" },
  IN_PROGRESS: { label: "In Progress", color: "text-blue-600 bg-blue-500/10" },
  REJECTED: { label: "Rejected", color: "text-red-600 bg-red-500/10" },
  EXPIRED: { label: "Expired", color: "text-gray-500 bg-gray-500/10" },
};

function DeploymentsPage() {
  const [deployments, setDeployments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchDeployments = async () => {
      try {
        setIsLoading(true);
        const data = await employerService.getDeployments();
        setDeployments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch deployments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDeployments();
  }, []);

  const filteredDeployments =
    statusFilter === "all"
      ? deployments
      : deployments.filter((d) => d.status === statusFilter);

  const stats = {
    total: deployments.length,
    active: deployments.filter((d) => d.status === "DEPLOYED").length,
    processing: deployments.filter((d) => d.status === "PROCESSING").length,
    selected: deployments.filter((d) => d.status === "SELECTED").length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <p className="text-muted-foreground">Loading deployments...</p>
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
        <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1">Deployments</h1>
        <p className="text-muted-foreground">
          Track deployed workers — from processing to arrival and beyond.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid sm:grid-cols-4 gap-4">
        <div className="card-premium p-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-accent" />
            <p className="text-sm text-muted-foreground">Total Workers</p>
          </div>
          <p className="text-2xl font-display font-bold">{stats.total}</p>
        </div>
        <div className="card-premium p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <p className="text-sm text-muted-foreground">Active</p>
          </div>
          <p className="text-2xl font-display font-bold text-emerald-600">{stats.active}</p>
        </div>
        <div className="card-premium p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <p className="text-sm text-muted-foreground">Processing</p>
          </div>
          <p className="text-2xl font-display font-bold text-blue-600">{stats.processing}</p>
        </div>
        <div className="card-premium p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-amber-500" />
            <p className="text-sm text-muted-foreground">Selected</p>
          </div>
          <p className="text-2xl font-display font-bold text-amber-600">{stats.selected}</p>
        </div>
      </motion.div>

      {/* Filter */}
      <motion.div variants={fadeInUp} className="card-premium p-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="DEPLOYED">Active / Deployed</SelectItem>
            <SelectItem value="PROCESSING">Processing</SelectItem>
            <SelectItem value="SELECTED">Selected</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Deployments Table */}
      <motion.div variants={fadeInUp} className="card-premium overflow-hidden">
        {filteredDeployments.length === 0 ? (
          <div className="text-center py-12">
            <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium text-muted-foreground mb-1">No deployments found</p>
            <p className="text-sm text-muted-foreground">
              Workers will appear here once they are selected and processing begins.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/50">
                <TableHead>Worker</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Medical</TableHead>
                <TableHead>Visa</TableHead>
                <TableHead>Flight Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeployments.map((dep) => {
                const statusInfo = statusConfig[dep.status] || statusConfig.PROCESSING;
                const StatusIcon = statusInfo.icon;
                const medicalInfo = complianceConfig[dep.medicalStatus] || complianceConfig.PENDING;
                const visaInfo = complianceConfig[dep.visaStatus] || complianceConfig.PENDING;

                return (
                  <TableRow key={dep.id} className="border-b border-border/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-display font-bold text-sm">
                          {(dep.workerName || "?").charAt(0)}
                        </div>
                        <span className="font-medium">{dep.workerName || "—"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{dep.position || "—"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="w-3 h-3" />
                        {dep.destination || dep.location || "—"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-xs", statusInfo.color)}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn("text-xs", medicalInfo.color)}>
                        {medicalInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn("text-xs", visaInfo.color)}>
                        {visaInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {dep.flightDate
                        ? new Date(dep.flightDate).toLocaleDateString()
                        : "TBD"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </motion.div>
    </motion.div>
  );
}

export default DeploymentsPage;
