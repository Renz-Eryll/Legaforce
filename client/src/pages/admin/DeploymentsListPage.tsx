import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Globe,
  Search,
  Filter,
  ChevronRight,
  MapPin,
  Calendar,
  CheckCircle,
  AlertCircle,
  Plane,
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

const mockDeployments = [
  {
    id: "DEP-2601",
    applicant: "Maria Santos",
    position: "OFW - Nurse",
    destination: "Saudi Arabia",
    employer: "Gulf Healthcare",
    deploymentDate: "Jan 25, 2026",
    arrivalDate: "Jan 28, 2026",
    flightDate: "Jan 25, 2026",
    status: "deployed",
    duration: "2 years",
    salary: "$1,500 USD",
  },
  {
    id: "DEP-2602",
    applicant: "Juan Reyes",
    position: "Construction Worker",
    destination: "UAE",
    employer: "Middle East Construction",
    deploymentDate: "Feb 01, 2026",
    arrivalDate: null,
    flightDate: "Feb 01, 2026",
    status: "in-transit",
    duration: "3 years",
    salary: "$900 USD",
  },
  {
    id: "DEP-2603",
    applicant: "Ana Fernandez",
    position: "Domestic Helper",
    destination: "Kuwait",
    employer: "Gulf Family Services",
    deploymentDate: "Feb 10, 2026",
    arrivalDate: null,
    flightDate: "Feb 10, 2026",
    status: "processing",
    duration: "2 years",
    salary: "$400 USD",
  },
  {
    id: "DEP-2604",
    applicant: "Miguel Torres",
    position: "OFW - Driver",
    destination: "Qatar",
    employer: "Doha Transport",
    deploymentDate: "Mar 15, 2026",
    arrivalDate: null,
    flightDate: "Mar 15, 2026",
    status: "scheduled",
    duration: "3 years",
    salary: "$1,200 USD",
  },
  {
    id: "DEP-2605",
    applicant: "Rosa Diaz",
    position: "Chef",
    destination: "UAE",
    employer: "Emirates Hospitality",
    deploymentDate: "Jan 10, 2026",
    arrivalDate: "Jan 13, 2026",
    flightDate: "Jan 10, 2026",
    status: "deployed",
    duration: "2 years",
    salary: "$1,800 USD",
  },
];

function DeploymentsListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredDeployments = mockDeployments.filter((deployment) => {
    const matchesSearch =
      deployment.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deployment.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || deployment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const configs = {
      scheduled: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      processing: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      "in-transit": "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
      deployed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    };
    return configs[status as keyof typeof configs] || configs.scheduled;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "deployed":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "in-transit":
        return <Plane className="w-4 h-4 text-cyan-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
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
            Deployments Management ✈️
          </h1>
          <p className="text-muted-foreground">
            Track overseas worker deployments
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid grid-cols-4 gap-4">
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Deployed</p>
          <p className="text-2xl font-display font-bold">1,245</p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">This Month</p>
          <p className="text-2xl font-display font-bold text-blue-500">45</p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">In Transit</p>
          <p className="text-2xl font-display font-bold text-cyan-500">23</p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
          <p className="text-2xl font-display font-bold text-emerald-500">
            98%
          </p>
        </div>
      </motion.div>

      {/* Top Destinations */}
      <motion.div variants={fadeInUp} className="card-premium p-5">
        <h2 className="text-lg font-semibold mb-4">
          Top Deployment Destinations
        </h2>
        <div className="grid sm:grid-cols-5 gap-4">
          {[
            { country: "Saudi Arabia", count: 345, icon: "🇸🇦" },
            { country: "UAE", count: 298, icon: "🇦🇪" },
            { country: "Qatar", count: 189, icon: "🇶🇦" },
            { country: "Kuwait", count: 156, icon: "🇰🇼" },
            { country: "Others", count: 257, icon: "🌍" },
          ].map((dest) => (
            <div
              key={dest.country}
              className="p-4 rounded-lg bg-muted/50 text-center"
            >
              <span className="text-2xl mb-2 block">{dest.icon}</span>
              <p className="text-sm font-medium">{dest.country}</p>
              <p className="text-2xl font-bold text-accent mt-1">
                {dest.count}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Filters & Search */}
      <motion.div variants={fadeInUp} className="card-premium p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by applicant or destination..."
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
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="in-transit">In Transit</SelectItem>
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
                <TableHead>ID</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Flight Date</TableHead>
                <TableHead>Arrival Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeployments.map((deployment) => (
                <TableRow key={deployment.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono font-medium text-sm">
                    {deployment.id}
                  </TableCell>
                  <TableCell>{deployment.applicant}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {deployment.position}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {deployment.destination}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Plane className="w-4 h-4" />
                      {deployment.flightDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    {deployment.arrivalDate ? (
                      <div className="flex items-center gap-1 text-sm">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        {deployment.arrivalDate}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">
                        Pending
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusBadge(deployment.status)}
                    >
                      {deployment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {deployment.duration}
                  </TableCell>
                  <TableCell>
                    <Link to={`/admin/deployments/${deployment.id}`}>
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
          Showing {filteredDeployments.length} of {mockDeployments.length}{" "}
          deployments
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

export default DeploymentsListPage;
