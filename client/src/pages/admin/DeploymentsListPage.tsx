import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Globe,
  Search,
  Filter,
  ChevronRight,
  MapPin,
  Calendar,
  CheckCircle,
  AlertCircle,
  Plane,
  Loader2,
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

function DeploymentsListPage() {
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
        toast.error("Failed to load deployments");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeployments();
  }, []);

  const filteredDeployments = deployments.filter((deployment) => {
    const applicantName = `${deployment.application.applicant.firstName} ${deployment.application.applicant.lastName}`;
    const location = deployment.application.jobOrder.location || "";
    const matchesSearch =
      applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || deployment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const configs: Record<string, string> = {
      PENDING: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      PROCESSING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      APPROVED: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
      DEPLOYED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    };
    return configs[status] || configs.PENDING;
  };

  const deploymentStats = {
    total: deployments.length,
    thisMonth: deployments.filter(
      (d) =>
        new Date(d.createdAt).getMonth() === new Date().getMonth() &&
        new Date(d.createdAt).getFullYear() === new Date().getFullYear(),
    ).length,
    inTransit: deployments.filter((d) => d.status === "APPROVED").length,
    deployed: deployments.filter((d) => d.status === "DEPLOYED").length,
  };

  const successRate =
    deploymentStats.total > 0
      ? Math.round(
          ((deploymentStats.deployed + deploymentStats.inTransit) /
            deploymentStats.total) *
            100,
        )
      : 0;

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
            Deployments Management ✈️
          </h1>
          <p className="text-muted-foreground">
            Track overseas worker deployments
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid grid-cols-4 gap-4">
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Deployed</p>
          <p className="text-2xl font-display font-bold">
            {deploymentStats.deployed}
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">This Month</p>
          <p className="text-2xl font-display font-bold text-blue-500">
            {deploymentStats.thisMonth}
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Processing</p>
          <p className="text-2xl font-display font-bold text-cyan-500">
            {deploymentStats.inTransit}
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
          <p className="text-2xl font-display font-bold text-emerald-500">
            {successRate}%
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
                placeholder="Search by applicant or destination..."
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
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="APPROVED">In Transit</SelectItem>
              <SelectItem value="DEPLOYED">Deployed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div variants={fadeInUp} className="card-premium overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Employer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Medical</TableHead>
                  <TableHead>Visa</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeployments.length > 0 ? (
                  filteredDeployments.map((deployment) => (
                    <TableRow key={deployment.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono font-medium text-sm">
                        {deployment.id.substring(0, 8)}
                      </TableCell>
                      <TableCell>
                        {deployment.application.applicant.firstName}{" "}
                        {deployment.application.applicant.lastName}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {deployment.application.jobOrder.title}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {deployment.application.jobOrder.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        {deployment.application.jobOrder.employer.companyName}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusBadge(deployment.status)}
                        >
                          {deployment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {deployment.medicalStatus || "PENDING"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {deployment.visaStatus || "PENDING"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link to={`/admin/deployments/${deployment.id}`}>
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No deployments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      {!isLoading && (
        <motion.div
          variants={fadeInUp}
          className="flex items-center justify-between"
        >
          <p className="text-sm text-muted-foreground">
            Showing {filteredDeployments.length} of {deployments.length}{" "}
            deployments
          </p>
          <div className="flex gap-2">
            <Button variant="outline" disabled>
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={filteredDeployments.length < 20}
            >
              Next
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default DeploymentsListPage;
