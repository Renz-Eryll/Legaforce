import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Download,
  DollarSign,
  Loader2,
  Receipt,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { employerService } from "@/services/employerService";

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

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  PAID: { label: "Paid", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", icon: CheckCircle },
  PENDING: { label: "Pending", color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: Clock },
  OVERDUE: { label: "Overdue", color: "bg-red-500/10 text-red-600 border-red-500/20", icon: AlertCircle },
  CANCELLED: { label: "Cancelled", color: "bg-gray-500/10 text-gray-500 border-gray-500/20", icon: AlertCircle },
};

function InvoicesListPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setIsLoading(true);
        const data = await employerService.getInvoices();
        setInvoices(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch invoices:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus =
      statusFilter === "all" || inv.status === statusFilter;
    const matchesSearch =
      !searchTerm ||
      (inv.invoiceNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalAmount = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const paidAmount = invoices
    .filter((inv) => inv.status === "PAID")
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const pendingAmount = invoices
    .filter((inv) => inv.status === "PENDING" || inv.status === "OVERDUE")
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <p className="text-muted-foreground">Loading invoices...</p>
        </div>
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
      <motion.div variants={fadeInUp}>
        <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1">Invoices</h1>
        <p className="text-muted-foreground">
          Manage your billing, view payment history, and track outstanding balances.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid sm:grid-cols-3 gap-4">
        <div className="card-premium p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-accent" />
            <p className="text-sm text-muted-foreground">Total Billed</p>
          </div>
          <p className="text-2xl font-display font-bold">
            {invoices.length > 0 ? `${invoices[0]?.currency || "PHP"} ` : ""}
            {totalAmount.toLocaleString()}
          </p>
        </div>
        <div className="card-premium p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <p className="text-sm text-muted-foreground">Paid</p>
          </div>
          <p className="text-2xl font-display font-bold text-emerald-600">
            {paidAmount.toLocaleString()}
          </p>
        </div>
        <div className="card-premium p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <p className="text-sm text-muted-foreground">Outstanding</p>
          </div>
          <p className="text-2xl font-display font-bold text-amber-600">
            {pendingAmount.toLocaleString()}
          </p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeInUp} className="card-premium p-4 flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search invoices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="OVERDUE">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Table */}
      <motion.div variants={fadeInUp} className="card-premium overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-12">
            <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium text-muted-foreground mb-1">No invoices found</p>
            <p className="text-sm text-muted-foreground">
              {invoices.length === 0
                ? "Invoices will appear here once recruitment services are used."
                : "No invoices match your current filters."}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/50">
                <TableHead>Invoice #</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => {
                const statusInfo =
                  statusConfig[invoice.status] || statusConfig.PENDING;
                const StatusIcon = statusInfo.icon;
                return (
                  <TableRow key={invoice.id} className="border-b border-border/50">
                    <TableCell className="font-medium font-mono text-sm">
                      {invoice.invoiceNumber || invoice.id}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {invoice.description || "Recruitment services"}
                    </TableCell>
                    <TableCell className="font-semibold text-accent">
                      {invoice.currency || "PHP"} {(invoice.amount || 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {invoice.dueDate
                        ? new Date(invoice.dueDate).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-xs", statusInfo.color)}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </motion.div>
    </motion.div>
  );
}

export default InvoicesListPage;
