import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Filter, DollarSign, Calendar } from "lucide-react";
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
    id: "INV-001",
    date: "2025-01-15",
    dueDate: "2025-02-15",
    amount: 12500,
    status: "paid",
    description: "Monthly placement fees - Registered Nurses",
  },
  {
    id: "INV-002",
    date: "2025-01-20",
    dueDate: "2025-02-20",
    amount: 8750,
    status: "pending",
    description: "Deployment processing fees",
  },
  {
    id: "INV-003",
    date: "2025-01-10",
    dueDate: "2025-02-10",
    amount: 15000,
    status: "overdue",
    description: "Monthly placement fees - Staff Nurses",
  },
  {
    id: "INV-004",
    date: "2025-01-25",
    dueDate: "2025-02-25",
    amount: 6250,
    status: "pending",
    description: "Document verification fees",
  },
];

const statusConfig = {
  paid: { label: "Paid", color: "bg-emerald-50 text-emerald-700" },
  pending: { label: "Pending", color: "bg-blue-50 text-blue-700" },
  overdue: { label: "Overdue", color: "bg-red-50 text-red-700" },
};

function InvoicesListPage() {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    const matchesSearch = inv.id
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeInUp}>
        <h1 className="text-3xl font-display font-bold mb-1">Invoices</h1>
        <p className="text-muted-foreground">
          Manage your billing and payments
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-4">
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
          <p className="text-2xl font-display font-bold text-accent">
            ₱{totalAmount.toLocaleString()}
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Paid</p>
          <p className="text-2xl font-display font-bold text-emerald-600">
            ₱{paidAmount.toLocaleString()}
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Pending</p>
          <p className="text-2xl font-display font-bold text-amber-600">
            ₱
            {invoices
              .filter(
                (inv) => inv.status === "pending" || inv.status === "overdue",
              )
              .reduce((sum, inv) => sum + inv.amount, 0)
              .toLocaleString()}
          </p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeInUp} className="card-premium p-4 flex gap-4">
        <Input
          placeholder="Search invoices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Invoices Table */}
      <motion.div variants={fadeInUp} className="card-premium overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/50">
              <TableHead>Invoice</TableHead>
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
                statusConfig[invoice.status as keyof typeof statusConfig];
              return (
                <TableRow
                  key={invoice.id}
                  className="border-b border-border/50"
                >
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {invoice.description}
                  </TableCell>
                  <TableCell className="font-semibold text-accent">
                    ₱{invoice.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusInfo?.color}>
                      {statusInfo?.label}
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
      </motion.div>
    </motion.div>
  );
}

export default InvoicesListPage;
