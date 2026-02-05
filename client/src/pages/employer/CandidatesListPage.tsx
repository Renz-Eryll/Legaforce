import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Star,
  MapPin,
  Award,
  Phone,
  Mail,
  Eye,
  MessageSquare,
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

const mockCandidates = [
  {
    id: "CAND-001",
    name: "Maria Santos",
    position: "Registered Nurse",
    location: "Manila, Philippines",
    experience: "5+ years",
    rating: 4.8,
    status: "available",
    skills: ["ICU Care", "BLS/CPR", "Patient Care"],
    matched: true,
  },
  {
    id: "CAND-002",
    name: "John Reyes",
    position: "Registered Nurse",
    location: "Cebu, Philippines",
    experience: "3+ years",
    rating: 4.5,
    status: "interviewing",
    skills: ["General Ward", "Patient Education"],
    matched: true,
  },
  {
    id: "CAND-003",
    name: "Ana Cruz",
    position: "Staff Nurse",
    location: "Davao, Philippines",
    experience: "2+ years",
    rating: 4.2,
    status: "available",
    skills: ["Medical-Surgical", "Customer Service"],
    matched: false,
  },
  {
    id: "CAND-004",
    name: "Joseph Tan",
    position: "Registered Nurse",
    location: "Manila, Philippines",
    experience: "7+ years",
    rating: 4.9,
    status: "available",
    skills: ["ICU", "Emergency", "Leadership"],
    matched: true,
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
  const [candidates, setCandidates] = useState(mockCandidates);

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || candidate.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
          <h1 className="text-3xl font-display font-bold mb-1">Candidates</h1>
          <p className="text-muted-foreground">Browse and manage candidates</p>
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

      {/* Filters */}
      <motion.div variants={fadeInUp} className="card-premium p-5">
        <div className="flex flex-col gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <Filter className="w-4 h-4 mr-2" />
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
      </motion.div>

      {/* Candidates Table */}
      <motion.div variants={fadeInUp} className="card-premium overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/50">
              <TableHead>Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCandidates.map((candidate) => {
              const statusInfo =
                statusConfig[candidate.status as keyof typeof statusConfig];
              return (
                <TableRow
                  key={candidate.id}
                  className="border-b border-border/50"
                >
                  <TableCell className="font-medium">
                    {candidate.name}
                  </TableCell>
                  <TableCell>{candidate.position}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {candidate.location}
                    </div>
                  </TableCell>
                  <TableCell>{candidate.experience}</TableCell>
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
