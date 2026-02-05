import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import {
  ChevronLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Download,
  Shield,
  CheckCircle,
  AlertCircle,
  Award,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

// Mock user data
const mockUser = {
  id: "APP001",
  name: "Maria Santos",
  email: "maria@email.com",
  phone: "+63 917 123 4567",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
  location: "Manila, Philippines",
  joinDate: "Jan 15, 2026",
  status: "verified",
  trustScore: 92,
  rewardPoints: 450,
  bio: "Experienced nurse with 5 years of healthcare industry experience.",
  employment: [
    {
      company: "St. Luke's Medical Center",
      position: "RN - ICU",
      duration: "2021 - Present",
    },
    {
      company: "Philippine General Hospital",
      position: "RN - Emergency",
      duration: "2019 - 2021",
    },
  ],
  skills: [
    "Nursing",
    "Patient Care",
    "ICU Experience",
    "Medical Documentation",
  ],
  certifications: [
    { name: "RN License", number: "RN-2019-12345", status: "active" },
    { name: "BLS Certification", number: "BLS-2025", status: "active" },
  ],
  applications: [
    {
      id: "APP-2401",
      position: "Nurse (ICU)",
      employer: "ABC Healthcare",
      status: "deployed",
      date: "Jan 25, 2026",
    },
    {
      id: "APP-2402",
      position: "Nurse (General)",
      employer: "Gulf Medical Center",
      status: "selected",
      date: "Jan 20, 2026",
    },
  ],
  ratings: [
    {
      rater: "ABC Healthcare",
      rating: 5,
      comment: "Excellent nurse, very professional",
    },
  ],
  documents: [
    { name: "Passport", status: "verified", uploadDate: "Jan 10, 2026" },
    {
      name: "Medical Certificate",
      status: "verified",
      uploadDate: "Jan 12, 2026",
    },
    { name: "NBI Clearance", status: "verified", uploadDate: "Jan 14, 2026" },
  ],
};

function UserDetailsPage() {
  const { id } = useParams();

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
      </motion.div>

      {/* Profile Card */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Avatar */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-6 flex-1">
            <img
              src={mockUser.avatar}
              alt={mockUser.name}
              className="w-24 h-24 rounded-xl object-cover"
            />

            {/* User Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-display font-bold mb-1">
                    {mockUser.name}
                  </h1>
                  <p className="text-muted-foreground">{mockUser.bio}</p>
                </div>
                <Badge className="w-fit bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {mockUser.status}
                </Badge>
              </div>

              {/* Contact Info */}
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{mockUser.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{mockUser.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{mockUser.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Joined {mockUser.joinDate}</span>
                </div>
              </div>

              {/* Trust & Rewards */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                  <p className="text-sm text-muted-foreground mb-1">
                    Trust Score
                  </p>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span className="text-lg font-bold">
                      {mockUser.trustScore}
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                  <p className="text-sm text-muted-foreground mb-1">
                    Reward Points
                  </p>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 fill-purple-500 text-purple-500" />
                    <span className="text-lg font-bold">
                      {mockUser.rewardPoints}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeInUp} className="card-premium">
        <Tabs defaultValue="employment" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-muted p-1">
            <TabsTrigger value="employment">Employment</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="ratings">Ratings</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          {/* Employment Tab */}
          <TabsContent value="employment" className="p-6">
            <h3 className="text-lg font-semibold mb-4">Employment History</h3>
            <div className="space-y-4">
              {mockUser.employment.map((emp, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-muted/50 border border-border/50"
                >
                  <h4 className="font-semibold">{emp.position}</h4>
                  <p className="text-sm text-muted-foreground">{emp.company}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {emp.duration}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-3">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {mockUser.skills.map((skill, idx) => (
                  <Badge key={idx} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="p-6">
            <h3 className="text-lg font-semibold mb-4">Applications</h3>
            <div className="space-y-3">
              {mockUser.applications.map((app) => (
                <div
                  key={app.id}
                  className="p-4 rounded-lg bg-muted/50 border border-border/50 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-semibold">{app.position}</h4>
                    <p className="text-sm text-muted-foreground">
                      {app.employer}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {app.date}
                    </span>
                    <Badge
                      className={
                        app.status === "deployed"
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                      }
                    >
                      {app.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="p-6">
            <h3 className="text-lg font-semibold mb-4">Documents</h3>
            <div className="space-y-3">
              {mockUser.documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-muted/50 border border-border/50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Uploaded {doc.uploadDate}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {doc.status}
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Ratings Tab */}
          <TabsContent value="ratings" className="p-6">
            <h3 className="text-lg font-semibold mb-4">Employer Ratings</h3>
            <div className="space-y-3">
              {mockUser.ratings.map((rating, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-muted/50 border border-border/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold">{rating.rater}</p>
                    <div className="flex gap-1">
                      {[...Array(rating.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-amber-500 text-amber-500"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {rating.comment}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions" className="p-6">
            <h3 className="text-lg font-semibold mb-4">Admin Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Verify Account
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <AlertCircle className="w-4 h-4 mr-2" />
                Flag Suspicious Activity
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Download Profile
              </Button>
              <Button variant="destructive" className="w-full justify-start">
                <AlertCircle className="w-4 h-4 mr-2" />
                Suspend Account
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

export default UserDetailsPage;
