import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Phone,
  Edit2,
  Trash2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const mockInterviews = [
  {
    id: "INT-001",
    candidateName: "Maria Santos",
    position: "Registered Nurse",
    date: "2025-02-10",
    time: "10:00 AM",
    type: "video",
    status: "scheduled",
  },
  {
    id: "INT-002",
    candidateName: "John Reyes",
    position: "Registered Nurse",
    date: "2025-02-08",
    time: "2:00 PM",
    type: "video",
    status: "completed",
  },
  {
    id: "INT-003",
    candidateName: "Ana Cruz",
    position: "Staff Nurse",
    date: "2025-02-12",
    time: "11:00 AM",
    type: "phone",
    status: "scheduled",
  },
];

function InterviewsListPage() {
  const [interviews, setInterviews] = useState(mockInterviews);
  const [statusFilter, setStatusFilter] = useState("all");

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
      {/* Header */}
      <motion.div
        variants={fadeInUp}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-display font-bold mb-1">Interviews</h1>
          <p className="text-muted-foreground">Manage candidate interviews</p>
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
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
              <div className="flex flex-col gap-2">
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
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default InterviewsListPage;
