import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Building2,
  DollarSign,
  Briefcase,
  Eye,
  Smartphone,
  Loader2,
  Users,
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
import { applicantService } from "@/services/applicantService";
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

interface Job {
  id: string;
  title: string;
  employer: string;
  location: string;
  salary: number | string | null;
  positions: number;
  description: string;
  requirements: any;
  status: string;
  createdAt: string;
}

function JobsListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async (search?: string, location?: string) => {
    try {
      setLoading(true);
      const params: any = { limit: 50 };
      if (search) params.search = search;
      if (location && location !== "all") params.location = location;

      const data: any = await applicantService.getJobs(params);
      const items = data?.items || data || [];
      setJobs(Array.isArray(items) ? items : []);
      setTotalJobs(data?.total || items.length || 0);
    } catch (error: any) {
      console.error("Failed to fetch jobs:", error);
      toast.error("Failed to load jobs");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchJobs(searchTerm, locationFilter);
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchTerm, locationFilter]);

  const formatSalary = (salary: number | string | null) => {
    if (salary === null || salary === undefined) return "Negotiable";
    if (typeof salary === "string") return salary;
    return `$${salary.toLocaleString()}/mo`;
  };

  const getRequirementsList = (requirements: any): string[] => {
    if (!requirements) return [];
    if (Array.isArray(requirements)) return requirements;
    if (typeof requirements === "object" && requirements.skills) {
      return requirements.skills;
    }
    return [];
  };

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  // Get unique locations for filter
  const uniqueLocations = [...new Set(jobs.map((j) => {
    const parts = j.location?.split(",");
    return parts?.[parts.length - 1]?.trim() || j.location;
  }).filter(Boolean))];

  const avgSalary = jobs.length
    ? Math.round(
        jobs.reduce((sum, j) => sum + (typeof j.salary === "number" ? j.salary : 0), 0) /
          jobs.filter((j) => typeof j.salary === "number").length || 1,
      )
    : 0;

  const totalPositions = jobs.reduce((sum, j) => sum + (j.positions || 0), 0);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Apply Anywhere Banner */}
      <motion.div
        variants={fadeInUp}
        className="flex flex-wrap items-center gap-4 p-4 rounded-lg bg-muted/50 border border-border text-sm text-muted-foreground"
      >
        <span className="flex items-center gap-2 font-medium text-foreground">
          <Smartphone className="w-4 h-4 text-accent" />
          Apply anywhere
        </span>
        <span>Works on mobile & web. Optimized for low-bandwidth.</span>
      </motion.div>

      {/* Header */}
      <motion.div
        variants={fadeInUp}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-display font-bold mb-1">
            Job Opportunities
          </h1>
          <p className="text-muted-foreground">
            Find your next overseas placement
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-4">
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Active Jobs</p>
          <p className="text-2xl font-display font-bold">
            {loading ? "—" : totalJobs}
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Avg Salary</p>
          <p className="text-2xl font-display font-bold">
            {loading ? "—" : avgSalary > 0 ? `$${avgSalary.toLocaleString()}/mo` : "—"}
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Positions</p>
          <p className="text-2xl font-display font-bold">
            {loading ? "—" : totalPositions}
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
                placeholder="Search jobs by title, description, or employer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <MapPin className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {uniqueLocations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <motion.div variants={fadeInUp} className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
          <span className="ml-3 text-muted-foreground">Loading jobs...</span>
        </motion.div>
      )}

      {/* Jobs Grid */}
      {!loading && (
        <motion.div variants={fadeInUp} className="grid gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="card-premium p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{job.title}</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      {job.employer || "Company"}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/app/jobs/${job.id}`}>
                    <Button className="gradient-bg-accent text-accent-foreground">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid sm:grid-cols-4 gap-4 mb-4 pb-4 border-b">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Salary</p>
                  <p className="font-semibold text-accent">
                    {formatSalary(job.salary)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Positions</p>
                  <p className="font-medium">{job.positions} open</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Posted</p>
                  <p className="font-medium">{getTimeAgo(job.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <Badge variant="secondary" className="capitalize">
                    {job.status?.toLowerCase() || "active"}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {getRequirementsList(job.requirements).slice(0, 4).map((req, idx) => (
                  <Badge key={idx} variant="outline">
                    {req}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* No Results */}
      {!loading && jobs.length === 0 && (
        <motion.div variants={fadeInUp} className="text-center py-12">
          <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-lg font-semibold mb-1">No jobs found</p>
          <p className="text-muted-foreground">
            {searchTerm || locationFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Check back later for new opportunities"}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default JobsListPage;
