import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  DollarSign,
  Search,
  Filter,
  ChevronRight,
  Download,
  Plus,
  Calendar,
  FileText,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
      staggerChildren: 0.1,
    },
  },
};

function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setIsLoading(true);
        const status = statusFilter === "all" ? undefined : statusFilter;
        const response = await adminService.getInvoices(status);
        setInvoices(response.data || []);
      } catch (error) {
        toast.error("Failed to load invoices");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, [statusFilter]);

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.employer.companyName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const configs: Record<string, string> = {
      PAID: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      OVERDUE: "bg-red-500/10 text-red-500 border-red-500/20",
      DISPUTED: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      REFUNDED: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    };
    return configs[status] || configs.PENDING;
  };

  const totalAmount = filteredInvoices.reduce(
    (sum, inv) => sum + (inv.amount || 0),
    0,
  );
  const paidAmount = filteredInvoices
    .filter((inv) => inv.status === "PAID")
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const pendingAmount = filteredInvoices
    .filter((inv) => inv.status === "PENDING")
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const overdueAmount = filteredInvoices
    .filter((inv) => inv.status === "OVERDUE")
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);

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
            Invoice Management 💰
          </h1>
          <p className="text-muted-foreground">Track invoices and payments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="gradient-bg-accent text-accent-foreground">
            <Plus className="w-4 h-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid grid-cols-4 gap-4">
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Invoiced</p>
          <p className="text-2xl font-display font-bold">
            ₱{(totalAmount / 1000).toFixed(1)}K
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Paid</p>
          <p className="text-2xl font-display font-bold text-emerald-500">
            ₱{(paidAmount / 1000).toFixed(1)}K
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Pending</p>
          <p className="text-2xl font-display font-bold text-amber-500">
            ₱{(pendingAmount / 1000).toFixed(1)}K
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Overdue</p>
          <p className="text-2xl font-display font-bold text-red-500">
            ₱{(overdueAmount / 1000).toFixed(1)}K
          </p>
        </div>
      </motion.div>

      {/* Filters & Search */}
      <motion.div variants={fadeInUp} className="card-premium p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by invoice number or employer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="OVERDUE">Overdue</SelectItem>
              <SelectItem value="DISPUTED">Disputed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div variants={fadeInUp} className="card-premium overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>Employer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Paid Date</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono font-medium text-sm">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          {invoice.invoiceNumber}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {invoice.employer.companyName}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₱{(invoice.amount || 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusBadge(invoice.status)}
                        >
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {invoice.paidAt
                          ? new Date(invoice.paidAt).toLocaleDateString()
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <Link to={`/admin/invoices/${invoice.id}`}>
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No invoices found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      {!isLoading && (
        <motion.div
          variants={fadeInUp}
          className="flex items-center justify-between"
        >
          <p className="text-sm text-muted-foreground">
            Showing {filteredInvoices.length} of {invoices.length} invoices
          </p>
          <div className="flex gap-2">
            <Button variant="outline" disabled>
              Previous
            </Button>
            <Button variant="outline" disabled={filteredInvoices.length < 20}>
              Next
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default InvoicesPage;
