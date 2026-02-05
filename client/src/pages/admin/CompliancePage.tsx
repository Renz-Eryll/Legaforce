import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FileCheck,
  Search,
  Filter,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
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

const mockComplianceData = [
  {
    id: "DEP-001",
    applicant: "Maria Santos",
    position: "OFW - Nurse",
    medical: { status: "approved", expiryDate: "Jan 25, 2027" },
    visa: { status: "approved", expiryDate: "Feb 10, 2027" },
    oec: { status: "approved", number: "OEC-2026-001" },
    flightDate: "Feb 01, 2026",
    overallStatus: "ready",
  },
  {
    id: "DEP-002",
    applicant: "Juan Reyes",
    position: "Construction Worker",
    medical: { status: "pending", expiryDate: null },
    visa: { status: "in-progress", expiryDate: null },
    oec: { status: "pending", number: null },
    flightDate: "Feb 15, 2026",
    overallStatus: "in-progress",
  },
  {
    id: "DEP-003",
    applicant: "Ana Fernandez",
    position: "Domestic Helper",
    medical: { status: "approved", expiryDate: "Mar 10, 2027" },
    visa: { status: "pending", expiryDate: null },
    oec: { status: "approved", number: "OEC-2026-002" },
    flightDate: "Mar 01, 2026",
    overallStatus: "in-progress",
  },
  {
    id: "DEP-004",
    applicant: "Miguel Torres",
    position: "OFW - Driver",
    medical: { status: "rejected", expiryDate: null },
    visa: { status: "pending", expiryDate: null },
    oec: { status: "pending", number: null },
    flightDate: "Feb 20, 2026",
    overallStatus: "delayed",
  },
];

function CompliancePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredCompliance = mockComplianceData.filter((item) => {
    const matchesSearch =
      item.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.overallStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getComplianceStatusBadge = (status: string) => {
    const configs = {
      approved:
        "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 flex items-center gap-1",
      pending:
        "bg-amber-500/10 text-amber-500 border-amber-500/20 flex items-center gap-1",
      "in-progress":
        "bg-blue-500/10 text-blue-500 border-blue-500/20 flex items-center gap-1",
      rejected:
        "bg-red-500/10 text-red-500 border-red-500/20 flex items-center gap-1",
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const getOverallStatusColor = (status: string) => {
    const colors = {
      ready: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      "in-progress": "bg-blue-500/10 text-blue-500 border-blue-500/20",
      delayed: "bg-red-500/10 text-red-500 border-red-500/20",
      completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    };
    return colors[status as keyof typeof colors] || colors["in-progress"];
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
            Compliance Management 📋
          </h1>
          <p className="text-muted-foreground">
            Track deployment compliance and documents
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Compliance Report
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid grid-cols-4 gap-4">
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">In Deployment</p>
          <p className="text-2xl font-display font-bold">1,245</p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">
            Documents Pending
          </p>
          <p className="text-2xl font-display font-bold text-amber-500">34</p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Compliance Rate</p>
          <p className="text-2xl font-display font-bold text-emerald-500">
            98.5%
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Expiring Soon</p>
          <p className="text-2xl font-display font-bold text-red-500">12</p>
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
              <SelectItem value="ready">Ready to Deploy</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="delayed">Delayed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Compliance Items */}
      <motion.div variants={fadeInUp} className="space-y-4">
        {filteredCompliance.map((item) => (
          <div key={item.id} className="card-premium p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 pb-4 border-b">
              <div>
                <h3 className="text-lg font-semibold">{item.applicant}</h3>
                <p className="text-sm text-muted-foreground">{item.position}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className={getOverallStatusColor(item.overallStatus)}
                >
                  {item.overallStatus.replace("-", " ")}
                </Badge>
                <Link to={`/admin/compliance/${item.id}`}>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Compliance Documents Grid */}
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              {/* Medical */}
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Medical Exam</span>
                  {item.medical.status === "approved" ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  ) : item.medical.status === "pending" ? (
                    <Clock className="w-4 h-4 text-amber-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <Badge
                  variant="outline"
                  className={getComplianceStatusBadge(item.medical.status)}
                >
                  {item.medical.status}
                </Badge>
                {item.medical.expiryDate && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Expires: {item.medical.expiryDate}
                  </p>
                )}
              </div>

              {/* Visa */}
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Visa</span>
                  {item.visa.status === "approved" ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  ) : item.visa.status === "in-progress" ? (
                    <Clock className="w-4 h-4 text-blue-500" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-500" />
                  )}
                </div>
                <Badge
                  variant="outline"
                  className={getComplianceStatusBadge(item.visa.status)}
                >
                  {item.visa.status}
                </Badge>
                {item.visa.expiryDate && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Expires: {item.visa.expiryDate}
                  </p>
                )}
              </div>

              {/* OEC */}
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">OEC Clearance</span>
                  {item.oec.status === "approved" ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-500" />
                  )}
                </div>
                <Badge
                  variant="outline"
                  className={getComplianceStatusBadge(item.oec.status)}
                >
                  {item.oec.status}
                </Badge>
                {item.oec.number && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {item.oec.number}
                  </p>
                )}
              </div>
            </div>

            {/* Flight Info */}
            <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
              <p className="text-sm">
                <span className="font-medium">Flight Date:</span>{" "}
                <span className="text-accent">{item.flightDate}</span>
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* No results */}
      {filteredCompliance.length === 0 && (
        <motion.div variants={fadeInUp} className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">No compliance records found</p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default CompliancePage;
