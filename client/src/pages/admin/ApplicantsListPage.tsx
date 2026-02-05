import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users,
  Search,
  Filter,
  ChevronRight,
  Star,
  Trophy,
  AlertCircle,
  Download,
  Plus,
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

const mockApplicants = [
  {
    id: "APP001",
    name: "Maria Santos",
    email: "maria@email.com",
    phone: "+63 917 123 4567",
    applications: 5,
    trustScore: 92,
    status: "verified",
    location: "Manila, PH",
    joinDate: "Jan 15, 2026",
  },
  {
    id: "APP002",
    name: "Juan Reyes",
    email: "juan@email.com",
    phone: "+63 917 234 5678",
    applications: 3,
    trustScore: 85,
    status: "verified",
    location: "Cebu, PH",
    joinDate: "Jan 10, 2026",
  },
  {
    id: "APP003",
    name: "Ana Fernandez",
    email: "ana@email.com",
    phone: "+63 917 345 6789",
    applications: 8,
    trustScore: 78,
    status: "pending",
    location: "Davao, PH",
    joinDate: "Jan 05, 2026",
  },
  {
    id: "APP004",
    name: "Miguel Torres",
    email: "miguel@email.com",
    phone: "+63 917 456 7890",
    applications: 2,
    trustScore: 65,
    status: "unverified",
    location: "Quezon City, PH",
    joinDate: "Dec 28, 2025",
  },
  {
    id: "APP005",
    name: "Rosa Diaz",
    email: "rosa@email.com",
    phone: "+63 917 567 8901",
    applications: 12,
    trustScore: 95,
    status: "verified",
    location: "Makati, PH",
    joinDate: "Dec 20, 2025",
  },
];

function ApplicantsListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredApplicants = mockApplicants.filter((applicant) => {
    const matchesSearch =
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || applicant.status === statusFilter;
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
            Applicants Management
          </h1>
          <p className="text-muted-foreground">
            Manage and monitor applicant profiles
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="gradient-bg-accent text-accent-foreground">
            <Plus className="w-4 h-4 mr-2" />
            New Applicant
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-4">
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Applicants</p>
          <p className="text-2xl font-display font-bold">12,458</p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Verified</p>
          <p className="text-2xl font-display font-bold text-emerald-500">
            10,234
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Pending Review</p>
          <p className="text-2xl font-display font-bold text-amber-500">342</p>
        </div>
      </motion.div>

      {/* Filters & Search */}
      <motion.div variants={fadeInUp} className="card-premium p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
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
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Trust Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplicants.map((applicant) => (
                <TableRow key={applicant.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {applicant.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {applicant.email}
                  </TableCell>
                  <TableCell>{applicant.location}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{applicant.applications}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      <span>{applicant.trustScore}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusBadge(applicant.status).className}
                    >
                      {applicant.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {applicant.joinDate}
                  </TableCell>
                  <TableCell>
                    <Link to={`/admin/user/${applicant.id}`}>
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
          Showing {filteredApplicants.length} of {mockApplicants.length}{" "}
          applicants
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

export default ApplicantsListPage;
