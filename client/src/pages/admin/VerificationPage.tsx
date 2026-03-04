import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  FileCheck,
  ChevronRight,
  Search,
  Filter,
  Download,
  Zap,
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

function VerificationPage() {
  const [verifications, setVerifications] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVerifications = async () => {
      try {
        setIsLoading(true);
        const response = await adminService.getVerificationQueue();
        setVerifications(response.data || []);
      } catch (error) {
        toast.error("Failed to load verification queue");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVerifications();
  }, []);
  const filteredVerifications = verifications.filter((ver) => {
    const matchesSearch =
      (ver.applicantName || ver.employerName)
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (ver.documentType || ver.docType)
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ver.status === statusFilter;
    const matchesType = typeFilter === "all" || ver.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const verificationStats = {
    pending: verifications.filter((v) => v.status === "pending").length,
    highPriority: verifications.filter((v) => v.priority === "high").length,
    approved: verifications.filter((v) => v.status === "approved").length,
    avgTime: "2.3 hours",
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, string> = {
      pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      approved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      rejected: "bg-red-500/10 text-red-500 border-red-500/20",
    };
    return configs[status] || configs.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-amber-500" />;
      case "rejected":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
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
            Document Verification
          </h1>
          <p className="text-muted-foreground">
            Review and approve applicant & employer documents
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid grid-cols-4 gap-4">
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Pending</p>
          <p className="text-2xl font-display font-bold">
            {verificationStats.pending}
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">High Priority</p>
          <p className="text-2xl font-display font-bold text-red-500">
            {verificationStats.highPriority}
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Approved</p>
          <p className="text-2xl font-display font-bold text-emerald-500">
            {verificationStats.approved}
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">
            Avg. Time to Review
          </p>
          <p className="text-2xl font-display font-bold">
            {verificationStats.avgTime}
          </p>
        </div>
      </motion.div>

      {/* Filters & Search */}
      <motion.div variants={fadeInUp} className="card-premium p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or document type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-40">
              <FileCheck className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="applicant">Applicants</SelectItem>
              <SelectItem value="employer">Employers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={fadeInUp} className="card-premium p-5">
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline">
            <Zap className="w-4 h-4 mr-1" />
            Approve All (High Priority)
          </Button>
          <Button size="sm" variant="outline">
            <Clock className="w-4 h-4 mr-1" />
            Request More Info
          </Button>
          <Button size="sm" variant="outline" className="text-red-600">
            <AlertCircle className="w-4 h-4 mr-1" />
            Reject All Invalid
          </Button>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div variants={fadeInUp} className="card-premium overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredVerifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FileCheck className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No verifications found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Document</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVerifications.map((ver) => (
                  <TableRow key={ver.id} className="hover:bg-muted/50">
                    <TableCell>{getStatusIcon(ver.status)}</TableCell>
                    <TableCell className="font-medium">
                      {ver.applicantName || ver.employerName}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {ver.type === "applicant"
                          ? "👤 Applicant"
                          : "🏢 Employer"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {ver.documentType || ver.docType}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusBadge(ver.status)}
                      >
                        {ver.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(ver.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {ver.expiryDate
                        ? new Date(ver.expiryDate).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Link to={`/admin/verification/${ver.id}`}>
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
          Showing {filteredVerifications.length} of {verifications.length} items
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

export default VerificationPage;
