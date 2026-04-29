import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Globe,
  User,
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  Plane,
  Stethoscope,
  FileCheck,
  Shield,
  Loader2,
  XCircle,
  CheckCircle,
  Clock,
  Save,
  ArrowRight,
  Receipt,
  Upload,
  File,
  Trash2,
  FileText,
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

const COMPLIANCE_STATUSES = [
  "PENDING",
  "IN_PROGRESS",
  "APPROVED",
  "REJECTED",
  "EXPIRED",
];

const DOCUMENT_CATEGORIES = [
  { value: "PASSPORT", label: "Passport", icon: "🛂" },
  { value: "CLEARANCE", label: "Clearance", icon: "🛡️" },
  { value: "MEDICAL", label: "Medical", icon: "🏥" },
  { value: "VISA", label: "Visa", icon: "🛂" },
  { value: "OEC", label: "OEC", icon: "📋" },
  { value: "FLIGHT", label: "Flight", icon: "✈️" },
  { value: "CONTRACT", label: "Contract", icon: "📝" },
  { value: "OTHER", label: "Other", icon: "📁" },
];

const getComplianceBadge = (status: string) => {
  const configs: Record<string, string> = {
    PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    IN_PROGRESS: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    APPROVED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    REJECTED: "bg-red-500/10 text-red-500 border-red-500/20",
    EXPIRED: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  };
  return configs[status] || configs.PENDING;
};

function DeploymentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deployment, setDeployment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);

  // Editable fields
  const [medicalStatus, setMedicalStatus] = useState("");
  const [medicalExpiryDate, setMedicalExpiryDate] = useState("");
  const [visaStatus, setVisaStatus] = useState("");
  const [visaExpiryDate, setVisaExpiryDate] = useState("");
  const [oecStatus, setOecStatus] = useState("");
  const [oecNumber, setOecNumber] = useState("");
  const [flightDate, setFlightDate] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");

  // Document upload state
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState("MEDICAL");

  useEffect(() => {
    const fetchDeployment = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const response = await adminService.getDeploymentDetail(id);
        const d = response.data;
        setDeployment(d);
        setMedicalStatus(d.medicalStatus || "PENDING");
        setMedicalExpiryDate(d.medicalExpiryDate?.split("T")[0] || "");
        setVisaStatus(d.visaStatus || "PENDING");
        setVisaExpiryDate(d.visaExpiryDate?.split("T")[0] || "");
        setOecStatus(d.oecStatus || "PENDING");
        setOecNumber(d.oecNumber || "");
        setFlightDate(d.flightDate?.split("T")[0] || "");
        setArrivalDate(d.arrivalDate?.split("T")[0] || "");
      } catch (error) {
        toast.error("Failed to load deployment details");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeployment();
  }, [id]);

  // Load documents
  useEffect(() => {
    const fetchDocs = async () => {
      if (!id) return;
      try {
        setIsLoadingDocs(true);
        const response = await adminService.getDeploymentDocuments(id);
        setDocuments(response.data || []);
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      } finally {
        setIsLoadingDocs(false);
      }
    };
    fetchDocs();
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    try {
      setIsSaving(true);
      await adminService.updateDeploymentStatus(id, {
        medicalStatus,
        medicalExpiryDate: medicalExpiryDate || null,
        visaStatus,
        visaExpiryDate: visaExpiryDate || null,
        oecStatus,
        oecNumber: oecNumber || null,
        flightDate: flightDate || null,
        arrivalDate: arrivalDate || null,
      });
      toast.success("Deployment updated successfully");
      // Refresh
      const response = await adminService.getDeploymentDetail(id);
      setDeployment(response.data);
    } catch (error) {
      toast.error("Failed to update deployment");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateInvoice = async () => {
    if (!id) return;
    try {
      setIsGeneratingInvoice(true);
      await adminService.generateInvoice(id);
      toast.success("Invoice generated successfully!");
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to generate invoice";
      toast.error(message);
      console.error(error);
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;

    try {
      setIsUploading(true);

      await adminService.uploadDeploymentDocument(id, file, uploadCategory);

      toast.success(`${file.name} uploaded successfully`);

      // Refresh document list
      const response = await adminService.getDeploymentDocuments(id);
      setDocuments(response.data || []);
    } catch (error) {
      toast.error("Failed to upload document");
      console.error(error);
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteDoc = async (docId: string, fileName: string) => {
    if (!confirm(`Delete "${fileName}"?`)) return;
    try {
      await adminService.deleteDeploymentDocument(docId);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!deployment) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <XCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Deployment not found</p>
        <Link to="/admin/deployments" className="mt-4">
          <Button variant="outline">Back to Deployments</Button>
        </Link>
      </div>
    );
  }

  const applicant = deployment.application?.applicant;
  const jobOrder = deployment.application?.jobOrder;
  const employer = jobOrder?.employer;

  const allApproved =
    medicalStatus === "APPROVED" &&
    visaStatus === "APPROVED" &&
    oecStatus === "APPROVED";

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
        className="flex flex-col sm:flex-row sm:items-center gap-4"
      >
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-display font-bold">
            Deployment Tracker ✈️
          </h1>
          <p className="text-sm text-muted-foreground font-mono">
            {deployment.id}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleGenerateInvoice}
            disabled={isGeneratingInvoice}
            variant="outline"
          >
            {isGeneratingInvoice ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Receipt className="w-4 h-4 mr-2" />
            )}
            Generate Invoice
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="gradient-bg-accent text-accent-foreground"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </motion.div>

      {/* Worker & Job Summary */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div variants={fadeInUp} className="card-premium p-6">
          <h3 className="font-display font-semibold flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-blue-500" />
            Worker Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Name</span>
              <span className="text-sm font-medium">
                {applicant?.firstName} {applicant?.lastName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Nationality</span>
              <span className="text-sm font-medium">
                {applicant?.nationality || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Phone</span>
              <span className="text-sm font-medium">
                {applicant?.phone || "N/A"}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="card-premium p-6">
          <h3 className="font-display font-semibold flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-purple-500" />
            Job & Employer
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Position</span>
              <span className="text-sm font-medium">
                {jobOrder?.title || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Employer</span>
              <span className="text-sm font-medium">
                {employer?.companyName || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Location</span>
              <span className="text-sm font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {jobOrder?.location || "N/A"}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Compliance Status Overview */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" />
            Compliance Status Overview
          </h3>
          {allApproved && (
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
              <CheckCircle className="w-3 h-3 mr-1" />
              All Approved — Ready for Deployment
            </Badge>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Medical */}
          <div className="p-5 rounded-2xl border bg-gradient-to-br from-rose-500/5 to-transparent">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-rose-500/10">
                <Stethoscope className="w-5 h-5 text-rose-500" />
              </div>
              <h4 className="font-semibold">Medical</h4>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Status
                </label>
                <Select value={medicalStatus} onValueChange={setMedicalStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPLIANCE_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Expiry Date
                </label>
                <Input
                  type="date"
                  value={medicalExpiryDate}
                  onChange={(e) => setMedicalExpiryDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Visa */}
          <div className="p-5 rounded-2xl border bg-gradient-to-br from-blue-500/5 to-transparent">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-blue-500/10">
                <Globe className="w-5 h-5 text-blue-500" />
              </div>
              <h4 className="font-semibold">Visa</h4>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Status
                </label>
                <Select value={visaStatus} onValueChange={setVisaStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPLIANCE_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Expiry Date
                </label>
                <Input
                  type="date"
                  value={visaExpiryDate}
                  onChange={(e) => setVisaExpiryDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* OEC */}
          <div className="p-5 rounded-2xl border bg-gradient-to-br from-emerald-500/5 to-transparent">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-emerald-500/10">
                <FileCheck className="w-5 h-5 text-emerald-500" />
              </div>
              <h4 className="font-semibold">OEC</h4>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Status
                </label>
                <Select value={oecStatus} onValueChange={setOecStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPLIANCE_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  OEC Number
                </label>
                <Input
                  placeholder="Enter OEC number"
                  value={oecNumber}
                  onChange={(e) => setOecNumber(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Flight Information */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <h3 className="font-display font-semibold flex items-center gap-2 mb-4">
          <Plane className="w-5 h-5 text-accent" />
          Flight Information
        </h3>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-muted-foreground block mb-2">
              Flight Date
            </label>
            <Input
              type="date"
              value={flightDate}
              onChange={(e) => setFlightDate(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground block mb-2">
              Arrival Date
            </label>
            <Input
              type="date"
              value={arrivalDate}
              onChange={(e) => setArrivalDate(e.target.value)}
            />
          </div>
        </div>
      </motion.div>

      {/* Deployment Documents */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            Deployment Documents
          </h3>
          <Badge variant="secondary">{documents.length} file(s)</Badge>
        </div>

        {/* Upload Area */}
        <div className="p-5 rounded-2xl border-2 border-dashed border-border/60 bg-muted/20 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 w-full sm:w-auto">
              <p className="text-sm font-medium mb-2">Upload New Document</p>
              <div className="flex gap-3">
                <Select value={uploadCategory} onValueChange={setUploadCategory}>
                  <SelectTrigger className="w-40">
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
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex-1 sm:flex-none"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  {isUploading ? "Uploading..." : "Choose File"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Accepted: PDF, DOC, DOCX, JPG, PNG (max 10MB)
              </p>
            </div>
          </div>
        </div>

        {/* Document List */}
        {isLoadingDocs ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-8">
            <File className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              No documents uploaded yet. Use the form above to add compliance files.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc: any) => {
              const cat = DOCUMENT_CATEGORIES.find(c => c.value === doc.category);
              return (
                <div
                  key={doc.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-accent/30 transition-colors"
                >
                  <div className="p-2.5 rounded-lg bg-accent/10 shrink-0">
                    <FileText className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {doc.fileName}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {cat?.icon} {cat?.label || doc.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(doc.fileSize)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-500/10 shrink-0"
                    onClick={() => handleDeleteDoc(doc.id, doc.fileName)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Created / Updated */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <h3 className="font-display font-semibold flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-muted-foreground" />
          Record Info
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Created</p>
            <p className="text-sm font-medium">
              {new Date(deployment.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Last Updated</p>
            <p className="text-sm font-medium">
              {new Date(deployment.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default DeploymentDetailPage;

