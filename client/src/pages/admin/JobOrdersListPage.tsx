import { useState } from "react";
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

const mockJobOrders = [
  {
    id: "JO-2601",
    title: "Nurse (ICU)",
    employer: "ABC Healthcare",
    location: "Saudi Arabia",
    positions: 10,
    applications: 45,
    filled: 8,
    salary: "$1,500 USD",
    status: "active",
    postedDate: "Jan 15, 2026",
    deadline: "Feb 15, 2026",
  },
  {
    id: "JO-2602",
    title: "Construction Foreman",
    employer: "XYZ Construction",
    location: "UAE",
    positions: 5,
    applications: 23,
    filled: 3,
    salary: "$1,200 USD",
    status: "active",
    postedDate: "Jan 18, 2026",
    deadline: "Feb 18, 2026",
  },
  {
    id: "JO-2603",
    title: "Domestic Helper",
    employer: "Global Staffing",
    location: "Kuwait",
    positions: 20,
    applications: 128,
    filled: 15,
    salary: "$400 USD",
    status: "active",
    postedDate: "Jan 10, 2026",
    deadline: "Feb 10, 2026",
  },
  {
    id: "JO-2604",
    title: "Chef",
    employer: "Gulf Hospitality",
    location: "Qatar",
    positions: 3,
    applications: 12,
    filled: 3,
    salary: "$1,800 USD",
    status: "filled",
    postedDate: "Dec 28, 2025",
    deadline: "Jan 28, 2026",
  },
  {
    id: "JO-2605",
    title: "Security Officer",
    employer: "Middle East Transport",
    location: "Saudi Arabia",
    positions: 7,
    applications: 34,
    filled: 4,
    salary: "$900 USD",
    status: "active",
    postedDate: "Jan 20, 2026",
    deadline: "Feb 20, 2026",
  },
];

function JobOrdersListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredJobOrders = mockJobOrders.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.employer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const configs = {
      active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      filled: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      expired: "bg-red-500/10 text-red-500 border-red-500/20",
    };
    return configs[status as keyof typeof configs] || configs.active;
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
          <p className="text-2xl font-display font-bold">189</p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Active Positions</p>
          <p className="text-2xl font-display font-bold text-emerald-500">
            145
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">
            Total Applications
          </p>
          <p className="text-2xl font-display font-bold text-blue-500">587</p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Fill Rate</p>
          <p className="text-2xl font-display font-bold text-amber-500">62%</p>
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="filled">Filled</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
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
                <TableHead>Job Order ID</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Employer</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Positions</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Filled</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobOrders.map((job) => (
                <TableRow key={job.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono font-medium text-sm">
                    {job.id}
                  </TableCell>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {job.employer}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{job.positions}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {job.applications}
                  </TableCell>
                  <TableCell className="text-sm">
                    {job.filled}/{job.positions}
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {job.salary}
                    </div>
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
                    {job.deadline}
                  </TableCell>
                  <TableCell>
                    <Link to={`/admin/job-orders/${job.id}`}>
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
          Showing {filteredJobOrders.length} of {mockJobOrders.length} job
          orders
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

export default JobOrdersListPage;
