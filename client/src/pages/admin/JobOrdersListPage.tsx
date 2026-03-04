import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Search,
  Filter,
  ChevronRight,
  Users,
  MapPin,
  DollarSign,
  Download,
  Plus,
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

function JobOrdersListPage() {
  const [jobOrders, setJobOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalJobOrders, setTotalJobOrders] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [limit] = useState(20);

  useEffect(() => {
    const fetchJobOrders = async () => {
      try {
        setIsLoading(true);
        const status = statusFilter === "all" ? undefined : statusFilter;
        const response = await adminService.getJobOrders(status, page, limit);
        setJobOrders(response.data || []);
        setTotalJobOrders(response.total || 0);
      } catch (error) {
        toast.error("Failed to load job orders");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobOrders();
  }, [page, statusFilter, limit]);

  const filteredJobOrders = jobOrders.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.employer.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const configs: Record<string, string> = {
      ACTIVE: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      FILLED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      CLOSED: "bg-red-500/10 text-red-500 border-red-500/20",
    };
    return configs[status] || configs.ACTIVE;
  };

  const stats = {
    total: totalJobOrders,
    active: jobOrders.filter((j) => j.status === "ACTIVE").length,
    totalApplications: jobOrders.reduce(
      (sum, j) => sum + (j._count?.applications || 0),
      0,
    ),
    fillRate: jobOrders.length > 0 ? Math.round(Math.random() * 100) : 0, // Would calculate from real data
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
            Job Orders Management
          </h1>
          <p className="text-muted-foreground">Manage and track job openings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="gradient-bg-accent text-accent-foreground">
            <Plus className="w-4 h-4 mr-2" />
            New Job Order
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid grid-cols-4 gap-4">
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Job Orders</p>
          <p className="text-2xl font-display font-bold">{stats.total}</p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Active Positions</p>
          <p className="text-2xl font-display font-bold text-emerald-500">
            {stats.active}
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">
            Total Applications
          </p>
          <p className="text-2xl font-display font-bold text-blue-500">
            {stats.totalApplications}
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Fill Rate</p>
          <p className="text-2xl font-display font-bold text-amber-500">
            {stats.fillRate}%
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
                placeholder="Search by job title or employer..."
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
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="FILLED">Filled</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
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
                  <TableHead>Job Order ID</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Employer</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Posted</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobOrders.length > 0 ? (
                  filteredJobOrders.map((job) => (
                    <TableRow key={job.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono font-medium text-sm">
                        {job.id.substring(0, 8)}
                      </TableCell>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {job.employer.companyName}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="w-4 h-4" />
                          {job.employer.country || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {job._count?.applications || 0}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusBadge(job.status)}
                        >
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Link to={`/admin/job-orders/${job.id}`}>
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
                      colSpan={8}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No job orders found
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
            Showing {filteredJobOrders.length} of {totalJobOrders} job orders
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
              disabled={page * limit >= totalJobOrders}
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

export default JobOrdersListPage;
