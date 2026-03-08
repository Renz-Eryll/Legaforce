import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  ShieldCheck,
  ShieldX,
  Briefcase,
  Building2,
  Receipt,
  CheckCircle,
  XCircle,
  Loader2,
  ToggleLeft,
  ToggleRight,
  Star,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      staggerChildren: 0.08,
    },
  },
};

const jobStatusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  FILLED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
  EXPIRED: "bg-slate-500/10 text-slate-500 border-slate-500/20",
};

const invoiceStatusColors: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  PAID: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  OVERDUE: "bg-red-500/10 text-red-500 border-red-500/20",
  CANCELLED: "bg-slate-500/10 text-slate-500 border-slate-500/20",
};

function EmployerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employer, setEmployer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const fetchEmployer = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const response = await adminService.getEmployerDetail(id);
        setEmployer(response.data);
      } catch (error) {
        toast.error("Failed to load employer details");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployer();
  }, [id]);

  const handleToggleActive = async () => {
    if (!employer?.user?.id) return;
    try {
      setIsToggling(true);
      const response = await adminService.toggleUserActive(employer.user.id);
      setEmployer((prev: any) => ({
        ...prev,
        user: { ...prev.user, isActive: response.data.isActive },
      }));
      toast.success(
        response.data.isActive ? "Account activated" : "Account suspended",
      );
    } catch {
      toast.error("Failed to toggle account status");
    } finally {
      setIsToggling(false);
    }
  };

  const handleVerify = async (verified: boolean) => {
    if (!employer?.id) return;
    try {
      setIsVerifying(true);
      await adminService.verifyEmployer(employer.id, verified);
      setEmployer((prev: any) => ({ ...prev, isVerified: verified }));
      toast.success(
        verified ? "Employer verified successfully" : "Verification revoked",
      );
    } catch {
      toast.error("Failed to update verification status");
    } finally {
      setIsVerifying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading employer details...</p>
        </div>
      </div>
    );
  }

  if (!employer) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Building2 className="w-16 h-16 text-muted-foreground mb-4" />
        <p className="text-lg font-semibold mb-2">Employer Not Found</p>
        <p className="text-muted-foreground mb-6">
          The employer you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate("/admin/employers")} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Employers
        </Button>
      </div>
    );
  }

  const isActive = employer.user?.isActive;

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Back Button */}
      <motion.div variants={fadeInUp}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/employers")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Employers
        </Button>
      </motion.div>

      {/* Profile Header */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {employer.companyName?.charAt(0) || "E"}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-display font-bold mb-1">
                  {employer.companyName}
                </h1>
                <p className="text-muted-foreground">
                  Contact: {employer.contactPerson || "N/A"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className={
                    isActive
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : "bg-red-500/10 text-red-500 border-red-500/20"
                  }
                >
                  {isActive ? (
                    <ShieldCheck className="w-3 h-3 mr-1" />
                  ) : (
                    <ShieldX className="w-3 h-3 mr-1" />
                  )}
                  {isActive ? "Active" : "Suspended"}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    employer.isVerified
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  }
                >
                  {employer.isVerified ? (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <XCircle className="w-3 h-3 mr-1" />
                  )}
                  {employer.isVerified ? "Verified" : "Unverified"}
                </Badge>
              </div>
            </div>

            {/* Contact Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{employer.user?.email || "-"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span>{employer.phone || "-"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span>{employer.country || "-"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span>
                  Joined{" "}
                  {employer.user?.createdAt
                    ? new Date(employer.user.createdAt).toLocaleDateString()
                    : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border/50">
          <div className="text-center p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
            <p className="text-2xl font-bold text-blue-500">
              {employer._count?.jobOrders || 0}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Job Orders</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
            <p className="text-2xl font-bold text-amber-500">
              {employer._count?.invoices || 0}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Invoices</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
            <p className="text-2xl font-bold text-purple-500">
              {employer.trustScore || 0}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Trust Score</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
            <p className="text-2xl font-bold text-emerald-500">
              {employer.totalHires || 0}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Total Hires</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeInUp}>
        <Tabs defaultValue="job-orders" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted p-1">
            <TabsTrigger value="job-orders">
              <Briefcase className="w-4 h-4 mr-2" />
              Job Orders ({employer.jobOrders?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="invoices">
              <Receipt className="w-4 h-4 mr-2" />
              Invoices ({employer.invoices?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="actions">
              <Shield className="w-4 h-4 mr-2" />
              Admin Actions
            </TabsTrigger>
          </TabsList>

          {/* Job Orders Tab */}
          <TabsContent value="job-orders" className="card-premium mt-4">
            {employer.jobOrders?.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Positions</TableHead>
                      <TableHead>Applications</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employer.jobOrders.map((job: any) => (
                      <TableRow key={job.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {job.title}
                        </TableCell>
                        <TableCell className="text-sm">
                          {job.location || "-"}
                        </TableCell>
                        <TableCell className="text-sm">
                          {job.positions}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Users className="w-3 h-3" />
                            {job._count?.applications || 0}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              jobStatusColors[job.status] ||
                              jobStatusColors.ACTIVE
                            }
                          >
                            {job.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Briefcase className="w-12 h-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No job orders yet</p>
              </div>
            )}
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="card-premium mt-4">
            {employer.invoices?.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employer.invoices.map((inv: any) => (
                      <TableRow key={inv.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium font-mono text-sm">
                          {inv.invoiceNumber}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {inv.currency} {inv.amount?.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              invoiceStatusColors[inv.status] ||
                              invoiceStatusColors.PENDING
                            }
                          >
                            {inv.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(inv.dueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(inv.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Receipt className="w-12 h-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No invoices yet</p>
              </div>
            )}
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions" className="card-premium mt-4 p-6">
            <h3 className="text-lg font-semibold mb-4">Admin Actions</h3>
            <div className="space-y-3">
              {/* Verification */}
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleVerify(!employer.isVerified)}
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : employer.isVerified ? (
                  <XCircle className="w-4 h-4 mr-2 text-red-500" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" />
                )}
                {employer.isVerified
                  ? "Revoke Verification"
                  : "Verify Employer"}
              </Button>

              {/* Suspend / Activate */}
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleToggleActive}
                disabled={isToggling}
              >
                {isToggling ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : isActive ? (
                  <ToggleRight className="w-4 h-4 mr-2 text-red-500" />
                ) : (
                  <ToggleLeft className="w-4 h-4 mr-2 text-emerald-500" />
                )}
                {isActive ? "Suspend Account" : "Activate Account"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

export default EmployerDetailPage;
