import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Search,
  Filter,
  ChevronRight,
  MessageCircle,
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

function ComplaintsListPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setIsLoading(true);
        const status = statusFilter === "all" ? undefined : statusFilter;
        const response = await adminService.getComplaints(status);
        setComplaints(response.data || []);
      } catch (error) {
        toast.error("Failed to load complaints");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, [statusFilter]);

  const filteredComplaints = complaints.filter((complaint) => {
    const applicantName = `${complaint.applicant?.firstName} ${complaint.applicant?.lastName}`;
    const matchesSearch =
      applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.category?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: "bg-red-500/10 text-red-500 border-red-500/20",
      medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    };
    return colors[priority] || colors.medium;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      SUBMITTED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      OPEN: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      ESCALATED: "bg-red-500/10 text-red-500 border-red-500/20",
      RESOLVED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    };
    return colors[status] || colors.SUBMITTED;
  };

  const complaintStats = {
    total: complaints.length,
    open: complaints.filter((c) => c.status === "OPEN").length,
    escalated: complaints.filter((c) => c.status === "ESCALATED").length,
    resolved: complaints.filter((c) => c.status === "RESOLVED").length,
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
            Complaints Management 🛡️
          </h1>
          <p className="text-muted-foreground">
            Handle and resolve worker complaints
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid grid-cols-4 gap-4">
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Complaints</p>
          <p className="text-2xl font-display font-bold">
            {complaintStats.total}
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Open</p>
          <p className="text-2xl font-display font-bold text-amber-500">
            {complaintStats.open}
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Escalated</p>
          <p className="text-2xl font-display font-bold text-red-500">
            {complaintStats.escalated}
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Resolved</p>
          <p className="text-2xl font-display font-bold text-emerald-500">
            {complaintStats.resolved}
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
                placeholder="Search complaints..."
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
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="ESCALATED">Escalated</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div variants={fadeInUp} className="card-premium overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <MessageCircle className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No complaints found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Filed Date</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComplaints.map((complaint) => (
                  <TableRow key={complaint.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono font-medium text-sm">
                      {complaint.id}
                    </TableCell>
                    <TableCell>
                      {complaint.applicant?.firstName &&
                      complaint.applicant?.lastName
                        ? `${complaint.applicant.firstName} ${complaint.applicant.lastName}`
                        : "Anonymous"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {complaint.category}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-sm">
                      {complaint.description}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getPriorityColor(complaint.priority)}
                      >
                        {complaint.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusColor(complaint.status)}
                      >
                        {complaint.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Link to={`/admin/complaints/${complaint.id}`}>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      <motion.div
        variants={fadeInUp}
        className="flex items-center justify-between"
      >
        <p className="text-sm text-muted-foreground">
          Showing {filteredComplaints.length} of {complaints.length} complaints
        </p>
        <div className="flex gap-2">
          <Button variant="outline" disabled>
            Previous
          </Button>
          <Button variant="outline">Next</Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ComplaintsListPage;
