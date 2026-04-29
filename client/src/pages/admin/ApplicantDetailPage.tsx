import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Shield,
  ShieldCheck,
  ShieldX,
  Briefcase,
  FileText,
  AlertTriangle,
  User,
  Loader2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload,
  Trash2,
  ExternalLink,
  Plus,
} from "lucide-react";
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
import { adminService } from "@/services/adminService";
import { toast } from "sonner";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const statusColors: Record<string, string> = {
  APPLIED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  SHORTLISTED: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  INTERVIEWED: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  SELECTED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  PROCESSING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  DEPLOYED: "bg-green-500/10 text-green-600 border-green-500/20",
  REJECTED: "bg-red-500/10 text-red-500 border-red-500/20",
};

const complaintStatusColors: Record<string, string> = {
  SUBMITTED: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  UNDER_REVIEW: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  ESCALATED: "bg-red-500/10 text-red-500 border-red-500/20",
  RESOLVED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  CLOSED: "bg-slate-500/10 text-slate-500 border-slate-500/20",
};

const DOCUMENT_CATEGORIES = [
  { value: "PASSPORT", label: "Passport", icon: "🛂" },
  { value: "CLEARANCE", label: "Clearance", icon: "🛡️" },
  { value: "MEDICAL", label: "Medical", icon: "🏥" },
  { value: "VISA", label: "Visa", icon: "🛂" },
  { value: "CV", label: "CV/Resume", icon: "📄" },
  { value: "OTHER", label: "Other", icon: "📁" },
];

function ApplicantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [applicant, setApplicant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  
  // Documents state
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState("PASSPORT");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchApplicant = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const response = await adminService.getApplicantDetail(id);
        setApplicant(response.data);
      } catch (error) {
        toast.error("Failed to load applicant details");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicant();
  }, [id]);

  // Load documents
  useEffect(() => {
    const fetchDocs = async () => {
      if (!applicant?.id) return;
      try {
        setIsLoadingDocs(true);
        const response = await adminService.getProfileDocuments(applicant.id);
        setDocuments(response.data || []);
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      } finally {
        setIsLoadingDocs(false);
      }
    };
    fetchDocs();
  }, [applicant?.id]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !applicant?.id) return;

    try {
      setIsUploading(true);
      await adminService.uploadProfileDocument(applicant.id, file, uploadCategory);
      toast.success(`${file.name} uploaded successfully`);
      
      // Refresh list
      const response = await adminService.getProfileDocuments(applicant.id);
      setDocuments(response.data || []);
    } catch (error) {
      toast.error("Failed to upload document");
      console.error(error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteDoc = async (docId: string, fileName: string) => {
    if (!confirm(`Delete "${fileName}"?`)) return;
    try {
      await adminService.deleteProfileDocument(docId);
      setDocuments(documents.filter((d: any) => d.id !== docId));
      toast.success("Document deleted");
    } catch (error) {
      toast.error("Failed to delete document");
      console.error(error);
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const handleToggleActive = async () => {
    if (!applicant?.user?.id) return;
    try {
      setIsToggling(true);
      const response = await adminService.toggleUserActive(applicant.user.id);
      setApplicant((prev: any) => ({
        ...prev,
        user: { ...prev.user, isActive: response.data.isActive },
      }));
      toast.success(
        response.data.isActive ? "Account activated" : "Account suspended",
      );
    } catch {
      toast.error("Failed to toggle account status");
    } finally {
      setIsToggling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading applicant details...</p>
        </div>
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <User className="w-16 h-16 text-muted-foreground mb-4" />
        <p className="text-lg font-semibold mb-2">Applicant Not Found</p>
        <p className="text-muted-foreground mb-6">
          The applicant you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate("/admin/applicants")} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Applicants
        </Button>
      </div>
    );
  }

  const isActive = applicant.user?.isActive;
  const isEmailVerified = applicant.user?.isEmailVerified;

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Back Button */}
      <motion.div variants={fadeInUp}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/applicants")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Applicants
        </Button>
      </motion.div>

      {/* Profile Header */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {applicant.firstName?.charAt(0)}
              {applicant.lastName?.charAt(0)}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-display font-bold mb-1">
                  {applicant.firstName} {applicant.lastName}
                </h1>
                <p className="text-muted-foreground">Applicant Profile</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className={
                    isActive
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : "bg-red-500/10 text-red-500 border-red-500/20"
                  }
                >
                  {isActive ? (
                    <ShieldCheck className="w-3 h-3 mr-1" />
                  ) : (
                    <ShieldX className="w-3 h-3 mr-1" />
                  )}
                  {isActive ? "Active" : "Suspended"}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    isEmailVerified
                      ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                      : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  }
                >
                  <Mail className="w-3 h-3 mr-1" />
                  {isEmailVerified ? "Email Verified" : "Unverified"}
                </Badge>
              </div>
            </div>

            {/* Contact Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{applicant.user?.email || "-"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span>{applicant.phone || "-"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span>{applicant.nationality || "-"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span>
                  Joined{" "}
                  {applicant.user?.createdAt
                    ? new Date(applicant.user.createdAt).toLocaleDateString()
                    : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border/50">
          <div className="text-center p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
            <p className="text-2xl font-bold text-blue-500">
              {applicant._count?.applications || 0}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Applications</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
            <p className="text-2xl font-bold text-amber-500">
              {applicant._count?.complaints || 0}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Complaints</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
            <p className="text-2xl font-bold text-purple-500">
              {applicant.trustScore || 0}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Trust Score</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
            <p className="text-2xl font-bold text-emerald-500">
              {applicant.rewardPoints || 0}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Reward Points</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeInUp}>
        <Tabs defaultValue="applications" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted p-1">
            <TabsTrigger value="applications">
              <Briefcase className="w-4 h-4 mr-2" />
              Applications ({applicant.applications?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="documents">
              <FileText className="w-4 h-4 mr-2" />
              Documents ({documents.length})
            </TabsTrigger>
            <TabsTrigger value="complaints">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Complaints ({applicant.complaints?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="actions">
              <Shield className="w-4 h-4 mr-2" />
              Admin Actions
            </TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications" className="card-premium mt-4">
            {applicant.applications?.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Position</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applied</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applicant.applications.map((app: any) => (
                      <TableRow key={app.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {app.jobOrder?.title || "Unknown"}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {app.jobOrder?.employer?.companyName || "-"}
                        </TableCell>
                        <TableCell className="text-sm">
                          {app.jobOrder?.location || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              statusColors[app.status] || statusColors.APPLIED
                            }
                          >
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Briefcase className="w-12 h-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No applications yet</p>
              </div>
            )}
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="card-premium mt-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent" />
                Applicant Documents
              </h3>
              <div className="flex items-center gap-3">
                <Select value={uploadCategory} onValueChange={setUploadCategory}>
                  <SelectTrigger className="w-36 h-9">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  {isUploading ? "Uploading..." : "Add Document"}
                </Button>
              </div>
            </div>

            {isLoadingDocs ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="text-muted-foreground">No documents uploaded yet.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {documents.map((doc) => {
                  const cat = DOCUMENT_CATEGORIES.find(c => c.value === doc.category);
                  return (
                    <div key={doc.id} className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50 group hover:border-accent/30 transition-all">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{doc.fileName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                            {cat?.label || doc.category}
                          </span>
                          <span className="text-[10px] text-muted-foreground">•</span>
                          <span className="text-[10px] text-muted-foreground">{formatFileSize(doc.fileSize)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a href={doc.fileUrl} target="_blank" rel="noreferrer">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </a>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-500/10" onClick={() => handleDeleteDoc(doc.id, doc.fileName)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Complaints Tab */}
          <TabsContent value="complaints" className="card-premium mt-4">
            {applicant.complaints?.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Filed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applicant.complaints.map((c: any) => (
                      <TableRow key={c.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {c.category?.replace(/_/g, " ")}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                          {c.description}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              complaintStatusColors[c.status] ||
                              complaintStatusColors.SUBMITTED
                            }
                          >
                            {c.status?.replace(/_/g, " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <AlertTriangle className="w-12 h-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No complaints filed</p>
              </div>
            )}
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions" className="card-premium mt-4 p-6">
            <h3 className="text-lg font-semibold mb-4">Admin Actions</h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleToggleActive}
                disabled={isToggling}
              >
                {isToggling ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : isActive ? (
                  <ToggleRight className="w-4 h-4 mr-2 text-red-500" />
                ) : (
                  <ToggleLeft className="w-4 h-4 mr-2 text-emerald-500" />
                )}
                {isActive ? "Suspend Account" : "Activate Account"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

export default ApplicantDetailPage;
