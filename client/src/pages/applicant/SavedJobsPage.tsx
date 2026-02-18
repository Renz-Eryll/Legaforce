import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search,
  Heart,
  MapPin,
  Building2,
  DollarSign,
  Calendar,
  Eye,
  Trash2,
  Filter,
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

const mockSavedJobs = [
  {
    id: "JO-002",
    title: "Staff Nurse - General Ward",
    employer: "Dubai Health Authority",
    location: "Dubai, UAE",
    salary: "$2,200/mo",
    matchScore: 88,
    savedDate: "2025-01-15",
    type: "Full-time",
    positions: 10,
  },
  {
    id: "JO-005",
    title: "Critical Care Nurse",
    employer: "Oman National Hospital",
    location: "Muscat, Oman",
    salary: "$2,350/mo",
    matchScore: 86,
    savedDate: "2025-01-12",
    type: "Full-time",
    positions: 3,
  },
  {
    id: "JO-006",
    title: "Pediatric Nurse",
    employer: "Bahrain Defence Force Hospital",
    location: "Manama, Bahrain",
    salary: "$2,300/mo",
    matchScore: 81,
    savedDate: "2025-01-10",
    type: "Full-time",
    positions: 2,
  },
];

function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState(mockSavedJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const handleRemove = (id: string) => {
    setSavedJobs(savedJobs.filter((job) => job.id !== id));
  };

  let filteredJobs = savedJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.employer.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (sortBy === "salary-high") {
    filteredJobs = [...filteredJobs].sort(
      (a, b) =>
        parseInt(b.salary.replace(/\D/g, "")) -
        parseInt(a.salary.replace(/\D/g, "")),
    );
  } else if (sortBy === "match") {
    filteredJobs = [...filteredJobs].sort(
      (a, b) => b.matchScore - a.matchScore,
    );
  }

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
          <h1 className="text-3xl font-display font-bold mb-1">Saved Jobs</h1>
          <p className="text-muted-foreground">
            Your bookmarked job opportunities
          </p>
        </div>
        <Badge variant="secondary" className="text-base px-3 py-2 w-fit">
          {savedJobs.length} saved
        </Badge>
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeInUp} className="card-premium p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search saved jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="salary-high">Highest Salary</SelectItem>
              <SelectItem value="match">Best Match</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Jobs List */}
      {filteredJobs.length > 0 ? (
        <motion.div variants={fadeInUp} className="space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="card-premium p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{job.title}</h3>
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
                  <Link to={`/app/jobs/${job.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(job.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>

              <div className="grid sm:grid-cols-4 gap-4 p-4 bg-secondary rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Salary</p>
                  <p className="font-semibold text-accent">{job.salary}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Positions
                  </p>
                  <p className="font-medium">{job.positions} open</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Match</p>
                  <Badge variant="secondary">{job.matchScore}%</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Saved On</p>
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="w-3 h-3" />
                    {new Date(job.savedDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      ) : (
        <motion.div variants={fadeInUp} className="text-center py-12">
          <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? "No saved jobs match your search"
              : "You haven't saved any jobs yet"}
          </p>
          <Link to="/app/jobs">
            <Button className="gradient-bg-accent text-accent-foreground">
              Browse Jobs
            </Button>
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}

export default SavedJobsPage;
