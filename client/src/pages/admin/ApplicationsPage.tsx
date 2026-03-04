import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  ChevronRight,
  Eye,
  Download,
  TrendingUp,
  Clock,
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

function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalApplications, setTotalApplications] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [limit] = useState(20);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        const status = statusFilter === "all" ? undefined : statusFilter;
        const response = await adminService.getApplications(
          status,
          page,
          limit,
        );
        setApplications(response.data || []);
        setTotalApplications(response.total || 0);
      } catch (error) {
        toast.error("Failed to load applications");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [page, statusFilter, limit]);

  const filteredApplications = applications.filter((app) => {
    const applicantName = `${app.applicant.firstName} ${app.applicant.lastName}`;
    const matchesSearch =
      applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobOrder.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

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

  const statusStats = {
    total: totalApplications,
    pending: applications.filter((a) =>
      ["APPLIED", "SHORTLISTED"].includes(a.status),
    ).length,
    deployed: applications.filter((a) => a.status === "DEPLOYED").length,
    avgScore: "87%", // Would need to calculate from data if available
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
            Applications Management
          </h1>
          <p className="text-muted-foreground">
            Track and manage all job applications
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid grid-cols-4 gap-4">
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">
            Total Applications
          </p>
          <p className="text-2xl font-display font-bold">{statusStats.total}</p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Pending Review</p>
          <p className="text-2xl font-display font-bold text-amber-500">
            {statusStats.pending}
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Deployed</p>
          <p className="text-2xl font-display font-bold text-emerald-500">
            {statusStats.deployed}
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Avg Match Score</p>
          <p className="text-2xl font-display font-bold flex items-center gap-1">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            {statusStats.avgScore}
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
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="APPLIED">Applied</SelectItem>
              <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
              <SelectItem value="INTERVIEWED">Interviewed</SelectItem>
              <SelectItem value="SELECTED">Selected</SelectItem>
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
                  <TableHead>Application ID</TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Employer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.length > 0 ? (
                  filteredApplications.map((app) => (
                    <TableRow key={app.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono font-medium text-sm">
                        {app.id.substring(0, 8)}
                      </TableCell>
                      <TableCell>
                        {app.applicant.firstName} {app.applicant.lastName}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {app.jobOrder.title}
                      </TableCell>
                      <TableCell>{app.jobOrder.employer.companyName}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusBadge(app.status)}
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No applications found
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
            Showing {filteredApplications.length} of {totalApplications}{" "}
            applications
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={page * limit >= totalApplications}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default ApplicationsPage;
