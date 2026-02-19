import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Building2,
  CheckCircle,
  Share2,
  Users,
  Loader2,
  Calendar,
  DollarSign,
  Clock,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

interface JobDetail {
  id: string;
  title: string;
  employer: string;
  employerId?: string;
  location: string;
  salary: number | string | null;
  positions: number;
  description: string;
  requirements: any;
  status: string;
  createdAt: string;
}

function JobDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchJob = async () => {
      try {
        setLoading(true);
        const data = await applicantService.getJob(id);
        setJob(data as JobDetail);
      } catch (error: any) {
        console.error("Failed to fetch job:", error);
        toast.error("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!id || applied || applying) return;
    try {
      setApplying(true);
      await applicantService.applyToJob(id);
      setApplied(true);
      toast.success("Application submitted successfully!");
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || "Failed to apply";
      if (msg.includes("Already applied")) {
        setApplied(true);
        toast.info("You've already applied to this job");
      } else {
        toast.error(msg);
      }
    } finally {
      setApplying(false);
    }
  };

  const formatSalary = (salary: number | string | null) => {
    if (salary === null || salary === undefined) return "Negotiable";
    if (typeof salary === "string") return salary;
    return `$${salary.toLocaleString()}/month`;
  };

  const getRequirementsList = (requirements: any): string[] => {
    if (!requirements) return [];
    if (Array.isArray(requirements)) return requirements;
    if (typeof requirements === "object" && requirements.skills) {
      return requirements.skills;
    }
    return [];
  };

  const getResponsibilitiesList = (requirements: any): string[] => {
    if (!requirements) return [];
    if (typeof requirements === "object" && requirements.responsibilities) {
      return requirements.responsibilities;
    }
    return [];
  };

  const getBenefitsList = (requirements: any): string[] => {
    if (!requirements) return [];
    if (typeof requirements === "object" && requirements.benefits) {
      return requirements.benefits;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
        <span className="ml-3 text-muted-foreground">Loading job details...</span>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Briefcase className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
        <h2 className="text-xl font-semibold mb-2">Job Not Found</h2>
        <p className="text-muted-foreground mb-6">
          This job may have been removed or is no longer available.
        </p>
        <Button onClick={() => navigate("/app/jobs")} className="gradient-bg-accent text-accent-foreground">
          Browse Other Jobs
        </Button>
      </div>
    );
  }

  const requirements = getRequirementsList(job.requirements);
  const responsibilities = getResponsibilitiesList(job.requirements);
  const benefits = getBenefitsList(job.requirements);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Back Button */}
      <motion.button
        variants={fadeInUp}
        onClick={() => navigate("/app/jobs")}
        className="flex items-center gap-2 text-accent hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Jobs
      </motion.button>

      {/* Header */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-display font-bold mb-2">
              {job.title}
            </h1>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {job.employer || "Company"}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {job.location}
              </div>
              <p className="text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Posted {getTimeAgo(job.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Key Info */}
        <div className="grid sm:grid-cols-3 gap-4 p-4 bg-secondary rounded-lg">
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
            <p className="text-xs text-muted-foreground mb-1">Status</p>
            <Badge variant="secondary" className="capitalize">
              {job.status?.toLowerCase() || "active"}
            </Badge>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <motion.div variants={fadeInUp} className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-3">About This Position</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </motion.div>

          {/* Responsibilities */}
          {responsibilities.length > 0 && (
            <motion.div variants={fadeInUp} className="card-premium p-6">
              <h2 className="text-xl font-semibold mb-4">Responsibilities</h2>
              <ul className="space-y-3">
                {responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{resp}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Requirements */}
          {requirements.length > 0 && (
            <motion.div variants={fadeInUp} className="card-premium p-6">
              <h2 className="text-xl font-semibold mb-4">Requirements</h2>
              <ul className="space-y-3">
                {requirements.map((req, idx) => (
                  <li key={idx} className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Benefits */}
          {benefits.length > 0 && (
            <motion.div variants={fadeInUp} className="card-premium p-6">
              <h2 className="text-xl font-semibold mb-4">Benefits</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex gap-2 p-3 bg-secondary rounded-lg">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Application Card */}
          <motion.div
            variants={fadeInUp}
            className="card-premium p-6 sticky top-20"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Salary</p>
                  <p className="font-semibold text-lg">
                    {formatSalary(job.salary)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Open Positions</p>
                  <p className="font-semibold">{job.positions}</p>
                </div>
              </div>

              <Button
                className={`w-full ${
                  applied
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "gradient-bg-accent"
                } text-accent-foreground font-semibold`}
                disabled={applied || applying}
                onClick={handleApply}
              >
                {applying ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : applied ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Application Submitted
                  </>
                ) : (
                  "Apply Now"
                )}
              </Button>
            </div>
          </motion.div>

          {/* Employer Info */}
          <motion.div variants={fadeInUp} className="card-premium p-6">
            <h3 className="font-semibold mb-4">Employer Information</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Company</p>
                  <p className="text-sm text-muted-foreground">
                    {job.employer || "Company"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">
                    {job.location}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Posted</p>
                  <p className="text-sm text-muted-foreground">
                    {getTimeAgo(job.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default JobDetailsPage;
