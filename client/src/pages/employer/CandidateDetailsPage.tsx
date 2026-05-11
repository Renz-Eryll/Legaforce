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
  CheckCircle,
  Loader,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { employerService } from "@/services/employerService";
import { toast } from "sonner";
import { DetailPageSkeleton } from "@/components/ui/page-skeletons";

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
  const [ratingEdit, setRatingEdit] = useState<{
    rating: number;
    review: string;
  } | null>(null);
  const [isSavingRating, setIsSavingRating] = useState(false);

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

  if (isLoading) return <DetailPageSkeleton />;

  if (!candidate) {
    return (
      <div className="text-center py-16">
        <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
        <h2 className="text-xl font-semibold mb-2">Candidate Not Found</h2>
        <p className="text-muted-foreground mb-4">
          This candidate profile could not be loaded.
        </p>
        <Button onClick={() => navigate("/employer/candidates")}>
          Back to Candidates
        </Button>
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
              {candidate.trustScore && (
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-accent" />
                  Trust Score: {candidate.trustScore}/100
                </div>
              )}
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

        {/* Match Score & Status */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <div className="flex-1 p-4 bg-secondary rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium">Current Status</p>
              <Select
                value={candidate.status?.toUpperCase() || "APPLIED"}
                onValueChange={async (val) => {
                  if (!candidate.applicationId) return;
                  try {
                    await employerService.updateApplicationStatus(
                      candidate.applicationId,
                      { status: val },
                    );
                    setCandidate({ ...candidate, status: val });
                    toast.success(
                      `Candidate status changed to ${val.toLowerCase()}`,
                    );
                  } catch (e) {
                    toast.error("Failed to update status");
                  }
                }}
              >
                <SelectTrigger className="w-36 h-8 text-xs bg-background">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="APPLIED">Applied</SelectItem>
                  <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                  <SelectItem value="INTERVIEWED">Interviewed</SelectItem>
                  <SelectItem value="SELECTED">Selected</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="DEPLOYED">Deployed</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Badge className="text-sm px-3 py-1 shadow-sm capitalize">
              {candidate.status?.toLowerCase() || "Applied"}
            </Badge>
          </div>
          {candidate.matchScore > 0 && (
            <div className="flex-1 p-4 bg-secondary rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">Job Match Score</p>
                <Badge>{candidate.matchScore}%</Badge>
              </div>
              <Progress value={candidate.matchScore} className="h-2" />
            </div>
          )}
        </div>
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
                <p className="text-sm text-muted-foreground">
                  Contact information not available
                </p>
              )}
            </div>
          </motion.div>

          {/* Experience */}
          <motion.div variants={fadeInUp} className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-4">Experience</h2>
            <p className="text-muted-foreground">
              {candidate.experience || "No experience details available"}
            </p>
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
              <p className="text-muted-foreground whitespace-pre-line">
                {candidate.interviewNotes}
              </p>
            </motion.div>
          )}
          {/* Documents Section */}
          {candidate.documents && candidate.documents.length > 0 && (
            <motion.div variants={fadeInUp} className="card-premium p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Download className="w-5 h-5 text-accent" />
                Uploaded Documents
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {candidate.documents.map((doc: any) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-accent/10 flex items-center justify-center text-accent">
                        {doc.category === 'PASSPORT' ? '🛂' : '📄'}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{doc.category}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">{doc.mimeType?.split('/')[1] || 'FILE'}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" download>
                        <Download className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
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
              <Button
                className="w-full gradient-bg-accent text-accent-foreground"
                asChild
              >
                <a href={`mailto:${candidate.email}?subject=Application for ${candidate.position} - Legaforce`}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </a>
              </Button>
              <Button
                className="w-full"
                variant="outline"
                disabled={
                  candidate.status === "SHORTLISTED" ||
                  candidate.status === "INTERVIEWED" ||
                  candidate.status === "SELECTED" ||
                  candidate.status === "DEPLOYED"
                }
                onClick={async () => {
                  if (!candidate.applicationId) return;
                  try {
                    await employerService.updateApplicationStatus(
                      candidate.applicationId,
                      { status: "SHORTLISTED" },
                    );
                    setCandidate({ ...candidate, status: "SHORTLISTED" });
                    toast.success(
                      "Candidate shortlisted. Video interview link generated!",
                    );
                  } catch (e: any) {
                    toast.error("Failed to update status");
                  }
                }}
              >
                {candidate.status === "SHORTLISTED" ||
                  candidate.status === "INTERVIEWED" ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" />{" "}
                    Shortlisted
                  </>
                ) : (
                  "Shortlist & Video Interview"
                )}
              </Button>
              <Button
                className="w-full"
                variant="outline"
                disabled={
                  candidate.status === "SELECTED" ||
                  candidate.status === "DEPLOYED"
                }
                onClick={async () => {
                  if (!candidate.applicationId) return;
                  try {
                    await employerService.updateApplicationStatus(
                      candidate.applicationId,
                      { status: "SELECTED" },
                    );
                    setCandidate({ ...candidate, status: "SELECTED" });
                    toast.success(
                      "Candidate selected. An offer has been generated.",
                    );
                  } catch (e: any) {
                    toast.error("Failed to update status");
                  }
                }}
              >
                {candidate.status === "SELECTED" ||
                  candidate.status === "DEPLOYED" ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" />{" "}
                    Selected
                  </>
                ) : (
                  "Make Offer / Select"
                )}
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => {
                  const cvDoc = candidate.documents?.find((d: any) => d.category === 'CV' || d.category === 'RESUME');
                  if (cvDoc) {
                    window.open(cvDoc.fileUrl, '_blank');
                  } else {
                    toast.success(
                      "Preparing PDF... Use your browser's Print dialog to save.",
                    );
                    setTimeout(() => window.print(), 500);
                  }
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                {candidate.documents?.some((d: any) => d.category === 'CV' || d.category === 'RESUME') ? 'Download PDF CV' : 'Generate CV (Print)'}
              </Button>
            </div>
          </motion.div>

          {/* Rating Section */}
          {["INTERVIEWED", "SELECTED", "PROCESSING", "DEPLOYED"].includes(
            candidate.status?.toUpperCase(),
          ) && (
              <motion.div variants={fadeInUp} className="card-premium p-6">
                <h3 className="font-semibold mb-4">Rate This Applicant</h3>

                {ratingEdit ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Rating
                      </label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() =>
                              setRatingEdit({ ...ratingEdit, rating: star })
                            }
                            className="focus:outline-none transition"
                          >
                            <Star
                              className={`w-6 h-6 cursor-pointer transition ${star <= ratingEdit.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-muted-foreground hover:text-amber-400"
                                }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Review (Optional)
                      </label>
                      <textarea
                        value={ratingEdit.review}
                        onChange={(e) =>
                          setRatingEdit({ ...ratingEdit, review: e.target.value })
                        }
                        placeholder="Share your feedback about this candidate..."
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={async () => {
                          if (ratingEdit.rating < 1 || ratingEdit.rating > 5) {
                            toast.error("Please select a rating");
                            return;
                          }
                          try {
                            setIsSavingRating(true);
                            await employerService.rateApplicant(
                              candidate.id,
                              ratingEdit.rating,
                              ratingEdit.review || undefined,
                            );
                            toast.success("Rating saved successfully");
                            setRatingEdit(null);
                            // Optionally refresh the page
                            const data = await employerService.getCandidate(
                              candidate.id,
                            );
                            setCandidate(data);
                          } catch (error: any) {
                            toast.error(error.message || "Failed to save rating");
                          } finally {
                            setIsSavingRating(false);
                          }
                        }}
                        disabled={isSavingRating}
                      >
                        {isSavingRating && (
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                        )}
                        Save Rating
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setRatingEdit(null)}
                        disabled={isSavingRating}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : candidate.rating > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${star <= candidate.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground"
                              }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold">
                        {candidate.rating}/5
                      </span>
                    </div>
                    {candidate.interviewNotes && (
                      <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                        {candidate.interviewNotes}
                      </p>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full"
                      onClick={() =>
                        setRatingEdit({
                          rating: candidate.rating || 0,
                          review: candidate.interviewNotes || "",
                        })
                      }
                    >
                      Update Rating
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => setRatingEdit({ rating: 0, review: "" })}
                  >
                    Leave a Rating
                  </Button>
                )}
              </motion.div>
            )}

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
