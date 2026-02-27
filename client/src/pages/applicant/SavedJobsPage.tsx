import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Bookmark,
  MapPin,
  DollarSign,
  Building2,
  Calendar,
  ArrowRight,
  Trash2,
  Search,
  Loader2,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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

function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        setIsLoading(true);
        const data = await applicantService.getSavedJobs();
        setSavedJobs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch saved jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  const handleRemove = async (id: string) => {
    try {
      await applicantService.unsaveJob(id);
      setSavedJobs((jobs) => jobs.filter((j) => j.id !== id));
      toast.success("Job removed from saved list");
    } catch (error) {
      console.error("Failed to remove saved job:", error);
      toast.error("Failed to remove job");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <p className="text-muted-foreground">Loading saved jobs...</p>
        </div>
      </div>
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
          <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1">Saved Jobs</h1>
          <p className="text-muted-foreground">
            Jobs you've bookmarked for later review. Apply when you're ready.
          </p>
        </div>
        <Link to="/app/jobs">
          <Button className="gradient-bg-accent text-accent-foreground">
            <Search className="w-4 h-4 mr-2" />
            Browse More Jobs
          </Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="card-premium p-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-accent/10">
            <Bookmark className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Saved Jobs</p>
            <p className="text-2xl font-display font-bold">{savedJobs.length}</p>
          </div>
        </div>
      </motion.div>

      {/* Saved Jobs List */}
      {savedJobs.length === 0 ? (
        <motion.div variants={fadeInUp} className="text-center py-16 card-premium">
          <Bookmark className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
          <h2 className="text-xl font-display font-semibold mb-2">No Saved Jobs Yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Browse available job opportunities and bookmark the ones you're interested in. 
            They'll appear here for easy access later.
          </p>
          <Link to="/app/jobs">
            <Button className="gradient-bg-accent text-accent-foreground">
              <Briefcase className="w-4 h-4 mr-2" />
              Start Browsing Jobs
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      ) : (
        <motion.div variants={fadeInUp} className="space-y-3">
          {savedJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card-premium p-5 group hover:shadow-lg transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-muted font-display font-bold text-lg shrink-0">
                  {(job.employer || job.company || "?").charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg group-hover:text-accent transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {job.employer || job.company || "Unknown"}
                    </div>
                    {job.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                    )}
                    {job.salary && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ${job.salary.toLocaleString()}/mo
                      </div>
                    )}
                  </div>
                  {job.savedAt && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                      <Calendar className="w-3 h-3" />
                      Saved on {new Date(job.savedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemove(job.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Link to={`/app/jobs/${job.id}`}>
                    <Button size="sm" className="gradient-bg-accent text-accent-foreground">
                      View & Apply
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

export default SavedJobsPage;
