import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Star,
  MapPin,
  Eye,
  MessageSquare,
  Sparkles,
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

// Smart Candidate Search: by Skills, Experience, Nationality, Availability; AI recommends best-fit
const mockCandidates = [
  {
    id: "CAND-001",
    name: "Maria Santos",
    position: "Registered Nurse",
    location: "Manila, Philippines",
    nationality: "Filipino",
    experience: "5+ years",
    experienceYears: 5,
    rating: 4.8,
    status: "available",
    skills: ["ICU Care", "BLS/CPR", "Patient Care"],
    matched: true,
    aiRecommended: true,
    availability: "immediate",
  },
  {
    id: "CAND-002",
    name: "John Reyes",
    position: "Registered Nurse",
    location: "Cebu, Philippines",
    nationality: "Filipino",
    experience: "3+ years",
    experienceYears: 3,
    rating: 4.5,
    status: "interviewing",
    skills: ["General Ward", "Patient Education"],
    matched: true,
    aiRecommended: true,
    availability: "2_weeks",
  },
  {
    id: "CAND-003",
    name: "Ana Cruz",
    position: "Staff Nurse",
    location: "Davao, Philippines",
    nationality: "Filipino",
    experience: "2+ years",
    experienceYears: 2,
    rating: 4.2,
    status: "available",
    skills: ["Medical-Surgical", "Customer Service"],
    matched: false,
    aiRecommended: false,
    availability: "1_month",
  },
  {
    id: "CAND-004",
    name: "Joseph Tan",
    position: "Registered Nurse",
    location: "Manila, Philippines",
    nationality: "Filipino",
    experience: "7+ years",
    experienceYears: 7,
    rating: 4.9,
    status: "available",
    skills: ["ICU", "Emergency", "Leadership"],
    matched: true,
    aiRecommended: true,
    availability: "immediate",
  },
];

const statusConfig = {
  available: { label: "Available", color: "bg-emerald-50 text-emerald-700" },
  interviewing: { label: "Interviewing", color: "bg-blue-50 text-blue-700" },
  selected: { label: "Selected", color: "bg-purple-50 text-purple-700" },
  deployed: { label: "Deployed", color: "bg-amber-50 text-amber-700" },
};

function CandidatesListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [skillsFilter, setSkillsFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [nationalityFilter, setNationalityFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [showAiOnly, setShowAiOnly] = useState(false);
  const [candidates, setCandidates] = useState(mockCandidates);

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (candidate as { skills?: string[] }).skills?.some((s) =>
        s.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus =
      statusFilter === "all" || candidate.status === statusFilter;
    const matchesSkills =
      skillsFilter === "all" ||
      (candidate as { skills?: string[] }).skills?.includes(skillsFilter);
    const matchesExperience =
      experienceFilter === "all" ||
      (experienceFilter === "0-2" && candidate.experienceYears <= 2) ||
      (experienceFilter === "3-5" && candidate.experienceYears >= 3 && candidate.experienceYears <= 5) ||
      (experienceFilter === "6+" && candidate.experienceYears >= 6);
    const matchesNationality =
      nationalityFilter === "all" || candidate.nationality === nationalityFilter;
    const matchesAvailability =
      availabilityFilter === "all" || candidate.availability === availabilityFilter;
    const matchesAi = !showAiOnly || candidate.aiRecommended;
    return (
      matchesSearch &&
      matchesStatus &&
      matchesSkills &&
      matchesExperience &&
      matchesNationality &&
      matchesAvailability &&
      matchesAi
    );
  });

  const aiRecommendedCandidates = filteredCandidates.filter((c) => c.aiRecommended);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Header - Smart Candidate Search */}
      <motion.div
        variants={fadeInUp}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-display font-bold mb-1">
            Smart Candidate Search
          </h1>
          <p className="text-muted-foreground">
            Search by skills, experience, nationality, availability. AI recommends best-fit.
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
            {candidates.filter((c) => c.status === "available").length}
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
          <span className="font-medium">AI recommends {aiRecommendedCandidates.length} best-fit candidate{aiRecommendedCandidates.length !== 1 ? "s" : ""} for your job orders.</span>
          <Button
            variant={showAiOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAiOnly(!showAiOnly)}
          >
            {showAiOnly ? "Show all" : "Show AI only"}
          </Button>
        </motion.div>
      )}

      {/* Filters: Skills, Experience, Nationality, Availability */}
      <motion.div variants={fadeInUp} className="card-premium p-5">
        <div className="space-y-4">
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
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="interviewing">Interviewing</SelectItem>
                <SelectItem value="selected">Selected</SelectItem>
                <SelectItem value="deployed">Deployed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Select value={skillsFilter} onValueChange={setSkillsFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Skills" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Skills</SelectItem>
                <SelectItem value="ICU Care">ICU Care</SelectItem>
                <SelectItem value="BLS/CPR">BLS/CPR</SelectItem>
                <SelectItem value="Patient Care">Patient Care</SelectItem>
                <SelectItem value="General Ward">General Ward</SelectItem>
                <SelectItem value="Leadership">Leadership</SelectItem>
              </SelectContent>
            </Select>
            <Select value={experienceFilter} onValueChange={setExperienceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Experience</SelectItem>
                <SelectItem value="0-2">0–2 years</SelectItem>
                <SelectItem value="3-5">3–5 years</SelectItem>
                <SelectItem value="6+">6+ years</SelectItem>
              </SelectContent>
            </Select>
            <Select value={nationalityFilter} onValueChange={setNationalityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Nationality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Nationality</SelectItem>
                <SelectItem value="Filipino">Filipino</SelectItem>
              </SelectContent>
            </Select>
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Availability</SelectItem>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="2_weeks">Within 2 weeks</SelectItem>
                <SelectItem value="1_month">Within 1 month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Candidates Table */}
      <motion.div variants={fadeInUp} className="card-premium overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/50">
              <TableHead>Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Nationality</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCandidates.map((candidate) => {
              const statusInfo =
                statusConfig[candidate.status as keyof typeof statusConfig];
              const availabilityLabel =
                candidate.availability === "immediate"
                  ? "Immediate"
                  : candidate.availability === "2_weeks"
                    ? "2 weeks"
                    : "1 month";
              return (
                <TableRow
                  key={candidate.id}
                  className="border-b border-border/50"
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {candidate.name}
                      {candidate.aiRecommended && (
                        <Badge variant="secondary" className="text-xs bg-accent/10 text-accent border-0">
                          <Sparkles className="w-3 h-3 mr-0.5" />
                          AI
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{candidate.position}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {candidate.nationality}
                  </TableCell>
                  <TableCell>{candidate.experience}</TableCell>
                  <TableCell className="text-sm">{availabilityLabel}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-semibold">{candidate.rating}</span>
                    </div>
                  </TableCell>
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
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </motion.div>
    </motion.div>
  );
}

export default CandidatesListPage;
