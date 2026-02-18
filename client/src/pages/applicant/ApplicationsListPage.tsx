import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { applicantService } from "@/services/applicantService";
import {
  Briefcase,
  Search,
  Filter,
  ChevronRight,
  MapPin,
  Building2,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
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

// Real-time pipeline: Applied → Shortlisted → Interview → Selected → Processing → Deployed
const mockApplications = [
  {
    id: "APP-001",
    position: "Registered Nurse (ICU)",
    employer: "King Faisal Hospital",
    location: "Riyadh, Saudi Arabia",
    salary: "$2,500/mo",
    status: "interviewed",
    matchScore: 92,
    appliedDate: "Jan 15, 2026",
    interviewDate: "Jan 28, 2026",
  },
  {
    id: "APP-002",
    position: "Staff Nurse - General Ward",
    employer: "Dubai Health Authority",
    location: "Dubai, UAE",
    salary: "$2,200/mo",
    status: "shortlisted",
    matchScore: 88,
    appliedDate: "Jan 18, 2026",
    interviewDate: null,
  },
  {
    id: "APP-003",
    position: "Senior Nurse",
    employer: "Hamad Medical Corporation",
    location: "Doha, Qatar",
    salary: "$2,600/mo",
    status: "applied",
    matchScore: 85,
    appliedDate: "Jan 22, 2026",
    interviewDate: null,
  },
  {
    id: "APP-004",
    position: "OR Nurse",
    employer: "Kuwait Hospital",
    location: "Kuwait City, Kuwait",
    salary: "$2,400/mo",
    status: "processing",
    matchScore: 90,
    appliedDate: "Jan 10, 2026",
    interviewDate: "Jan 25, 2026",
  },
  {
    id: "APP-005",
    position: "Caregiver",
    employer: "Gulf Family Services",
    location: "Abu Dhabi, UAE",
    salary: "$600/mo",
    status: "deployed",
    matchScore: 88,
    appliedDate: "Dec 01, 2025",
    interviewDate: "Dec 15, 2025",
  },
  {
    id: "APP-006",
    position: "Domestic Helper",
    employer: "Gulf Home Services",
    location: "Abu Dhabi, UAE",
    salary: "$500/mo",
    status: "rejected",
    matchScore: 65,
    appliedDate: "Jan 05, 2026",
    interviewDate: null,
  },
];

type AppRow = {
  id: string;
  position: string;
  employer: string;
  location: string;
  salary: string | number;
  status: string;
  matchScore: number;
  appliedDate: string;
  interviewDate: string | null;
};

function mapApiToRow(app: any): AppRow {
  const job = app.jobOrder || {};
  const created = app.createdAt ? new Date(app.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
  const interviewed = app.interviewedAt ? new Date(app.interviewedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null;
  const salary = job.salary != null ? (typeof job.salary === "number" ? `$${job.salary}/mo` : job.salary) : "—";
  return {
    id: app.id,
    position: job.title || app.position || "—",
    employer: job.employer || app.employer || "—",
    location: job.location || app.location || "—",
    salary,
    status: (app.status || "").toLowerCase(),
    matchScore: app.aiMatchScore ?? app.matchScore ?? 0,
    appliedDate: created,
    interviewDate: interviewed,
  };
}

function ApplicationsListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [applications, setApplications] = useState<AppRow[]>(mockApplications);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    applicantService
      .getApplications()
      .then((data: any) => {
        if (cancelled) return;
        const list = Array.isArray(data) ? data : (data?.items ?? []);
        const rows = list.length ? list.map(mapApiToRow) : mockApplications;
        setApplications(rows);
      })
      .catch(() => {
        if (!cancelled) setApplications(mockApplications);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.employer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const configs = {
      applied: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      shortlisted: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      interviewed: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      selected: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      processing: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      deployed: "bg-green-600/10 text-green-600 border-green-600/20",
      rejected: "bg-red-500/10 text-red-500 border-red-500/20",
    };
    return configs[status as keyof typeof configs] || configs.applied;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "selected":
      case "deployed":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "interviewed":
      case "processing":
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
            My Applications
          </h1>
          <p className="text-muted-foreground">
            Track all your job applications
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
          <p className="text-sm text-muted-foreground mb-1">
            Total Applications
          </p>
          <p className="text-2xl font-display font-bold">
            {loading ? "—" : applications.length}
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Active</p>
          <p className="text-2xl font-display font-bold text-blue-500">
            {loading ? "—" : applications.filter((a) => !["rejected", "deployed"].includes(a.status)).length}
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Selected</p>
          <p className="text-2xl font-display font-bold text-emerald-500">
            {loading ? "—" : applications.filter((a) => ["selected", "processing", "deployed"].includes(a.status)).length}
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Avg Match Score</p>
          <p className="text-2xl font-display font-bold">
            {loading ? "—" : applications.length ? Math.round(applications.reduce((s, a) => s + a.matchScore, 0) / applications.length) + "%" : "0%"}
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
                placeholder="Search applications..."
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
              <SelectItem value="interviewed">Interview</SelectItem>
              <SelectItem value="selected">Selected</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="deployed">Deployed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
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
                <TableHead>Position</TableHead>
                <TableHead>Employer</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Match Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Loading applications…
                  </TableCell>
                </TableRow>
              ) : (
              filteredApplications.map((app) => (
                <TableRow key={app.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{app.position}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {app.employer}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="w-4 h-4" />
                      {app.location}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{typeof app.salary === "number" ? `$${app.salary}/mo` : app.salary}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{app.matchScore != null ? `${app.matchScore}%` : "—"}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusBadge(app.status)}
                    >
                      <span className="flex items-center gap-1">
                        {getStatusIcon(app.status)}
                        {app.status}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {app.appliedDate}
                  </TableCell>
                  <TableCell>
                    <Link to={`/app/applications/${app.id}`}>
                      <Button variant="ghost" size="sm">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      {/* No Results */}
      {!loading && filteredApplications.length === 0 && (
        <motion.div variants={fadeInUp} className="text-center py-12">
          <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">No applications found</p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default ApplicationsListPage;
