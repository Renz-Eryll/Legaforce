import { useState } from "react";
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

const mockApplications = [
  {
    id: "APP-2401",
    applicant: "Maria Santos",
    position: "OFW - Nurse",
    employer: "ABC Healthcare",
    status: "deployed",
    matchScore: 95,
    submittedDate: "Jan 20, 2026",
    deployedDate: "Jan 25, 2026",
  },
  {
    id: "APP-2402",
    applicant: "Juan Reyes",
    position: "Construction Worker",
    employer: "XYZ Construction",
    status: "selected",
    matchScore: 87,
    submittedDate: "Jan 18, 2026",
    deployedDate: null,
  },
  {
    id: "APP-2403",
    applicant: "Ana Fernandez",
    position: "Domestic Helper",
    employer: "Global Staffing",
    status: "interviewed",
    matchScore: 78,
    submittedDate: "Jan 15, 2026",
    deployedDate: null,
  },
  {
    id: "APP-2404",
    applicant: "Miguel Torres",
    position: "OFW - Driver",
    employer: "Middle East Transport",
    status: "shortlisted",
    matchScore: 82,
    submittedDate: "Jan 12, 2026",
    deployedDate: null,
  },
  {
    id: "APP-2405",
    applicant: "Rosa Diaz",
    position: "Chef",
    employer: "Gulf Hospitality",
    status: "applied",
    matchScore: 91,
    submittedDate: "Jan 10, 2026",
    deployedDate: null,
  },
];

function ApplicationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredApplications = mockApplications.filter((app) => {
    const matchesSearch =
      app.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const configs = {
      applied: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      shortlisted: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      interviewed: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      selected: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
      processing: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      deployed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    };
    return configs[status as keyof typeof configs] || configs.applied;
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
          <p className="text-2xl font-display font-bold">5,234</p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Pending Review</p>
          <p className="text-2xl font-display font-bold text-amber-500">342</p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Deployed</p>
          <p className="text-2xl font-display font-bold text-emerald-500">
            1,245
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Avg Match Score</p>
          <p className="text-2xl font-display font-bold flex items-center gap-1">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            87%
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="shortlisted">Shortlisted</SelectItem>
              <SelectItem value="interviewed">Interviewed</SelectItem>
              <SelectItem value="selected">Selected</SelectItem>
              <SelectItem value="deployed">Deployed</SelectItem>
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
                <TableHead>Application ID</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Employer</TableHead>
                <TableHead>Match Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((app) => (
                <TableRow key={app.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono font-medium text-sm">
                    {app.id}
                  </TableCell>
                  <TableCell>{app.applicant}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {app.position}
                  </TableCell>
                  <TableCell>{app.employer}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{app.matchScore}%</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusBadge(app.status)}
                    >
                      {app.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {app.submittedDate}
                  </TableCell>
                  <TableCell>
                    <Link to={`/admin/applications/${app.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
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
          Showing {filteredApplications.length} of {mockApplications.length}{" "}
          applications
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

export default ApplicationsPage;
