import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Search,
  Filter,
  ChevronRight,
  MessageCircle,
  Clock,
  Zap,
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
    applicant: "Maria Santos",
    category: "Employer Issue",
    priority: "high",
    status: "escalated",
    description: "Delayed salary payment",
    filedDate: "Jan 24, 2026",
    escalationLevel: 2,
  },
  {
    id: "COMP-002",
    applicant: "Anonymous",
    category: "Abuse",
    priority: "high",
    status: "escalated",
    description: "Workplace harassment",
    filedDate: "Jan 23, 2026",
    escalationLevel: 3,
  },
  {
    id: "COMP-003",
    applicant: "Juan Reyes",
    category: "Contract Violation",
    priority: "medium",
    status: "under-review",
    description: "Terms not honored",
    filedDate: "Jan 22, 2026",
    escalationLevel: 1,
  },
  {
    id: "COMP-004",
    applicant: "Ana Fernandez",
    category: "Deployment Delay",
    priority: "medium",
    status: "under-review",
    description: "Medical exam pending",
    filedDate: "Jan 20, 2026",
    escalationLevel: 1,
  },
  {
    id: "COMP-005",
    applicant: "Miguel Torres",
    category: "Agency Issue",
    priority: "low",
    status: "resolved",
    description: "Document processing error",
    filedDate: "Jan 18, 2026",
    escalationLevel: 1,
  },
];

function ComplaintsListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredComplaints = mockComplaints.filter((complaint) => {
    const matchesSearch =
      complaint.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || complaint.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "bg-red-500/10 text-red-500 border-red-500/20",
      medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      submitted: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      "under-review": "bg-amber-500/10 text-amber-500 border-amber-500/20",
      escalated: "bg-red-500/10 text-red-500 border-red-500/20",
      resolved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    };
    return colors[status as keyof typeof colors] || colors.submitted;
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
          <p className="text-2xl font-display font-bold">245</p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Pending</p>
          <p className="text-2xl font-display font-bold text-amber-500">23</p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">High Priority</p>
          <p className="text-2xl font-display font-bold text-red-500">8</p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Resolution Rate</p>
          <p className="text-2xl font-display font-bold text-emerald-500">
            92%
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
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="under-review">Under Review</SelectItem>
              <SelectItem value="escalated">Escalated</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div variants={fadeInUp} className="card-premium overflow-hidden">
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
                <TableHead>Escalation</TableHead>
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
                    {complaint.applicant === "Anonymous" ? (
                      <span className="text-muted-foreground italic">
                        {complaint.applicant}
                      </span>
                    ) : (
                      complaint.applicant
                    )}
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
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      <span className="text-sm">
                        Level {complaint.escalationLevel}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {complaint.filedDate}
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
      </motion.div>

      {/* Pagination */}
      <motion.div
        variants={fadeInUp}
        className="flex items-center justify-between"
      >
        <p className="text-sm text-muted-foreground">
          Showing {filteredComplaints.length} of {mockComplaints.length}{" "}
          complaints
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
