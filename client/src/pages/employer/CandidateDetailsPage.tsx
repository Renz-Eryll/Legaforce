import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Award,
  MessageSquare,
  Share2,
  Heart,
  Download,
  Loader2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { employerService } from "@/services/employerService";
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

function CandidateDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchCandidate = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await employerService.getCandidate(id);
        setCandidate(data);
      } catch (error) {
        console.error("Failed to fetch candidate:", error);
        toast.error("Failed to load candidate details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCandidate();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-accent mx-auto mb-3" />
          <p className="text-muted-foreground">Loading candidate profile...</p>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="text-center py-16">
        <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
        <h2 className="text-xl font-semibold mb-2">Candidate Not Found</h2>
        <p className="text-muted-foreground mb-4">This candidate profile could not be loaded.</p>
        <Button onClick={() => navigate("/employer/candidates")}>Back to Candidates</Button>
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
              {candidate.name}
            </h1>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                {candidate.position || "No position specified"}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {candidate.location || "Unknown location"}
              </div>
              {candidate.rating > 0 && (
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {candidate.rating} / 5.0 Rating
                </div>
              )}
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
        {candidate.matchScore > 0 && (
          <div className="p-4 bg-secondary rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium">Job Match Score</p>
              <Badge>{candidate.matchScore}%</Badge>
            </div>
            <Progress value={candidate.matchScore} className="h-2" />
          </div>
        )}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <motion.div variants={fadeInUp} className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-3">
              {candidate.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{candidate.phone}</p>
                  </div>
                </div>
              )}
              {candidate.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{candidate.email}</p>
                  </div>
                </div>
              )}
              {!candidate.phone && !candidate.email && (
                <p className="text-sm text-muted-foreground">Contact information not available</p>
              )}
            </div>
          </motion.div>

          {/* Experience */}
          <motion.div variants={fadeInUp} className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-4">Experience</h2>
            <p className="text-muted-foreground">{candidate.experience || "No experience details available"}</p>
          </motion.div>

          {/* Skills */}
          {candidate.skills && candidate.skills.length > 0 && (
            <motion.div variants={fadeInUp} className="card-premium p-6">
              <h2 className="text-xl font-semibold mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill: string, idx: number) => (
                  <Badge key={idx} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}

          {/* Interview Notes */}
          {candidate.interviewNotes && (
            <motion.div variants={fadeInUp} className="card-premium p-6">
              <h2 className="text-xl font-semibold mb-4">Interview Notes</h2>
              <p className="text-muted-foreground whitespace-pre-line">{candidate.interviewNotes}</p>
            </motion.div>
          )}
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

          {/* Certifications */}
          {candidate.certifications && candidate.certifications.length > 0 && (
            <motion.div variants={fadeInUp} className="card-premium p-6">
              <h3 className="font-semibold mb-4">Certifications</h3>
              <div className="space-y-2">
                {candidate.certifications.map((cert: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-accent" />
                    <span className="text-sm">{cert}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default CandidateDetailsPage;
