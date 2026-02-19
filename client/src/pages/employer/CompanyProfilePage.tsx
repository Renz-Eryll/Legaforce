import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Shield,
  Edit2,
  Save,
  Upload,
  Star,
  CheckCircle2,
  Clock,
  Loader2,
  FileText,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

function CompanyProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);

  // Edit form state
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    phone: "",
    country: "",
  });

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const [profileData, docsData] = await Promise.all([
        employerService.getProfile().catch(() => null),
        employerService.getDocuments().catch(() => []),
      ]);
      setProfile(profileData);
      setDocuments(Array.isArray(docsData) ? docsData : []);
      if (profileData) {
        const p = profileData as any;
        setFormData({
          companyName: p.companyName || "",
          contactPerson: p.contactPerson || "",
          phone: p.phone || "",
          country: p.country || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load company profile");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await employerService.updateProfile(formData);
      toast.success("Company profile updated successfully");
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadDocument = async () => {
    try {
      const formDataObj = new FormData();
      formDataObj.append("name", "Business Registration");
      await employerService.uploadDocument(formDataObj);
      toast.success("Document uploaded");
      fetchProfile();
    } catch (error) {
      toast.error("Failed to upload document");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-accent mx-auto mb-3" />
          <p className="text-muted-foreground">Loading company profile...</p>
        </div>
      </div>
    );
  }

  const trustScore = profile?.trustScore ?? 50;
  const isVerified = profile?.isVerified || profile?.verificationStatus === "approved";

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
            Company Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your company information and verification documents
          </p>
        </div>
        {!isEditing ? (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              className="gradient-bg-accent text-accent-foreground"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                if (profile) {
                  setFormData({
                    companyName: profile.companyName || "",
                    contactPerson: profile.contactPerson || "",
                    phone: profile.phone || "",
                    country: profile.country || "",
                  });
                }
              }}
            >
              Cancel
            </Button>
          </div>
        )}
      </motion.div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <motion.div
              variants={fadeInUp}
              className="lg:col-span-2 card-premium p-6"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-accent" />
                Company Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    Company Name
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData({ ...formData, companyName: e.target.value })
                      }
                    />
                  ) : (
                    <p className="font-medium text-lg">
                      {profile?.companyName || "Not set"}
                    </p>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">
                      <User className="w-3 h-3 inline mr-1" />
                      Contact Person
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.contactPerson}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactPerson: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <p className="font-medium">
                        {profile?.contactPerson || "Not set"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">
                      <Phone className="w-3 h-3 inline mr-1" />
                      Phone
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    ) : (
                      <p className="font-medium">
                        {profile?.phone || "Not set"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">
                      <Globe className="w-3 h-3 inline mr-1" />
                      Country
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.country}
                        onChange={(e) =>
                          setFormData({ ...formData, country: e.target.value })
                        }
                      />
                    ) : (
                      <p className="font-medium">
                        {profile?.country || "Not set"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">
                      <Mail className="w-3 h-3 inline mr-1" />
                      Email
                    </label>
                    <p className="font-medium">{profile?.email || "Not set"}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div variants={fadeInUp} className="space-y-4">
              {/* Trust Score */}
              <div className="card-premium p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-accent" />
                  Trust Score
                </h3>
                <div className="text-center mb-4">
                  <p className="text-4xl font-display font-bold text-accent">
                    {trustScore}
                  </p>
                  <p className="text-sm text-muted-foreground">out of 100</p>
                </div>
                <Progress value={trustScore} className="h-2" />
              </div>

              {/* Verification Status */}
              <div className="card-premium p-6">
                <h3 className="font-semibold mb-4">Verification Status</h3>
                <div className="flex items-center gap-3">
                  {isVerified ? (
                    <>
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      <div>
                        <p className="font-medium text-emerald-600">Verified</p>
                        <p className="text-xs text-muted-foreground">
                          Your company is verified
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Clock className="w-6 h-6 text-amber-500" />
                      <div>
                        <p className="font-medium text-amber-600">
                          Pending Verification
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Upload documents below to verify
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="card-premium p-6">
                <h3 className="font-semibold mb-4">Company Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Hires</span>
                    <span className="font-medium">{profile?.totalHires ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Member Since</span>
                    <span className="font-medium">
                      {profile?.createdAt
                        ? new Date(profile.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </TabsContent>

        {/* Verification Tab */}
        <TabsContent value="verification" className="space-y-6">
          <motion.div variants={fadeInUp} className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-4">Verification Process</h2>
            <div className="space-y-4">
              <div className="p-4 bg-secondary rounded-lg">
                <h3 className="font-medium mb-2">How to get verified</h3>
                <ol className="text-sm text-muted-foreground space-y-2 list-decimal ml-4">
                  <li>Upload your business registration documents</li>
                  <li>Submit proof of POEA/DMW licensing (if applicable)</li>
                  <li>Wait for admin review (typically 2-3 business days)</li>
                  <li>Once verified, your trust score increases automatically</li>
                </ol>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg border">
                {isVerified ? (
                  <>
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    <div>
                      <p className="font-semibold text-emerald-600">
                        Your company is verified! ✓
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Your trust score and visibility are boosted.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Clock className="w-8 h-8 text-amber-500" />
                    <div>
                      <p className="font-semibold text-amber-600">
                        Verification Pending
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Upload your documents in the Documents tab to start verification.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <motion.div variants={fadeInUp} className="card-premium p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Documents</h2>
              <Button variant="outline" onClick={handleUploadDocument}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>
            <div className="space-y-3">
              {documents.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-muted-foreground mb-2">
                    No documents uploaded yet
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Upload your business registration and verification documents
                  </p>
                </div>
              ) : (
                documents.map((doc: any, idx: number) => (
                  <div
                    key={doc.id || idx}
                    className="flex items-center justify-between p-4 bg-secondary rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-accent" />
                      <div>
                        <p className="font-medium text-sm">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Uploaded: {doc.uploadedAt || "Recently"}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        doc.status === "approved"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : doc.status === "rejected"
                            ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                      }
                    >
                      {doc.status === "approved"
                        ? "Approved"
                        : doc.status === "rejected"
                          ? "Rejected"
                          : "Pending"}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

export default CompanyProfilePage;
