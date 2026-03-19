import { useState, useEffect } from "react";
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
