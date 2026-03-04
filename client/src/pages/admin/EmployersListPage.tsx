import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Building2,
  Search,
  Filter,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Download,
  Plus,
  MapPin,
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

function EmployersListPage() {
  const [employers, setEmployers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        setIsLoading(true);
        const response = await adminService.getEmployers();
        setEmployers(response.data || []);
      } catch (error) {
        toast.error("Failed to load employers");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployers();
  }, []);

  const filteredEmployers = employers.filter((employer) => {
    const matchesSearch =
      employer.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employer.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || employer.verificationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const employerStats = {
    total: employers.length,
    verified: employers.filter((e) => e.verificationStatus === "verified")
      .length,
    pending: employers.filter((e) => e.verificationStatus === "pending").length,
    activeJobs: employers.reduce((sum, e) => sum + (e.jobOrderCount || 0), 0),
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { className: string }> = {
      verified: {
        className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      },
      pending: {
        className: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      },
      unverified: {
        className: "bg-red-500/10 text-red-500 border-red-500/20",
      },
    };
    return configs[status] || configs.pending;
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
            Employers Management
          </h1>
          <p className="text-muted-foreground">
            Manage partner employers and verify documents
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="gradient-bg-accent text-accent-foreground">
            <Plus className="w-4 h-4 mr-2" />
            Add Employer
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid grid-cols-4 gap-4">
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Employers</p>
          <p className="text-2xl font-display font-bold">
            {employerStats.total}
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Verified</p>
          <p className="text-2xl font-display font-bold text-emerald-500">
            {employerStats.verified}
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Pending Review</p>
          <p className="text-2xl font-display font-bold text-amber-500">
            {employerStats.pending}
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">
            Active Job Orders
          </p>
          <p className="text-2xl font-display font-bold text-blue-500">
            {employerStats.activeJobs}
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
                placeholder="Search by company or email..."
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
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
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
        ) : filteredEmployers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Building2 className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No employers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployers.map((employer) => (
                  <TableRow key={employer.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {employer.companyName}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {employer.contactPerson || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {employer.country || "-"}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {employer.email}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          getStatusBadge(employer.verificationStatus).className
                        }
                      >
                        {employer.verificationStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(employer.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Link to={`/admin/employers/${employer.id}`}>
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
          Showing {filteredEmployers.length} of {employers.length} employers
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

export default EmployersListPage;
