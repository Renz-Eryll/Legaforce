import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Building2,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  Heart,
  Share2,
  Users,
  Globe,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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

const jobDetails = {
  id: "JO-001",
  title: "Registered Nurse (ICU)",
  employer: "King Faisal Hospital",
  location: "Riyadh, Saudi Arabia",
  salary: "$2,500/month",
  contract: "2 years",
  positions: 5,
  applicants: 234,
  matchScore: 92,
  description:
    "We are seeking experienced Registered Nurses with strong ICU background to join our world-class medical facility. You will work in a modern, state-of-the-art intensive care unit with access to cutting-edge medical equipment and collaborate with an international team of healthcare professionals.",
  responsibilities: [
    "Provide direct patient care in ICU setting",
    "Monitor vital signs and patient conditions continuously",
    "Administer medications and treatments as prescribed",
    "Maintain detailed patient records and documentation",
    "Collaborate with multidisciplinary healthcare team",
    "Provide patient and family education",
    "Follow infection control and safety protocols",
  ],
  requirements: [
    "Current RN License (transferable to Saudi Arabia)",
    "Minimum 3 years of ICU experience",
    "BLS/CPR certification",
    "ACLS certification preferred",
    "Bachelor's degree in Nursing preferred",
    "Fluent in English (Written and Spoken)",
    "Strong communication and teamwork skills",
  ],
  benefits: [
    "Competitive salary and housing allowance",
    "Comprehensive health insurance",
    "Annual flight tickets home",
    "Professional development opportunities",
    "Annual leave 30 days",
  ],
  saved: false,
  posted: "2 days ago",
  deadline: "2025-02-28",
};

const relatedJobs = [
  {
    id: "JO-002",
    title: "Staff Nurse - General Ward",
    employer: "Dubai Health Authority",
    location: "Dubai, UAE",
    matchScore: 88,
  },
  {
    id: "JO-003",
    title: "Senior Nurse",
    employer: "Hamad Medical Corporation",
    location: "Doha, Qatar",
    matchScore: 85,
  },
];

function JobDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [saved, setSaved] = useState(jobDetails.saved);
  const [applied, setApplied] = useState(false);

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
              {jobDetails.title}
            </h1>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {jobDetails.employer}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {jobDetails.location}
              </div>
              <p className="text-sm">Posted {jobDetails.posted}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setSaved(!saved)}>
              <Heart
                className={`w-5 h-5 ${
                  saved ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Key Info */}
        <div className="grid sm:grid-cols-4 gap-4 p-4 bg-secondary rounded-lg">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Salary</p>
            <p className="font-semibold text-accent">{jobDetails.salary}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Contract</p>
            <p className="font-medium">{jobDetails.contract}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Positions</p>
            <p className="font-medium">{jobDetails.positions} open</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Match Score</p>
            <Badge variant="secondary">{jobDetails.matchScore}%</Badge>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <motion.div variants={fadeInUp} className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-3">About This Position</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {jobDetails.description}
            </p>
          </motion.div>

          {/* Responsibilities */}
          <motion.div variants={fadeInUp} className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-4">Responsibilities</h2>
            <ul className="space-y-3">
              {jobDetails.responsibilities.map((resp, idx) => (
                <li key={idx} className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{resp}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Requirements */}
          <motion.div variants={fadeInUp} className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-4">Requirements</h2>
            <ul className="space-y-3">
              {jobDetails.requirements.map((req, idx) => (
                <li key={idx} className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{req}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Benefits */}
          <motion.div variants={fadeInUp} className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-4">Benefits</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {jobDetails.benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="flex gap-2 p-3 bg-secondary rounded-lg"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Application Card */}
          <motion.div
            variants={fadeInUp}
            className="card-premium p-6 sticky top-20"
          >
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Application Deadline
                </p>
                <p className="font-semibold">
                  {new Date(jobDetails.deadline).toLocaleDateString()}
                </p>
              </div>

              <Progress value={jobDetails.matchScore} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {jobDetails.matchScore}% match to your profile
              </p>

              <Button
                className={`w-full ${
                  applied
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "gradient-bg-accent"
                }`}
                disabled={applied}
                onClick={() => setApplied(true)}
              >
                {applied ? "✓ Application Submitted" : "Apply Now"}
              </Button>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex gap-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {jobDetails.applicants} have applied
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Employer Contact */}
          <motion.div variants={fadeInUp} className="card-premium p-6">
            <h3 className="font-semibold mb-4">Employer Information</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Hospital</p>
                  <p className="text-sm text-muted-foreground">
                    {jobDetails.employer}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">
                    {jobDetails.location}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-accent cursor-pointer hover:underline">
                    hr@kingfaisal.sa
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Website</p>
                  <p className="text-sm text-accent cursor-pointer hover:underline">
                    www.kingfaisal.sa
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Related Jobs */}
          <motion.div variants={fadeInUp} className="card-premium p-6">
            <h3 className="font-semibold mb-4">Similar Jobs</h3>
            <div className="space-y-3">
              {relatedJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-3 bg-secondary rounded-lg hover:bg-secondary/80 cursor-pointer transition-colors"
                >
                  <p className="text-sm font-medium mb-1">{job.title}</p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {job.employer}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      {job.location}
                    </span>
                    <Badge variant="outline">{job.matchScore}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default JobDetailsPage;
