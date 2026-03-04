import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminService } from "@/services/adminService";
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

function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetail = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const response = await adminService.getUserDetail(id);
        setUser(response.data);
      } catch (error) {
        toast.error("Failed to load user details");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">User not found</p>
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
              src={
                user.avatar ||
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
              }
              alt={`${user.firstName} ${user.lastName}`}
              className="w-24 h-24 rounded-xl object-cover"
            />

            {/* User Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-display font-bold mb-1">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-muted-foreground">
                    {user.bio || "No bio provided"}
                  </p>
                </div>
                <Badge className="w-fit bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {user.verificationStatus || "pending"}
                </Badge>
              </div>

              {/* Contact Info */}
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{user.phone || "-"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{user.address || "-"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Trust & Rewards */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <Badge>{user.verificationStatus}</Badge>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                  <p className="text-sm text-muted-foreground mb-1">
                    Account Type
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">
                      {user.userType || "applicant"}
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
        <Tabs defaultValue="applications" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted p-1">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications" className="p-6">
            <h3 className="text-lg font-semibold mb-4">Job Applications</h3>
            <div className="space-y-4">
              {user.applications && user.applications.length > 0 ? (
                user.applications.map((app: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-muted/50 border border-border/50"
                  >
                    <h4 className="font-semibold">{app.position}</h4>
                    <p className="text-sm text-muted-foreground">
                      {app.employer || "Unknown Employer"}
                    </p>
                    <Badge className="mt-2">{app.status}</Badge>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No applications yet</p>
              )}
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-3">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {user.skills && user.skills.length > 0 ? (
                  user.skills.map((skill: string, idx: number) => (
                    <Badge key={idx} variant="secondary">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground">No skills listed</p>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="p-6">
            <h3 className="text-lg font-semibold mb-4">Uploaded Documents</h3>
            <div className="space-y-3">
              {user.documents && user.documents.length > 0 ? (
                user.documents.map((doc: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-muted/50 border border-border/50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {doc.name || doc.documentType}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      verified
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No documents uploaded</p>
              )}
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
