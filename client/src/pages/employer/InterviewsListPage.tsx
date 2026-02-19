import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Video,
  Phone,
  Plus,
  Play,
  Star,
  Share2,
  Loader2,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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

function InterviewsListPage() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [ratingEdit, setRatingEdit] = useState<{
    id: string;
    rating: number;
    notes: string;
  } | null>(null);

  const fetchInterviews = async () => {
    try {
      setIsLoading(true);
      const data = await employerService.getInterviews();
      setInterviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch interviews:", error);
      toast.error("Failed to load interviews");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const filteredInterviews =
    statusFilter === "all"
      ? interviews
      : interviews.filter((i) => i.status === statusFilter);

  const handleSaveRating = async () => {
    if (!ratingEdit) return;
    try {
      await employerService.updateInterviewRating(ratingEdit.id, {
        rating: ratingEdit.rating,
        notes: ratingEdit.notes,
      });
      toast.success("Rating saved successfully");
      setRatingEdit(null);
      fetchInterviews();
    } catch (error) {
      toast.error("Failed to save rating");
    }
  };

  const handleShareFeedback = async (applicationId: string) => {
    try {
      await employerService.shareInterviewFeedback(applicationId);
      toast.success("Feedback shared");
      // Update local state
      setInterviews((prev) =>
        prev.map((i) =>
          i.applicationId === applicationId ? { ...i, feedbackShared: true } : i
        )
      );
    } catch (error) {
      toast.error("Failed to share feedback");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-accent mx-auto mb-3" />
          <p className="text-muted-foreground">Loading interviews...</p>
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
          <h1 className="text-3xl font-display font-bold mb-1">
            Interviews
          </h1>
          <p className="text-muted-foreground">
            Video interviews, ratings, and feedback for shortlisted candidates
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid sm:grid-cols-3 gap-4">
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Interviews</p>
          <p className="text-2xl font-display font-bold">{interviews.length}</p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Scheduled</p>
          <p className="text-2xl font-display font-bold text-blue-600">
            {interviews.filter((i) => i.status === "scheduled").length}
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Completed</p>
          <p className="text-2xl font-display font-bold text-emerald-600">
            {interviews.filter((i) => i.status === "completed").length}
          </p>
        </div>
      </motion.div>

      {/* Filter */}
      <motion.div variants={fadeInUp} className="card-premium p-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Interviews List */}
      <motion.div variants={fadeInUp} className="space-y-4">
        {filteredInterviews.length === 0 ? (
          <div className="card-premium p-12 text-center">
            <UserCheck className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
            <h3 className="font-semibold mb-1">No interviews yet</h3>
            <p className="text-sm text-muted-foreground">
              Interviews will appear here once you shortlist candidates from your job orders.
            </p>
          </div>
        ) : (
          filteredInterviews.map((interview) => (
            <div
              key={interview.id}
              className="card-premium p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">
                    {interview.candidateName}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {interview.position}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4" />
                      {interview.date
                        ? new Date(interview.date).toLocaleDateString()
                        : "Date TBD"}
                    </div>
                    {interview.time && interview.time !== "—" && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4" />
                        {interview.time}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Video className="w-4 h-4" />
                      Video Interview
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className={
                      interview.status === "scheduled"
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                        : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                    }
                  >
                    {interview.status === "scheduled" ? "Scheduled" : "Completed"}
                  </Badge>
                  {interview.status === "scheduled" && interview.videoLink && (
                    <Button
                      size="sm"
                      className="gradient-bg-accent text-accent-foreground"
                      asChild
                    >
                      <a
                        href={interview.videoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Join
                      </a>
                    </Button>
                  )}
                  {interview.status === "completed" && (
                    <>
                      {interview.rating != null && (
                        <span className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          {interview.rating}/5
                        </span>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setRatingEdit({
                            id: interview.applicationId || interview.id,
                            rating: interview.rating ?? 0,
                            notes: interview.notes ?? "",
                          })
                        }
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Rate
                      </Button>
                      <Button
                        size="sm"
                        variant={interview.feedbackShared ? "secondary" : "outline"}
                        onClick={() =>
                          handleShareFeedback(interview.applicationId || interview.id)
                        }
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        {interview.feedbackShared
                          ? "Feedback shared"
                          : "Share feedback"}
                      </Button>
                    </>
                  )}
                </div>
              </div>
              {interview.notes && (
                <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Interview notes:{" "}
                  </span>
                  {interview.notes}
                </div>
              )}
            </div>
          ))
        )}
      </motion.div>

      {/* Record & rate inline form */}
      {ratingEdit && (
        <motion.div
          variants={fadeInUp}
          className="card-premium p-6 border-2 border-accent/30"
        >
          <h3 className="font-semibold mb-3">Record & rate candidate</h3>
          <div className="flex gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <Button
                key={n}
                type="button"
                variant={ratingEdit.rating === n ? "default" : "outline"}
                size="sm"
                onClick={() => setRatingEdit({ ...ratingEdit, rating: n })}
              >
                <Star className="w-4 h-4 mr-1" />
                {n}
              </Button>
            ))}
          </div>
          <Textarea
            placeholder="Interview feedback (shared internally)"
            value={ratingEdit.notes}
            onChange={(e) =>
              setRatingEdit({ ...ratingEdit, notes: e.target.value })
            }
            className="mb-3"
            rows={3}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSaveRating}>
              Save rating & notes
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setRatingEdit(null)}
            >
              Cancel
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default InterviewsListPage;
