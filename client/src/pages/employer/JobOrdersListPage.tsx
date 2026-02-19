import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search,
  Briefcase,
  DollarSign,
  MapPin,
  Users,
  Plus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Calendar,
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

function JobOrdersListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobOrders, setJobOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchJobOrders = async () => {
    try {
      setIsLoading(true);
      const status = statusFilter !== "all" ? statusFilter : undefined;
      const data = await employerService.getJobOrders(status);
      setJobOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch job orders:", error);
      toast.error("Failed to load job orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobOrders();
  }, [statusFilter]);

  const handleDeleteJobOrder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job order?")) return;
    try {
      await employerService.deleteJobOrder(id);
      toast.success("Job order deleted successfully");
      fetchJobOrders();
    } catch (error) {
      toast.error("Failed to delete job order");
    }
  };

  const filteredJobOrders = jobOrders.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const activeCount = jobOrders.filter((j) => j.status === "ACTIVE").length;
  const filledCount = jobOrders.filter((j) => j.status === "FILLED").length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-accent mx-auto mb-3" />
          <p className="text-muted-foreground">Loading job orders...</p>
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
      <motion.div
        variants={fadeInUp}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-display font-bold mb-1">Job Orders</h1>
          <p className="text-muted-foreground">
            Post jobs, set requirements, track applicants from one place
          </p>
        </div>
        <Link to="/employer/create-job-order">
          <Button className="gradient-bg-accent text-accent-foreground">
            <Plus className="w-4 h-4 mr-2" />
            New Job Order
          </Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-4">
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Total</p>
          <p className="text-2xl font-display font-bold">{jobOrders.length}</p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Active</p>
          <p className="text-2xl font-display font-bold text-emerald-600">
            {activeCount}
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Filled</p>
          <p className="text-2xl font-display font-bold text-blue-600">
            {filledCount}
          </p>
        </div>
      </motion.div>

      {/* Search & Filter */}
      <motion.div
        variants={fadeInUp}
        className="card-premium p-5 flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="FILLED">Filled</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
            <SelectItem value="EXPIRED">Expired</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Job Orders Table */}
      <motion.div variants={fadeInUp} className="card-premium overflow-hidden">
        {filteredJobOrders.length === 0 ? (
          <div className="p-12 text-center">
            <Briefcase className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
            <h3 className="font-semibold mb-1">No job orders found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchTerm
                ? "Try adjusting your search"
                : "Start by creating your first job order"}
            </p>
            <Link to="/employer/create-job-order">
              <Button className="gradient-bg-accent text-accent-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Create Job Order
              </Button>
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/50">
                <TableHead>Job Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Positions</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobOrders.map((job) => {
                const st = statusConfig[job.status] || statusConfig["ACTIVE"];
                return (
                  <TableRow
                    key={job.id}
                    className="border-b border-border/50 hover:bg-muted/30"
                  >
                    <TableCell className="font-medium">
                      <Link
                        to={`/employer/job-orders/${job.id}`}
                        className="hover:text-accent transition-colors"
                      >
                        {job.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {job.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <DollarSign className="w-3 h-3" />
                        {job.salary
                          ? `${Number(job.salary).toLocaleString()}/mo`
                          : "TBD"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Users className="w-3 h-3" />
                        {job.positions}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={st.color}>
                        {st.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Link to={`/employer/job-orders/${job.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteJobOrder(job.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
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

export default JobOrdersListPage;
