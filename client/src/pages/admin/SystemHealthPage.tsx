import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Activity, 
  Clock, 
  Shield, 
  AlertCircle, 
  History, 
  User, 
  ExternalLink,
  Loader2,
  RefreshCcw,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { adminService } from "@/services/adminService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };
const staggerContainer = { animate: { transition: { staggerChildren: 0.1 } } };

export default function SystemHealthPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [slaAlerts, setSlaAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("sla");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [logsRes, alertsRes] = await Promise.all([
        adminService.getSystemLogs({ limit: 100 }),
        adminService.getSlaAlerts()
      ]);
      setLogs(logsRes.data || []);
      setSlaAlerts(alertsRes.data || []);
    } catch (err) {
      toast.error("Failed to fetch system data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <motion.div initial="initial" animate="animate" variants={staggerContainer} className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold mb-1">System Health & Compliance 🛡️</h1>
          <p className="text-muted-foreground">Monitor platform SLAs and audit system-wide actions</p>
        </div>
        <Button onClick={fetchData} variant="outline" size="sm" disabled={isLoading}>
          <RefreshCcw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
          Sync Data
        </Button>
      </motion.div>

      <Tabs defaultValue="sla" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-6">
          <TabsTrigger value="sla" className="flex items-center gap-2">
            <Clock className="w-4 h-4" /> SLA Alerts
            {slaAlerts.length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 min-w-5 flex items-center justify-center p-0">
                {slaAlerts.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <History className="w-4 h-4" /> Audit Trail
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sla">
          <motion.div variants={fadeInUp} className="space-y-4">
            <div className="card-premium p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                Pipeline Bottlenecks
              </h3>
              
              {isLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin" /></div>
              ) : slaAlerts.length === 0 ? (
                <div className="text-center py-12 bg-secondary/20 rounded-xl border border-dashed">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-20" />
                  <p className="text-muted-foreground">All systems go! No SLA breaches detected.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {slaAlerts.map((alert) => (
                    <div key={alert.id} className={cn(
                      "flex items-center justify-between p-4 rounded-xl border transition-all",
                      alert.severity === "CRITICAL" 
                        ? "bg-red-500/5 border-red-500/20" 
                        : "bg-amber-500/5 border-amber-500/20"
                    )}>
                      <div className="flex items-center gap-4">
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                          alert.severity === "CRITICAL" ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500")}>
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{alert.applicantName}</p>
                            <Badge variant="outline" className="text-[10px]">{alert.status}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{alert.jobTitle} @ {alert.employerName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn("text-lg font-bold", alert.severity === "CRITICAL" ? "text-red-500" : "text-amber-500")}>
                          {alert.daysInStatus} Days
                        </p>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">
                          In Status (Limit: {alert.threshold})
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
               <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                  <p className="text-xs font-bold text-blue-500 uppercase mb-1">Response Target</p>
                  <p className="text-sm text-muted-foreground">Applications should be reviewed within 72 hours for high platform trust.</p>
               </div>
               <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                  <p className="text-xs font-bold text-emerald-500 uppercase mb-1">SLA Auto-Flag</p>
                  <p className="text-sm text-muted-foreground">Critical alerts (2x threshold) are automatically highlighted for admin priority.</p>
               </div>
               <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-xl">
                  <p className="text-xs font-bold text-purple-500 uppercase mb-1">Compliance Rate</p>
                  <p className="text-sm text-muted-foreground">Current platform-wide SLA compliance is at <span className="font-bold text-foreground">92%</span>.</p>
               </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="audit">
          <motion.div variants={fadeInUp} className="card-premium overflow-hidden">
            <div className="p-6 border-b border-border/50 bg-secondary/30">
              <h3 className="font-semibold">System Audit Trail</h3>
              <p className="text-xs text-muted-foreground">Immutable history of administrative actions</p>
            </div>
            
            <div className="divide-y divide-border/50">
              {isLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin" /></div>
              ) : logs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No logs available.</div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="p-4 hover:bg-muted/30 transition-colors group">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="mt-1">
                           <Badge variant="outline" className="px-1 py-0.5 text-[9px] uppercase tracking-tighter bg-accent/5 text-accent border-accent/20">
                             {log.action}
                           </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-0.5">{log.description}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" /> 
                              {log.user?.profile?.firstName ? `${log.user.profile.firstName} ${log.user.profile.lastName}` : log.user?.email || "System"}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {new Date(log.createdAt).toLocaleString()}
                            </span>
                            {log.ipAddress && (
                              <>
                                <span>•</span>
                                <span>IP: {log.ipAddress}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity h-8">
                        <ExternalLink className="w-3 h-3 mr-2" /> Details
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-4 bg-muted/50 text-center">
               <Button variant="link" className="text-xs text-muted-foreground">Download Complete Compliance PDF Report</Button>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
