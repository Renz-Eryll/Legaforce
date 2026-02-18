import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Award,
  FileText,
  MessageSquare,
  Share2,
  Heart,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const candidateData = {
  id: "CAND-001",
  name: "Maria Santos",
  position: "Registered Nurse",
  rating: 4.8,
  matchScore: 92,
  location: "Manila, Philippines",
  phone: "+63 917 123 4567",
  email: "maria.santos@email.com",
  experience: "5+ years",
  bio: "Experienced RN with strong ICU background and excellent patient care skills.",
  availableFrom: "2025-02-15",
  expectaedSalary: "$2,500/month",
  skills: [
    "ICU Experience",
    "Patient Care",
    "BLS/CPR",
    "Leadership",
    "Critical Thinking",
  ],
  certifications: [
    "RN License - PRC",
    "BLS/CPR Certification",
    "ACLS Certification",
  ],
  workExperience: [
    {
      position: "ICU Nurse",
      employer: "Philippine General Hospital",
      duration: "2019 - Present",
      description: "Critical care nursing in intensive care unit",
    },
    {
      position: "Ward Nurse",
      employer: "St. Luke's Medical Center",
      duration: "2018 - 2019",
      description: "General nursing in medical-surgical ward",
    },
  ],
  documents: [
    { name: "Nursing License", status: "verified" },
    { name: "BLS/CPR Certificate", status: "verified" },
    { name: "Passport", status: "verified" },
  ],
};

function CandidateDetailsPage() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

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
        onClick={() => navigate("/employer/candidates")}
        className="flex items-center gap-2 text-accent hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Candidates
      </motion.button>

      {/* Header */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-display font-bold mb-2">
              {candidateData.name}
            </h1>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                {candidateData.position}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {candidateData.location}
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {candidateData.rating} / 5.0 Rating
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setSaved(!saved)}>
              <Heart
                className={`w-5 h-5 ${saved ? "fill-red-500 text-red-500" : ""}`}
              />
            </Button>
            <Button variant="ghost">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Match Score */}
        <div className="p-4 bg-secondary rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium">Job Match Score</p>
            <Badge>{candidateData.matchScore}%</Badge>
          </div>
          <Progress value={candidateData.matchScore} className="h-2" />
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <motion.div variants={fadeInUp} className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{candidateData.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{candidateData.email}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Work Experience */}
          <motion.div variants={fadeInUp} className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-4">Work Experience</h2>
            <div className="space-y-4">
              {candidateData.workExperience.map((exp, idx) => (
                <div key={idx} className="pb-4 border-b last:border-0">
                  <h3 className="font-semibold mb-1">{exp.position}</h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    {exp.employer}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {exp.duration}
                  </p>
                  <p className="text-sm">{exp.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div variants={fadeInUp} className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {candidateData.skills.map((skill, idx) => (
                <Badge key={idx} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Action Card */}
          <motion.div
            variants={fadeInUp}
            className="card-premium p-6 sticky top-20"
          >
            <div className="space-y-4">
              <Button className="w-full gradient-bg-accent text-accent-foreground">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              <Button className="w-full" variant="outline">
                Schedule Video Interview
              </Button>
              <Button className="w-full" variant="outline">
                Make Offer
              </Button>
              <Button className="w-full" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download CV
              </Button>
            </div>
          </motion.div>

          {/* Availability */}
          <motion.div variants={fadeInUp} className="card-premium p-6">
            <h3 className="font-semibold mb-4">Availability</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Available From
                </p>
                <p className="font-medium">{candidateData.availableFrom}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Expected Salary
                </p>
                <p className="font-semibold text-accent">
                  {candidateData.expectaedSalary}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Certifications */}
          <motion.div variants={fadeInUp} className="card-premium p-6">
            <h3 className="font-semibold mb-4">Certifications</h3>
            <div className="space-y-2">
              {candidateData.certifications.map((cert, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-accent" />
                  <span className="text-sm">{cert}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default CandidateDetailsPage;
