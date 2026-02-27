import { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  Image,
  Trash2,
  Eye,
  Download,
  FolderOpen,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  File,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
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

type DocumentItem = {
  id: string;
  name: string;
  type: string;
  category: string;
  size: string;
  uploadedAt: string;
  status: "verified" | "pending" | "expired";
};

const DOCUMENT_CATEGORIES = [
  { id: "passport", label: "Passport / ID", icon: FileText, required: true },
  { id: "resume", label: "Resume / CV", icon: FileText, required: true },
  { id: "medical", label: "Medical Certificate", icon: Shield, required: true },
  { id: "nbi", label: "NBI / Police Clearance", icon: Shield, required: true },
  { id: "diploma", label: "Diploma / Certificates", icon: FileText, required: false },
  { id: "photo", label: "Photo (2x2)", icon: Image, required: true },
  { id: "contract", label: "Employment Contract", icon: File, required: false },
  { id: "other", label: "Other Documents", icon: FolderOpen, required: false },
];

const statusConfig = {
  verified: { label: "Verified", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", icon: CheckCircle },
  pending: { label: "Under Review", color: "bg-amber-500/10 text-amber-500 border-amber-500/20", icon: Clock },
  expired: { label: "Expired", color: "bg-red-500/10 text-red-500 border-red-500/20", icon: AlertCircle },
};

function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([
    // Example documents that would be loaded from API
  ]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (files: FileList | null, category?: string) => {
    if (!files || files.length === 0) return;

    const newDocs: DocumentItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum file size is 10MB.`);
        continue;
      }

      // Validate file type
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg",
        "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported file type.`);
        continue;
      }

      newDocs.push({
        id: `doc-${Date.now()}-${i}`,
        name: file.name,
        type: file.type.includes("image") ? "image" : "document",
        category: category || "other",
        size: `${sizeMB} MB`,
        uploadedAt: new Date().toISOString(),
        status: "pending",
      });
    }

    if (newDocs.length > 0) {
      setDocuments((d) => [...newDocs, ...d]);
      toast.success(`${newDocs.length} document(s) uploaded successfully! They will be reviewed by our team.`);
    }
  };

  const handleDelete = (id: string) => {
    setDocuments((d) => d.filter((doc) => doc.id !== id));
    toast.success("Document removed");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const filteredDocuments = selectedCategory === "all"
    ? documents
    : documents.filter((d) => d.category === selectedCategory);

  const stats = {
    total: documents.length,
    verified: documents.filter((d) => d.status === "verified").length,
    pending: documents.filter((d) => d.status === "pending").length,
    expired: documents.filter((d) => d.status === "expired").length,
  };

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
          <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1">Documents</h1>
          <p className="text-muted-foreground">
            Upload and manage your important documents — passports, certificates, and more.
          </p>
        </div>
      </motion.div>

      {/* Upload Drop Zone */}
      <motion.div variants={fadeInUp}>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center transition-all",
            isDragging
              ? "border-accent bg-accent/5 scale-[1.01]"
              : "border-border hover:border-accent/50 hover:bg-muted/30"
          )}
        >
          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium mb-1">
            {isDragging ? "Drop your files here" : "Drag & drop files here"}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            PDF, JPG, PNG, DOC — Max 10MB per file
          </p>
          <label>
            <Input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
            <Button variant="outline" className="cursor-pointer" asChild>
              <span>
                <Plus className="w-4 h-4 mr-2" />
                Browse Files
              </span>
            </Button>
          </label>
        </div>
      </motion.div>

      {/* Document Categories - Upload Shortcuts */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <h2 className="text-lg font-display font-semibold mb-4">Required Documents</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {DOCUMENT_CATEGORIES.filter((c) => c.required).map((cat) => {
            const hasDoc = documents.some((d) => d.category === cat.id);
            const Icon = cat.icon;
            return (
              <label key={cat.id} className="cursor-pointer">
                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files, cat.id)}
                />
                <div className={cn(
                  "p-4 rounded-xl border-2 border-dashed text-center transition-all hover:border-accent hover:bg-accent/5",
                  hasDoc ? "border-emerald-500/30 bg-emerald-500/5" : "border-border"
                )}>
                  <Icon className={cn(
                    "w-6 h-6 mx-auto mb-2",
                    hasDoc ? "text-emerald-500" : "text-muted-foreground"
                  )} />
                  <p className="text-sm font-medium">{cat.label}</p>
                  {hasDoc ? (
                    <Badge className="mt-2 text-xs bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                      Uploaded
                    </Badge>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1">
                      Click to upload
                    </p>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid sm:grid-cols-4 gap-4">
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Documents</p>
          <p className="text-2xl font-display font-bold">{stats.total}</p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Verified</p>
          <p className="text-2xl font-display font-bold text-emerald-500">{stats.verified}</p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Under Review</p>
          <p className="text-2xl font-display font-bold text-amber-500">{stats.pending}</p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Expired</p>
          <p className="text-2xl font-display font-bold text-red-500">{stats.expired}</p>
        </div>
      </motion.div>

      {/* Documents List */}
      <motion.div variants={fadeInUp} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-display font-semibold">Your Documents</h2>
          <div className="flex gap-2 flex-wrap">
            {["all", ...DOCUMENT_CATEGORIES.map((c) => c.id)].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  selectedCategory === cat
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                {cat === "all" ? "All" : DOCUMENT_CATEGORIES.find((c) => c.id === cat)?.label || cat}
              </button>
            ))}
          </div>
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12 card-premium">
            <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium text-muted-foreground mb-2">No documents uploaded</p>
            <p className="text-sm text-muted-foreground">
              Upload your documents using the area above or click on a required document category.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDocuments.map((doc) => {
              const statusInfo = statusConfig[doc.status];
              const StatusIcon = statusInfo.icon;
              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card-premium p-4 flex items-center gap-4"
                >
                  <div className="p-2 rounded-xl bg-muted">
                    {doc.type === "image" ? (
                      <Image className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{doc.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>{DOCUMENT_CATEGORIES.find((c) => c.id === doc.category)?.label || doc.category}</span>
                      <span>•</span>
                      <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className={cn("text-xs shrink-0", statusInfo.color)}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusInfo.label}
                  </Badge>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default DocumentsPage;
