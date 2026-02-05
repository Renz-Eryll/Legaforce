import { useState } from "react";
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

const mockInvoices = [
  {
    id: "INV-2601-001",
    invoiceNumber: "INV-2601-001",
    employer: "ABC Healthcare",
    amount: 45000,
    currency: "PHP",
    status: "paid",
    issuedDate: "Jan 25, 2026",
    dueDate: "Feb 25, 2026",
    paidDate: "Feb 20, 2026",
    description: "Recruitment & Placement Services",
  },
  {
    id: "INV-2601-002",
    invoiceNumber: "INV-2601-002",
    employer: "XYZ Construction",
    amount: 28500,
    currency: "PHP",
    status: "paid",
    issuedDate: "Jan 20, 2026",
    dueDate: "Feb 20, 2026",
    paidDate: "Feb 19, 2026",
    description: "Recruitment & Placement Services",
  },
  {
    id: "INV-2602-001",
    invoiceNumber: "INV-2602-001",
    employer: "Global Staffing",
    amount: 35600,
    currency: "PHP",
    status: "pending",
    issuedDate: "Feb 01, 2026",
    dueDate: "Mar 01, 2026",
    paidDate: null,
    description: "Recruitment & Placement Services",
  },
  {
    id: "INV-2602-002",
    invoiceNumber: "INV-2602-002",
    employer: "Gulf Hospitality",
    amount: 12300,
    currency: "PHP",
    status: "overdue",
    issuedDate: "Jan 01, 2026",
    dueDate: "Feb 01, 2026",
    paidDate: null,
    description: "Recruitment & Placement Services",
  },
  {
    id: "INV-2602-003",
    invoiceNumber: "INV-2602-003",
    employer: "Middle East Transport",
    amount: 42100,
    currency: "PHP",
    status: "pending",
    issuedDate: "Feb 05, 2026",
    dueDate: "Mar 05, 2026",
    paidDate: null,
    description: "Recruitment & Placement Services",
  },
];

function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.employer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const configs = {
      paid: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      overdue: "bg-red-500/10 text-red-500 border-red-500/20",
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const totalAmount = filteredInvoices.reduce(
    (sum, inv) => sum + inv.amount,
    0,
  );
  const paidAmount = filteredInvoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = filteredInvoices
    .filter((inv) => inv.status === "pending")
    .reduce((sum, inv) => sum + inv.amount, 0);

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
          <p className="text-2xl font-display font-bold text-red-500">₱12.3K</p>
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
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div variants={fadeInUp} className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice Number</TableHead>
                <TableHead>Employer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Issued Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Paid Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono font-medium text-sm">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      {invoice.invoiceNumber}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {invoice.employer}
                  </TableCell>
                  <TableCell className="font-semibold">
                    ₱{invoice.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {invoice.description}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {invoice.issuedDate}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {invoice.dueDate}
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
                    {invoice.paidDate || "—"}
                  </TableCell>
                  <TableCell>
                    <Link to={`/admin/invoices/${invoice.id}`}>
                      <Button variant="ghost" size="sm">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      {/* Pagination */}
      <motion.div
        variants={fadeInUp}
        className="flex items-center justify-between"
      >
        <p className="text-sm text-muted-foreground">
          Showing {filteredInvoices.length} of {mockInvoices.length} invoices
        </p>
        <div className="flex gap-2">
          <Button variant="outline" disabled>
            Previous
          </Button>
          <Button variant="outline">Next</Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default InvoicesPage;
