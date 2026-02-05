import { useState } from "react";
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

const mockEmployers = [
  {
    id: "EMP-001",
    company: "ABC Healthcare",
    contact: "John Smith",
    country: "Saudi Arabia",
    email: "contact@abchealthcare.com",
    phone: "+966 11 234 5678",
    jobOrders: 12,
    hires: 245,
    trustScore: 95,
    status: "verified",
    joinDate: "Jan 15, 2025",
  },
  {
    id: "EMP-002",
    company: "XYZ Construction",
    contact: "Ahmed Ali",
    country: "UAE",
    email: "info@xyzcons.com",
    phone: "+971 4 567 8901",
    jobOrders: 8,
    hires: 156,
    trustScore: 88,
    status: "verified",
    joinDate: "Feb 20, 2025",
  },
  {
    id: "EMP-003",
    company: "Global Staffing",
    contact: "Maria Garcia",
    country: "Kuwait",
    email: "hr@globalstaff.com",
    phone: "+965 9876 5432",
    jobOrders: 5,
    hires: 89,
    trustScore: 82,
    status: "pending",
    joinDate: "Mar 10, 2025",
  },
  {
    id: "EMP-004",
    company: "Gulf Hospitality",
    contact: "Fatima Al-Rashid",
    country: "Qatar",
    email: "recruitment@gulftv.com",
    phone: "+974 4456 7890",
    jobOrders: 3,
    hires: 45,
    trustScore: 75,
    status: "unverified",
    joinDate: "Dec 01, 2025",
  },
];

function EmployersListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredEmployers = mockEmployers.filter((employer) => {
    const matchesSearch =
      employer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || employer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const configs = {
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
    return configs[status as keyof typeof configs] || configs.pending;
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
          <p className="text-2xl font-display font-bold">523</p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Verified</p>
          <p className="text-2xl font-display font-bold text-emerald-500">
            456
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Pending Review</p>
          <p className="text-2xl font-display font-bold text-amber-500">45</p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">
            Active Job Orders
          </p>
          <p className="text-2xl font-display font-bold text-blue-500">189</p>
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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Job Orders</TableHead>
                <TableHead>Total Hires</TableHead>
                <TableHead>Trust Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployers.map((employer) => (
                <TableRow key={employer.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {employer.company}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {employer.contact}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {employer.country}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{employer.jobOrders}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {employer.hires}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-sm">{employer.trustScore}</span>
                      {employer.trustScore >= 90 && (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusBadge(employer.status).className}
                    >
                      {employer.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {employer.joinDate}
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
      </motion.div>

      {/* Pagination */}
      <motion.div
        variants={fadeInUp}
        className="flex items-center justify-between"
      >
        <p className="text-sm text-muted-foreground">
          Showing {filteredEmployers.length} of {mockEmployers.length} employers
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
