import { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Trash2,
  Eye,
  Download,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const mockDocuments = [
  {
    id: "DOC-001",
    name: "Nursing License",
    type: "License",
    status: "verified",
    uploadDate: "2025-01-10",
    expiryDate: "2026-01-10",
    daysRemaining: 345,
    size: "2.4 MB",
  },
  {
    id: "DOC-002",
    name: "BLS/CPR Certification",
    type: "Certification",
    status: "verified",
    uploadDate: "2024-12-15",
    expiryDate: "2026-12-15",
    daysRemaining: 710,
    size: "1.8 MB",
  },
  {
    id: "DOC-003",
    name: "Bachelor of Science in Nursing",
    type: "Education",
    status: "verified",
    uploadDate: "2025-01-05",
    expiryDate: "2099-12-31",
    daysRemaining: 27319,
    size: "3.1 MB",
  },
  {
    id: "DOC-004",
    name: "Work Experience Certificate",
    type: "Employment",
    status: "pending",
    uploadDate: "2025-01-15",
    expiryDate: "2026-01-15",
    daysRemaining: 355,
    size: "1.2 MB",
  },
  {
    id: "DOC-005",
    name: "Passport Copy",
    type: "Identification",
    status: "verified",
    uploadDate: "2024-11-20",
    expiryDate: "2034-11-20",
    daysRemaining: 3652,
    size: "0.8 MB",
  },
  {
    id: "DOC-006",
    name: "Medical Clearance",
    type: "Medical",
    status: "expiring-soon",
    uploadDate: "2024-12-01",
    expiryDate: "2025-03-01",
    daysRemaining: 45,
    size: "2.0 MB",
  },
];

const statusConfig = {
  verified: {
    label: "Verified",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle,
    iconColor: "text-emerald-600",
  },
  pending: {
    label: "Pending Review",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Clock,
    iconColor: "text-blue-600",
  },
  "expiring-soon": {
    label: "Expiring Soon",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: AlertCircle,
    iconColor: "text-amber-600",
  },
};

function DocumentsPage() {
  const [documents, setDocuments] = useState(mockDocuments);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);

  const handleDelete = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
  };

  const toggleSelect = (id: string) => {
    setSelectedDocs((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
    );
  };

  const requiredDocs = [
    "Nursing License",
    "BLS/CPR Certification",
    "Passport Copy",
  ];
  const uploadedRequired = documents.filter((d) =>
    requiredDocs.includes(d.name),
  ).length;

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
          <h1 className="text-3xl font-display font-bold mb-1">Documents</h1>
          <p className="text-muted-foreground">
            Manage your professional documents
          </p>
        </div>
        <Button className="gradient-bg-accent text-accent-foreground">
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </motion.div>

      {/* Progress */}
      <motion.div variants={fadeInUp} className="grid sm:grid-cols-3 gap-4">
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-2">
            Documents Uploaded
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-display font-bold">
              {documents.length}
            </p>
            <p className="text-xs text-muted-foreground">
              / {requiredDocs.length} required
            </p>
          </div>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-2">Verified</p>
          <p className="text-3xl font-display font-bold">
            {documents.filter((d) => d.status === "verified").length}
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-2">Expiring Soon</p>
          <p className="text-3xl font-display font-bold text-amber-600">
            {documents.filter((d) => d.status === "expiring-soon").length}
          </p>
        </div>
      </motion.div>

      {/* Documents Table */}
      <motion.div variants={fadeInUp} className="card-premium overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/50">
              <TableHead className="w-12">
                <input type="checkbox" className="rounded" />
              </TableHead>
              <TableHead>Document</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Days Remaining</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => {
              const statusInfo =
                statusConfig[doc.status as keyof typeof statusConfig];
              const StatusIcon = statusInfo?.icon || Clock;

              return (
                <TableRow key={doc.id} className="border-b border-border/50">
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedDocs.includes(doc.id)}
                      onChange={() => toggleSelect(doc.id)}
                      className="rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      {doc.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {doc.type}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${statusInfo?.color} border`}
                    >
                      <StatusIcon
                        className={`w-3 h-3 mr-1 ${statusInfo?.iconColor}`}
                      />
                      {statusInfo?.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(doc.uploadDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(doc.expiryDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-sm font-medium ${
                        doc.daysRemaining < 90 ? "text-amber-600" : ""
                      }`}
                    >
                      {doc.daysRemaining}d
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </motion.div>

      {/* Upload Area */}
      <motion.div variants={fadeInUp} className="card-premium p-8">
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent/50 transition-colors cursor-pointer">
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-1">Drop documents here</h3>
          <p className="text-sm text-muted-foreground mb-4">
            or click to browse (PDF, PNG, JPG, max 5MB)
          </p>
          <Button variant="outline">Browse Files</Button>
        </div>
      </motion.div>

      {/* Info */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <h3 className="font-semibold mb-4">Required Documents</h3>
        <ul className="space-y-3">
          {requiredDocs.map((doc, idx) => {
            const isUploaded = documents.some((d) => d.name === doc);
            return (
              <li key={idx} className="flex items-center gap-3">
                {isUploaded ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                )}
                <span className={isUploaded ? "" : "text-muted-foreground"}>
                  {doc}
                </span>
              </li>
            );
          })}
        </ul>
      </motion.div>
    </motion.div>
  );
}

export default DocumentsPage;
