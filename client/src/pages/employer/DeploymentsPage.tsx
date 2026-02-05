import { useState } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Plane,
  CheckCircle,
  AlertCircle,
  MapPin,
  Calendar,
  Users,
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

const mockDeployments = [
  {
    id: "DEP-001",
    name: "Maria Santos",
    position: "Registered Nurse",
    destination: "Riyadh, Saudi Arabia",
    deployedDate: "2025-01-10",
    endDate: "2027-01-10",
    status: "deployed",
    performance: "Excellent",
  },
  {
    id: "DEP-002",
    name: "John Reyes",
    position: "Registered Nurse",
    destination: "Dubai, UAE",
    deployedDate: "2024-12-15",
    endDate: "2026-12-15",
    status: "deployed",
    performance: "Good",
  },
  {
    id: "DEP-003",
    name: "Ana Cruz",
    position: "Staff Nurse",
    destination: "Doha, Qatar",
    deployedDate: "2025-01-20",
    endDate: "2027-01-20",
    status: "in-transit",
    performance: "N/A",
  },
];

const statusConfig = {
  deployed: { label: "Deployed", color: "bg-emerald-50 text-emerald-700" },
  "in-transit": { label: "In Transit", color: "bg-amber-50 text-amber-700" },
  ended: { label: "Contract Ended", color: "bg-gray-50 text-gray-700" },
};

function DeploymentsPage() {
  const [deployments, setDeployments] = useState(mockDeployments);
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredDeployments =
    statusFilter === "all"
      ? deployments
      : deployments.filter((d) => d.status === statusFilter);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeInUp}>
        <h1 className="text-3xl font-display font-bold mb-1">Deployments</h1>
        <p className="text-muted-foreground">
          Track deployed workers worldwide
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid sm:grid-cols-3 gap-4">
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Deployed</p>
          <p className="text-2xl font-display font-bold">
            {deployments.length}
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">
            Currently Deployed
          </p>
          <p className="text-2xl font-display font-bold text-emerald-600">
            {deployments.filter((d) => d.status === "deployed").length}
          </p>
        </div>
        <div className="card-premium p-4">
          <p className="text-sm text-muted-foreground mb-1">In Transit</p>
          <p className="text-2xl font-display font-bold text-amber-600">
            {deployments.filter((d) => d.status === "in-transit").length}
          </p>
        </div>
      </motion.div>

      {/* Filter */}
      <motion.div variants={fadeInUp} className="card-premium p-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="deployed">Deployed</SelectItem>
            <SelectItem value="in-transit">In Transit</SelectItem>
            <SelectItem value="ended">Contract Ended</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Deployments Table */}
      <motion.div variants={fadeInUp} className="card-premium overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/50">
              <TableHead>Worker Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Deployed Date</TableHead>
              <TableHead>Contract End</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Performance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDeployments.map((dep) => {
              const statusInfo =
                statusConfig[dep.status as keyof typeof statusConfig];
              return (
                <TableRow key={dep.id} className="border-b border-border/50">
                  <TableCell className="font-medium">{dep.name}</TableCell>
                  <TableCell>{dep.position}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {dep.destination}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(dep.deployedDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(dep.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusInfo?.color}>
                      {statusInfo?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        dep.performance === "Excellent"
                          ? "bg-emerald-50 text-emerald-700"
                          : ""
                      }
                    >
                      {dep.performance}
                    </Badge>
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

export default DeploymentsPage;
