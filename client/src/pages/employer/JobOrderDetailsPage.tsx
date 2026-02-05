import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  DollarSign,
  MapPin,
  Users,
  Calendar,
  Edit2,
  Trash2,
  Eye,
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

const jobOrderData = {
  id: "JO-001",
  title: "Registered Nurse (ICU)",
  location: "Riyadh, Saudi Arabia",
  salary: "$2,500/month",
  positions: 5,
  filled: 2,
  duration: "2 years",
  status: "active",
  postedDate: "2025-01-01",
  description:
    "We are seeking experienced Registered Nurses with strong ICU background for our state-of-the-art medical facility.",
  requirements: [
    "Current RN License",
    "Minimum 3 years of ICU experience",
    "BLS/CPR certification",
    "Bachelor's degree in Nursing preferred",
    "Fluent in English",
  ],
  benefits: [
    "Competitive salary",
    "Housing allowance",
    "Health insurance",
    "Annual flights home",
    "Professional development",
  ],
  applicants: 45,
  candidates: [
    { name: "Maria Santos", status: "selected" },
    { name: "John Reyes", status: "interviewing" },
    { name: "Ana Cruz", status: "applied" },
  ],
};

function JobOrderDetailsPage() {
  const navigate = useNavigate();
  const fillPercentage = (jobOrderData.filled / jobOrderData.positions) * 100;

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
        onClick={() => navigate("/employer/job-orders")}
        className="flex items-center gap-2 text-accent hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Job Orders
      </motion.button>

      {/* Header */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-display font-bold mb-2">
              {jobOrderData.title}
            </h1>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {jobOrderData.location}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Posted {new Date(jobOrderData.postedDate).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline">
              <Trash2 className="w-4 h-4 mr-2" />
              Close
            </Button>
          </div>
        </div>

        {/* Key Info */}
        <div className="grid sm:grid-cols-4 gap-4 p-4 bg-secondary rounded-lg">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Salary</p>
            <p className="font-semibold text-accent">{jobOrderData.salary}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Duration</p>
            <p className="font-medium">{jobOrderData.duration}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Positions</p>
            <p className="font-medium">{jobOrderData.positions}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Status</p>
            <Badge
              variant="secondary"
              className="bg-emerald-50 text-emerald-700"
            >
              {jobOrderData.status}
            </Badge>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <motion.div variants={fadeInUp} className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-3">Job Description</h2>
            <p className="text-muted-foreground">{jobOrderData.description}</p>
          </motion.div>

          {/* Requirements */}
          <motion.div variants={fadeInUp} className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-4">Requirements</h2>
            <ul className="space-y-2">
              {jobOrderData.requirements.map((req, idx) => (
                <li key={idx} className="flex gap-3 text-muted-foreground">
                  <span className="text-accent mt-1">•</span>
                  {req}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Benefits */}
          <motion.div variants={fadeInUp} className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-4">Benefits</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {jobOrderData.benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="flex gap-2 p-3 bg-secondary rounded-lg"
                >
                  <span className="text-accent">✓</span>
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Positions */}
          <motion.div
            variants={fadeInUp}
            className="card-premium p-6 sticky top-20"
          >
            <h3 className="font-semibold mb-4">Position Progress</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Filled</span>
                  <span className="font-semibold">
                    {jobOrderData.filled}/{jobOrderData.positions}
                  </span>
                </div>
                <Progress value={fillPercentage} className="h-2" />
              </div>
              <div className="text-xs text-muted-foreground">
                {jobOrderData.positions - jobOrderData.filled} position
                {jobOrderData.positions - jobOrderData.filled !== 1
                  ? "s"
                  : ""}{" "}
                remaining
              </div>
            </div>
          </motion.div>

          {/* Applicants */}
          <motion.div variants={fadeInUp} className="card-premium p-6">
            <h3 className="font-semibold mb-4">Recent Candidates</h3>
            <div className="space-y-3">
              {jobOrderData.candidates.map((cand, idx) => (
                <div key={idx} className="p-3 bg-secondary rounded-lg">
                  <p className="text-sm font-medium mb-1">{cand.name}</p>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      cand.status === "selected"
                        ? "bg-emerald-50 text-emerald-700"
                        : cand.status === "interviewing"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    {cand.status}
                  </Badge>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default JobOrderDetailsPage;
