import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search,
  ChevronRight,
  MapPin,
  Building2,
  DollarSign,
  Briefcase,
  Heart,
  Eye,
  Smartphone,
  Zap,
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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

const mockJobs = [
  {
    id: "JO-001",
    title: "Registered Nurse (ICU)",
    employer: "King Faisal Hospital",
    location: "Riyadh, Saudi Arabia",
    salary: "$2,500/mo",
    contract: "2 years",
    matchScore: 92,
    positions: 5,
    applicants: 234,
    type: "Full-time",
    requirements: ["RN License", "3+ years ICU experience", "BLS Cert"],
    saved: false,
  },
  {
    id: "JO-002",
    title: "Staff Nurse - General Ward",
    employer: "Dubai Health Authority",
    location: "Dubai, UAE",
    salary: "$2,200/mo",
    contract: "3 years",
    matchScore: 88,
    positions: 10,
    applicants: 456,
    type: "Full-time",
    requirements: ["RN License", "2+ years experience", "BLS Cert"],
    saved: true,
  },
  {
    id: "JO-003",
    title: "Senior Nurse",
    employer: "Hamad Medical Corporation",
    location: "Doha, Qatar",
    salary: "$2,600/mo",
    contract: "2 years",
    matchScore: 85,
    positions: 3,
    applicants: 123,
    type: "Full-time",
    requirements: ["RN License", "5+ years experience", "BSN degree"],
    saved: false,
  },
  {
    id: "JO-004",
    title: "OR Nurse",
    employer: "Kuwait Hospital",
    location: "Kuwait City, Kuwait",
    salary: "$2,400/mo",
    contract: "2 years",
    matchScore: 90,
    positions: 2,
    applicants: 89,
    type: "Full-time",
    requirements: ["RN License", "OR experience", "ACLS Cert"],
    saved: false,
  },
];

function JobsListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [salaryFilter, setSalaryFilter] = useState("all");
  const [savedOnly, setSavedOnly] = useState(false);
  const [autoApplyMatching, setAutoApplyMatching] = useState(false);

  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.employer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSaved = !savedOnly || job.saved;
    return matchesSearch && matchesSaved;
  });

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Apply Anywhere: Mobile & Web, low-bandwidth optimized */}
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
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="auto-apply"
              checked={autoApplyMatching}
              onCheckedChange={setAutoApplyMatching}
            />
            <Label htmlFor="auto-apply" className="text-sm cursor-pointer flex items-center gap-1">
              <Zap className="w-4 h-4 text-accent" />
              Auto-apply to matching jobs
            </Label>
          </div>
          <Button
            variant={savedOnly ? "default" : "outline"}
            onClick={() => setSavedOnly(!savedOnly)}
          >
            <Heart className="w-4 h-4 mr-2 fill-current" />
            Saved Jobs
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-4">
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Active Jobs</p>
          <p className="text-2xl font-display font-bold">{mockJobs.length}</p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Avg Salary</p>
          <p className="text-2xl font-display font-bold">$2,425/mo</p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Positions</p>
          <p className="text-2xl font-display font-bold">20</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeInUp} className="card-premium p-5">
        <div className="flex flex-col gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs by title or employer..."
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
                <SelectItem value="saudi">Saudi Arabia</SelectItem>
                <SelectItem value="uae">UAE</SelectItem>
                <SelectItem value="qatar">Qatar</SelectItem>
                <SelectItem value="kuwait">Kuwait</SelectItem>
              </SelectContent>
            </Select>

            <Select value={salaryFilter} onValueChange={setSalaryFilter}>
              <SelectTrigger>
                <DollarSign className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Salary Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ranges</SelectItem>
                <SelectItem value="2000">$2,000 - $2,500</SelectItem>
                <SelectItem value="2500">$2,500 - $3,000</SelectItem>
                <SelectItem value="3000">$3,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Jobs Grid */}
      <motion.div variants={fadeInUp} className="grid gap-4">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="card-premium p-5 hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-start gap-2 mb-2">
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  {job.saved && (
                    <Heart className="w-5 h-5 fill-red-500 text-red-500 shrink-0" />
                  )}
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    {job.employer}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {!job.saved && (
                  <Button variant="ghost" size="sm">
                    <Heart className="w-4 h-4" />
                  </Button>
                )}
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
                <p className="font-semibold text-accent">{job.salary}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Contract</p>
                <p className="font-medium">{job.contract}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Positions</p>
                <p className="font-medium">{job.positions} open</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Match Score
                </p>
                <Badge variant="secondary">{job.matchScore}%</Badge>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {job.requirements.map((req, idx) => (
                <Badge key={idx} variant="outline">
                  {req}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </motion.div>

      {/* No Results */}
      {filteredJobs.length === 0 && (
        <motion.div variants={fadeInUp} className="text-center py-12">
          <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">
            No jobs found matching your criteria
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default JobsListPage;
