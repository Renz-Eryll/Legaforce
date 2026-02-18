import { motion } from "framer-motion";
import {
  DollarSign,
  Video,
  Users,
  TrendingDown,
  CheckCircle,
} from "lucide-react";
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

// Recruitment Cost Optimization: no physical interviews, no repeated sourcing, transparent pricing
const mockPricingItems = [
  { item: "Placement fee (per worker)", amount: 500, unit: "USD", note: "One-time" },
  { item: "Document verification", amount: 50, unit: "USD", note: "Per batch" },
  { item: "Video interview slot", amount: 0, unit: "—", note: "Unlimited included" },
  { item: "Priority sourcing (optional)", amount: 200, unit: "USD", note: "Per job order" },
];

const mockSavings = [
  { label: "No physical interviews", saving: "Travel & venue costs saved", icon: Video },
  { label: "No repeated sourcing", saving: "Single pool, no duplicate fees", icon: Users },
  { label: "Transparent pricing", saving: "No hidden charges", icon: DollarSign },
];

export default function PricingDashboardPage() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Header - Recruitment Cost Optimization */}
      <motion.div variants={fadeInUp}>
        <h1 className="text-3xl font-display font-bold mb-1">
          Recruitment Cost & Pricing
        </h1>
        <p className="text-muted-foreground">
          Transparent pricing. No physical interviews. No repeated sourcing.
        </p>
      </motion.div>

      {/* Cost optimization callouts */}
      <motion.div variants={fadeInUp} className="grid sm:grid-cols-3 gap-4">
        {mockSavings.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="card-premium p-5 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-semibold mb-1">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.saving}</p>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Transparent pricing dashboard */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-accent" />
          Transparent pricing dashboard
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          All fees are clear upfront. No hidden charges.
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Note</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPricingItems.map((row) => (
              <TableRow key={row.item}>
                <TableCell className="font-medium">{row.item}</TableCell>
                <TableCell>
                  {row.amount === 0 ? (
                    <Badge variant="secondary">Included</Badge>
                  ) : (
                    <span className="font-semibold">
                      {row.amount} {row.unit}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {row.note}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      {/* Summary */}
      <motion.div variants={fadeInUp} className="card-premium p-6 bg-muted/30">
        <div className="flex items-center gap-2 mb-3">
          <TrendingDown className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold">Cost optimization</h3>
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            No physical interviews — use built-in video; save travel and venue costs.
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            No repeated sourcing — one candidate pool, no duplicate agency fees.
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            Transparent pricing — see all fees before you commit.
          </li>
        </ul>
      </motion.div>
    </motion.div>
  );
}
