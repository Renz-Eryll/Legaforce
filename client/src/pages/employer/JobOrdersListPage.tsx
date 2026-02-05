import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  Eye,
  Edit2,
  MapPin,
  DollarSign,
  Users,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    id: "JO-001",
    title: "Registered Nurse (ICU)",
    location: "Riyadh, Saudi Arabia",
    salary: "$2,500/mo",
    positions: 5,
    filled: 2,
    applicants: 45,
    status: "active",
  },
  {
    id: "JO-002",
    title: "Staff Nurse - General Ward",
    location: "Dubai, UAE",
    salary: "$2,200/mo",
    positions: 10,
    filled: 7,
    applicants: 78,
    status: "active",
  },
  {
    id: "JO-003",
    title: "Senior Nurse",
    location: "Doha, Qatar",
    salary: "$2,600/mo",
    positions: 3,
    filled: 3,
    applicants: 23,
    status: "filled",
  },
];

function JobOrdersListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobOrders, setJobOrders] = useState(mockJobOrders);

  const filteredOrders = jobOrders.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
          <p className="text-muted-foreground">Manage your job postings</p>
        </div>
        <Link to="/employer/create-job-order">
          <Button className="gradient-bg-accent text-accent-foreground">
            <Plus className="w-4 h-4 mr-2" />
            New Job Order
          </Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid sm:grid-cols-3 gap-4">
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Active Orders</p>
          <p className="text-2xl font-display font-bold">
            {jobOrders.filter((j) => j.status === "active").length}
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Positions</p>
          <p className="text-2xl font-display font-bold">
            {jobOrders.reduce((sum, j) => sum + j.positions, 0)}
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Applicants</p>
          <p className="text-2xl font-display font-bold text-accent">
            {jobOrders.reduce((sum, j) => sum + j.applicants, 0)}
          </p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeInUp} className="card-premium p-5">
        <div className="flex flex-col gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search job orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="filled">Filled</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Job Orders Grid */}
      <motion.div variants={fadeInUp} className="grid gap-4">
        {filteredOrders.map((job) => (
          <div
            key={job.id}
            className="card-premium p-5 hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">{job.title}</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Link to={`/employer/job-orders/${job.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="sm">
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid sm:grid-cols-4 gap-4 mb-4 pb-4 border-b">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Salary</p>
                <p className="font-semibold text-accent">{job.salary}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Positions</p>
                <p className="font-medium">{job.positions}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Applicants</p>
                <p className="font-medium">{job.applicants}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Status</p>
                <Badge
                  variant="secondary"
                  className={
                    job.status === "active"
                      ? "bg-emerald-50 text-emerald-700"
                      : ""
                  }
                >
                  {job.status}
                </Badge>
              </div>
            </div>

            {/* Fill Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Positions Filled</span>
                <span className="font-semibold">
                  {job.filled}/{job.positions}
                </span>
              </div>
              <Progress
                value={(job.filled / job.positions) * 100}
                className="h-2"
              />
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default JobOrdersListPage;
