import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Building2,
  Calendar,
  DollarSign,
  Download,
  CheckCircle,
  XCircle,
  Loader2,
  Clock,
  CreditCard,
  Receipt,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const getStatusBadge = (status: string) => {
  const configs: Record<string, string> = {
    PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    PAID: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    OVERDUE: "bg-red-500/10 text-red-500 border-red-500/20",
    CANCELLED: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    DRAFT: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    SENT: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    DISPUTED: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  };
  return configs[status] || configs.PENDING;
};

function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const response = await adminService.getInvoiceDetail(id);
        setInvoice(response.data);
      } catch (error) {
        toast.error("Failed to load invoice details");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;
    try {
      setIsUpdating(true);
      await adminService.updateInvoiceStatus(id, newStatus);
      const response = await adminService.getInvoiceDetail(id);
      setInvoice(response.data);
      toast.success(`Invoice status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update invoice status");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <XCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Invoice not found</p>
        <Link to="/admin/invoices" className="mt-4">
          <Button variant="outline">Back to Invoices</Button>
        </Link>
      </div>
    );
  }

  const lineItems = invoice.lineItems?.items || [];
  const isOverdue =
    invoice.status !== "PAID" && new Date(invoice.dueDate) < new Date();

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
            Invoice {invoice.invoiceNumber}
          </h1>
          <p className="text-sm text-muted-foreground font-mono">
            {invoice.id}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Badge
            variant="outline"
            className={`text-sm px-3 py-1 ${getStatusBadge(invoice.status)}`}
          >
            {invoice.status}
          </Badge>
        </div>
      </motion.div>

      {/* Status Actions */}
      <motion.div variants={fadeInUp} className="card-premium p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <span className="text-sm font-medium">Update Status:</span>
          <div className="flex flex-wrap gap-2">
            {invoice.status !== "PAID" && (
              <Button
                size="sm"
                onClick={() => handleStatusChange("PAID")}
                disabled={isUpdating}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <CreditCard className="w-4 h-4 mr-1" />
                Mark as Paid
              </Button>
            )}
            {invoice.status === "PENDING" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStatusChange("SENT")}
                disabled={isUpdating}
              >
                <Receipt className="w-4 h-4 mr-1" />
                Mark as Sent
              </Button>
            )}
            {invoice.status !== "OVERDUE" && invoice.status !== "PAID" && (
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700"
                onClick={() => handleStatusChange("OVERDUE")}
                disabled={isUpdating}
              >
                <Clock className="w-4 h-4 mr-1" />
                Mark as Overdue
              </Button>
            )}
            {isUpdating && (
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Invoice Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Details — Printable */}
          <motion.div
            variants={fadeInUp}
            className="card-premium p-8"
            id="invoice-printable"
          >
            {/* Invoice Header */}
            <div className="flex justify-between items-start mb-8 pb-6 border-b">
              <div>
                <h2 className="text-2xl font-display font-bold text-accent">
                  LEGAFORCE
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Manpower Recruitment Platform
                </p>
              </div>
              <div className="text-right">
                <h3 className="text-xl font-display font-bold">INVOICE</h3>
                <p className="text-sm font-mono text-muted-foreground">
                  {invoice.invoiceNumber}
                </p>
              </div>
            </div>

            {/* Bill To */}
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">
                  Bill To
                </p>
                <p className="font-semibold">
                  {invoice.employer?.companyName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {invoice.employer?.contactPerson}
                </p>
                {invoice.employer?.phone && (
                  <p className="text-sm text-muted-foreground">
                    {invoice.employer.phone}
                  </p>
                )}
                {invoice.employer?.country && (
                  <p className="text-sm text-muted-foreground">
                    {invoice.employer.country}
                  </p>
                )}
              </div>
              <div className="text-right">
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Issue Date</p>
                    <p className="text-sm font-medium">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Due Date</p>
                    <p
                      className={`text-sm font-medium ${isOverdue ? "text-red-500" : ""}`}
                    >
                      {new Date(invoice.dueDate).toLocaleDateString()}
                      {isOverdue && " (OVERDUE)"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Currency</p>
                    <p className="text-sm font-medium">
                      {invoice.currency || "PHP"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left text-xs text-muted-foreground font-semibold uppercase tracking-wider py-3">
                      Description
                    </th>
                    <th className="text-right text-xs text-muted-foreground font-semibold uppercase tracking-wider py-3">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item: any, index: number) => (
                    <tr key={index} className="border-b border-dashed">
                      <td className="py-3 text-sm">
                        {item.description}
                      </td>
                      <td className="py-3 text-sm text-right font-medium">
                        ₱{(item.amount || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="py-4 text-right font-semibold pr-4">
                      Total
                    </td>
                    <td className="py-4 text-right text-xl font-display font-bold text-accent">
                      ₱{(invoice.amount || 0).toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Payment Info */}
            {invoice.paidAt && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-semibold text-emerald-600">
                    Payment Received
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 ml-7">
                  Paid on {new Date(invoice.paidAt).toLocaleString()}
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary */}
          <motion.div variants={fadeInUp} className="card-premium p-6">
            <h3 className="font-display font-semibold flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-accent" />
              Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="text-sm font-bold">
                  ₱{(invoice.amount || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="outline" className={getStatusBadge(invoice.status)}>
                  {invoice.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Due Date</span>
                <span className="text-sm font-medium">
                  {new Date(invoice.dueDate).toLocaleDateString()}
                </span>
              </div>
              {invoice.paidAt && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Paid Date
                  </span>
                  <span className="text-sm font-medium">
                    {new Date(invoice.paidAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Employer Info */}
          <motion.div variants={fadeInUp} className="card-premium p-6">
            <h3 className="font-display font-semibold flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-purple-500" />
              Employer
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Company</span>
                <span className="text-sm font-medium">
                  {invoice.employer?.companyName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Contact</span>
                <span className="text-sm font-medium">
                  {invoice.employer?.contactPerson || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Country</span>
                <span className="text-sm font-medium">
                  {invoice.employer?.country || "N/A"}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Dates */}
          <motion.div variants={fadeInUp} className="card-premium p-6">
            <h3 className="font-display font-semibold flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              Dates
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="text-sm font-medium">
                  {new Date(invoice.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <p className="text-sm font-medium">
                  {new Date(invoice.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default InvoiceDetailPage;
