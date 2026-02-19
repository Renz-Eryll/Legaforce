import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search,
  Star,
  Eye,
  MessageSquare,
  Sparkles,
  Loader2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

const statusConfig: Record<string, { label: string; color: string }> = {
  applied: { label: "Applied", color: "bg-gray-50 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400" },
  available: { label: "Available", color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" },
  shortlisted: { label: "Shortlisted", color: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400" },
  interviewed: { label: "Interviewed", color: "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400" },
  interviewing: { label: "Interviewing", color: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400" },
  selected: { label: "Selected", color: "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400" },
  deployed: { label: "Deployed", color: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" },
  rejected: { label: "Rejected", color: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400" },
};

function CandidatesListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAiOnly, setShowAiOnly] = useState(false);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setIsLoading(true);
        const data = await employerService.getCandidates();
        setCandidates(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch candidates:", error);
        toast.error("Failed to load candidates");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (candidate.skills || []).some((s: string) =>
        s.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus =
      statusFilter === "all" || candidate.status === statusFilter;
    const matchesAi = !showAiOnly || candidate.aiRecommended;
    return matchesSearch && matchesStatus && matchesAi;
  });

  const aiRecommendedCandidates = filteredCandidates.filter((c) => c.aiRecommended);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-accent mx-auto mb-3" />
          <p className="text-muted-foreground">Loading candidates...</p>
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
            Candidates
          </h1>
          <p className="text-muted-foreground">
            View and manage applicants to your job orders
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-4">
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Candidates</p>
          <p className="text-2xl font-display font-bold">{candidates.length}</p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Matched</p>
          <p className="text-2xl font-display font-bold text-emerald-600">
            {candidates.filter((c) => c.matched).length}
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Available</p>
          <p className="text-2xl font-display font-bold text-blue-600">
            {candidates.filter((c) => c.status === "applied" || c.status === "available").length}
          </p>
        </div>
      </motion.div>

      {/* AI Recommended strip */}
      {aiRecommendedCandidates.length > 0 && (
        <motion.div
          variants={fadeInUp}
          className="flex items-center gap-3 p-4 rounded-lg bg-accent/10 border border-accent/20"
        >
          <Sparkles className="w-5 h-5 text-accent" />
          <span className="font-medium">
            AI recommends {aiRecommendedCandidates.length} best-fit candidate
            {aiRecommendedCandidates.length !== 1 ? "s" : ""} for your job orders.
          </span>
          <Button
            variant={showAiOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAiOnly(!showAiOnly)}
          >
            {showAiOnly ? "Show all" : "Show AI only"}
          </Button>
        </motion.div>
      )}

      {/* Search & Filter */}
      <motion.div variants={fadeInUp} className="card-premium p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, position, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="shortlisted">Shortlisted</SelectItem>
              <SelectItem value="interviewed">Interviewed</SelectItem>
              <SelectItem value="selected">Selected</SelectItem>
              <SelectItem value="deployed">Deployed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Candidates Table */}
      <motion.div variants={fadeInUp} className="card-premium overflow-hidden">
        {filteredCandidates.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
            <h3 className="font-semibold mb-1">No candidates found</h3>
            <p className="text-sm text-muted-foreground">
              {searchTerm
                ? "Try adjusting your search"
                : "Candidates will appear once applicants apply to your job orders"}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/50">
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Nationality</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.map((candidate) => {
                const statusInfo =
                  statusConfig[candidate.status as keyof typeof statusConfig] || statusConfig.applied;
                return (
                  <TableRow
                    key={candidate.id}
                    className="border-b border-border/50"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {candidate.name}
                        {candidate.aiRecommended && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-accent/10 text-accent border-0"
                          >
                            <Sparkles className="w-3 h-3 mr-0.5" />
                            AI
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{candidate.position || "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {candidate.nationality || "—"}
                    </TableCell>
                    <TableCell>{candidate.experience || "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusInfo?.color}>
                        {statusInfo?.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/employer/candidates/${candidate.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </motion.div>
    </motion.div>
  );
}

export default CandidatesListPage;
