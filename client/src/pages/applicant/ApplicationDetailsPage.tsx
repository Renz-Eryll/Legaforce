import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import {
  ChevronLeft,
  MapPin,
  DollarSign,
  Calendar,
  Building2,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Phone,
  Mail,
  Globe,
  Share2,
  MessageCircle,
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

// Mock data
const mockApplication = {
  id: "APP-001",
  position: "Registered Nurse (ICU)",
  employer: "King Faisal Hospital",
  location: "Riyadh, Saudi Arabia",
  salary: "$2,500/mo",
  contract: "2 years",
  status: "interviewed",
  matchScore: 92,
  appliedDate: "Jan 15, 2026",
  interviewDate: "Jan 28, 2026",
  description:
    "Looking for experienced nurses in intensive care units with at least 3 years of experience.",
  requirements: [
    "Bachelor's degree in Nursing",
    "RN License (active)",
    "Minimum 3 years ICU experience",
    "BLS Certification",
    "Fluent in English",
  ],
  timeline: [
    { stage: "Applied", date: "Jan 15, 2026", completed: true },
    { stage: "Shortlisted", date: "Jan 18, 2026", completed: true },
    { stage: "Interviewed", date: "Jan 28, 2026", completed: true },
    { stage: "Selected", date: "Pending", completed: false },
    { stage: "Deployment", date: "Pending", completed: false },
  ],
  employer_info: {
    name: "King Faisal Hospital",
    email: "careers@kfh.com.sa",
    phone: "+966 11 464 3333",
    website: "www.kfh.com.sa",
  },
};

function ApplicationDetailsPage() {
  const { id } = useParams();

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
      </motion.div>

      {/* Main Card */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold mb-1">
              {mockApplication.position}
            </h1>
            <div className="flex flex-col gap-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {mockApplication.employer}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {mockApplication.location}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
            <Button
              className="gradient-bg-accent text-accent-foreground"
              size="sm"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Message
            </Button>
          </div>
        </div>

        {/* Status & Match Score */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6 pb-6 border-b">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Status</p>
            <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
              <Clock className="w-3 h-3 mr-1" />
              {mockApplication.status}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Match Score</p>
            <div className="flex items-center gap-2">
              <Progress value={mockApplication.matchScore} className="flex-1" />
              <span className="font-bold">{mockApplication.matchScore}%</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Salary</p>
            <p className="font-semibold flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {mockApplication.salary}
            </p>
          </div>
        </div>

        {/* Key Info */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Applied Date</p>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <p className="font-medium">{mockApplication.appliedDate}</p>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Interview Date</p>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <p className="font-medium">{mockApplication.interviewDate}</p>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">
              Contract Duration
            </p>
            <p className="font-medium">{mockApplication.contract}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">
              Job Description
            </p>
            <p className="text-sm">{mockApplication.description}</p>
          </div>
        </div>
      </motion.div>

      {/* Requirements */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <h2 className="text-lg font-semibold mb-4">Job Requirements</h2>
        <ul className="space-y-3">
          {mockApplication.requirements.map((req, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span>{req}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Application Timeline */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <h2 className="text-lg font-semibold mb-6">Application Timeline</h2>
        <div className="space-y-4">
          {mockApplication.timeline.map((item, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    item.completed
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {item.completed ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Clock className="w-5 h-5" />
                  )}
                </div>
                {idx < mockApplication.timeline.length - 1 && (
                  <div className="w-0.5 h-12 bg-border mt-2" />
                )}
              </div>
              <div className="pt-2">
                <p className="font-medium">{item.stage}</p>
                <p className="text-sm text-muted-foreground">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Employer Contact */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <h2 className="text-lg font-semibold mb-4">Employer Contact</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Hospital Name</p>
              <p className="font-medium">
                {mockApplication.employer_info.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">
                {mockApplication.employer_info.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">
                {mockApplication.employer_info.phone}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Website</p>
              <p className="font-medium text-blue-600">
                {mockApplication.employer_info.website}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ApplicationDetailsPage;
