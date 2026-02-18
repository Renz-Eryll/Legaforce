import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Video,
  Phone,
  Edit2,
  Trash2,
  Plus,
  Play,
  Star,
  Share2,
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

// Shortlisting & Video Interview: built-in video, record & rate, share feedback internally
const mockInterviews = [
  {
    id: "INT-001",
    candidateName: "Maria Santos",
    position: "Registered Nurse",
    date: "2025-02-10",
    time: "10:00 AM",
    type: "video",
    status: "scheduled",
    videoLink: "https://meet.legaforce.com/int-001",
    rating: null as number | null,
    notes: "",
    feedbackShared: false,
  },
  {
    id: "INT-002",
    candidateName: "John Reyes",
    position: "Registered Nurse",
    date: "2025-02-08",
    time: "2:00 PM",
    type: "video",
    status: "completed",
    videoLink: "https://meet.legaforce.com/int-002",
    rating: 4,
    notes: "Strong technical skills. Good communication.",
    feedbackShared: true,
  },
  {
    id: "INT-003",
    candidateName: "Ana Cruz",
    position: "Staff Nurse",
    date: "2025-02-12",
    time: "11:00 AM",
    type: "video",
    status: "scheduled",
    videoLink: "https://meet.legaforce.com/int-003",
    rating: null,
    notes: "",
    feedbackShared: false,
  },
];

function InterviewsListPage() {
  const [interviews, setInterviews] = useState(mockInterviews);
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingEdit, setRatingEdit] = useState<{ id: string; rating: number; notes: string } | null>(null);

  const filteredInterviews =
    statusFilter === "all"
      ? interviews
      : interviews.filter((i) => i.status === statusFilter);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Header - Shortlisting & Video Interview */}
      <motion.div
        variants={fadeInUp}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-display font-bold mb-1">
            Shortlisting & Video Interview
          </h1>
          <p className="text-muted-foreground">
            Built-in video interview. Record & rate candidates. Share feedback internally.
          </p>
        </div>
        <Button className="gradient-bg-accent text-accent-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Interview
        </Button>
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
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Interviews List */}
      <motion.div variants={fadeInUp} className="space-y-4">
        {filteredInterviews.map((interview) => (
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
                    {new Date(interview.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4" />
                    {interview.time}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {interview.type === "video" ? (
                      <>
                        <Video className="w-4 h-4" />
                        Video Interview
                      </>
                    ) : (
                      <>
                        <Phone className="w-4 h-4" />
                        Phone Interview
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={
                    interview.status === "scheduled"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-emerald-50 text-emerald-700"
                  }
                >
                  {interview.status === "scheduled" ? "Scheduled" : "Completed"}
                </Badge>
                {interview.status === "scheduled" && interview.type === "video" && (
                  <Button size="sm" className="gradient-bg-accent text-accent-foreground" asChild>
                    <a href={(interview as { videoLink?: string }).videoLink} target="_blank" rel="noopener noreferrer">
                      <Play className="w-4 h-4 mr-2" />
                      Join Video Interview
                    </a>
                  </Button>
                )}
                {interview.status === "completed" && (
                  <>
                    {(interview as { rating?: number | null }).rating != null && (
                      <span className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        {(interview as { rating: number }).rating}/5
                      </span>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setRatingEdit({
                          id: interview.id,
                          rating: (interview as { rating?: number }).rating ?? 0,
                          notes: (interview as { notes?: string }).notes ?? "",
                        })
                      }
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Record & rate
                    </Button>
                    <Button
                      size="sm"
                      variant={(interview as { feedbackShared?: boolean }).feedbackShared ? "secondary" : "outline"}
                      onClick={() => {
                        setInterviews((prev) =>
                          prev.map((i) =>
                            i.id === interview.id
                              ? { ...i, feedbackShared: true }
                              : i
                          )
                        );
                      }}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      {(interview as { feedbackShared?: boolean }).feedbackShared
                        ? "Feedback shared"
                        : "Share feedback internally"}
                    </Button>
                  </>
                )}
                {interview.status === "scheduled" && (
                  <>
                    <Button size="sm" variant="outline">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Reschedule
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="w-4 h-4 mr-2 text-red-600" />
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
            {(interview as { notes?: string }).notes && (
              <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Interview notes: </span>
                {(interview as { notes: string }).notes}
              </div>
            )}
          </div>
        ))}
      </motion.div>

      {/* Record & rate modal / inline form - simple inline for completed */}
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
            <Button
              size="sm"
              onClick={() => {
                setInterviews((prev) =>
                  prev.map((i) =>
                    i.id === ratingEdit.id
                      ? {
                          ...i,
                          rating: ratingEdit.rating,
                          notes: ratingEdit.notes,
                        }
                      : i
                  )
                );
                setRatingEdit(null);
              }}
            >
              Save rating & notes
            </Button>
            <Button size="sm" variant="outline" onClick={() => setRatingEdit(null)}>
              Cancel
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default InterviewsListPage;
