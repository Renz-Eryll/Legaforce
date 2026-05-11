import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Users, Building2, Briefcase, Globe, Activity, Shield,
  AlertTriangle, ArrowRight, Clock, FileText, ChevronRight, CheckCircle
} from "lucide-react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { adminService } from "@/services/adminService";
import { toast } from "sonner";
import { DashboardPageSkeleton } from "@/components/ui/page-skeletons";

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };
const staggerContainer = { animate: { transition: { staggerChildren: 0.08 } } };

const STATUS_COLORS: Record<string, string> = {
  APPLIED:     "#64748b",
  SHORTLISTED: "#06b6d4",
  INTERVIEWED: "#8b5cf6",
  SELECTED:    "#f59e0b",
  PROCESSING:  "#3b82f6",
  DEPLOYED:    "#10b981",
  REJECTED:    "#ef4444",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-xl text-xs">
      {label && <p className="font-semibold mb-2">{label}</p>}
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-medium text-foreground">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>({});
  const [analytics, setAnalytics] = useState<any>({ trend: [], pipeline: [], destinations: [], compliance: [] });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const [statsRes, analyticsRes, activityRes] = await Promise.all([
          adminService.getDashboardStats().catch(() => ({ data: {} })),
          adminService.getDashboardAnalytics().catch(() => ({ data: { trend: [], pipeline: [], destinations: [], compliance: [] } })),
          adminService.getRecentActivity(8).catch(() => ({ data: [] })),
        ]);
        
        const s = statsRes.data || {};
        setStats(s);
        setAnalytics(analyticsRes.data || { trend: [], pipeline: [], destinations: [], compliance: [] });
        setRecentActivity(activityRes.data || []);
        setPendingCount(s.pendingVerifications ?? 0);
      } catch (e) {
        toast.error("Failed to load dashboard");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) return <DashboardPageSkeleton />;

  const conversionRate = stats.totalApplications > 0 
    ? Math.round((stats.totalDeployments / stats.totalApplications) * 100) 
    : 0;

  const kpiCards = [
    { label: "Total Applicants",  value: stats.totalApplicants  ?? 0, icon: Users,     color: "text-blue-500",    bg: "bg-blue-500/10" },
    { label: "Active Job Orders", value: stats.activeJobOrders ?? 0, icon: Briefcase,  color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Total Deployments", value: stats.totalDeployments ?? 0, icon: Globe,     color: "text-emerald-500",   bg: "bg-emerald-500/10" },
    { label: "Success Rate", value: `${conversionRate}%`, icon: Activity, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <motion.div initial="initial" animate="animate" variants={staggerContainer} className="space-y-6">

      {/* Header */}
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1 flex items-center gap-3">
            Legaforce Intelligence <Badge className="bg-accent/10 text-accent border-accent/20">v1.2</Badge>
          </h1>
          <p className="text-muted-foreground text-sm">Real-time platform performance and compliance tracking</p>
        </div>
        <div className="flex gap-2">
          {pendingCount > 0 && (
            <Link to="/admin/verification">
              <Button size="sm" className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/20">
                <Shield className="w-4 h-4 mr-2" />
                {pendingCount} Verifications Pending
              </Button>
            </Link>
          )}
          <Link to="/admin/reports">
            <Button className="gradient-bg-accent text-accent-foreground font-semibold shadow-lg">
              <FileText className="w-4 h-4 mr-2" />Generate Analytics
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={fadeInUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }} className="card-premium p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={cn("p-2 rounded-lg", card.bg)}>
                <card.icon className={cn("h-4 w-4", card.color)} />
              </div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{card.label}</p>
            </div>
            <p className="text-3xl font-display font-bold">
              {card.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Primary Analytics Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <motion.div variants={fadeInUp} className="lg:col-span-2 card-premium p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-display font-semibold">Recruitment Velocity</h2>
              <p className="text-xs text-muted-foreground">Applications vs Successful Deployments</p>
            </div>
            <div className="flex gap-2">
               <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-500">Applications</Badge>
               <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-500">Deployments</Badge>
            </div>
          </div>
          <div className="h-[300px]">
            {analytics.trend?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.trend} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))" }} />
                  <Bar dataKey="applications" name="Applications" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  <Bar dataKey="deployments" name="Deployments" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground italic">Gathering recruitment data...</div>
            )}
          </div>
        </motion.div>

        {/* Pipeline Pie Chart */}
        <motion.div variants={fadeInUp} className="card-premium p-6 flex flex-col">
          <div className="mb-4">
            <h2 className="text-lg font-display font-semibold mb-1">Status Distribution</h2>
            <p className="text-xs text-muted-foreground">Active application lifecycle</p>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            {analytics.pipeline?.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={analytics.pipeline} cx="50%" cy="50%" innerRadius={60} outerRadius={85} dataKey="value" paddingAngle={4}>
                      {analytics.pipeline.map((d: any, i: number) => <Cell key={i} fill={STATUS_COLORS[d.name] || "#64748b"} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {analytics.pipeline.slice(0, 6).map((d: any) => (
                    <div key={d.name} className="flex items-center gap-2 text-[11px]">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: STATUS_COLORS[d.name] || "#64748b" }} />
                      <span className="text-muted-foreground truncate">{d.name}</span>
                      <span className="font-semibold ml-auto">{d.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-10 text-sm text-muted-foreground">No active pipeline</div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Secondary Analytics Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Compliance Radial Charts */}
        <motion.div variants={fadeInUp} className="card-premium p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-display font-semibold">Compliance Checklist</h2>
              <p className="text-xs text-muted-foreground">Document completion rate across all deployments</p>
            </div>
            <Shield className="w-5 h-5 text-accent opacity-50" />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {(analytics.compliance || []).map((item: any) => (
              <div key={item.name} className="flex flex-col items-center text-center">
                <div className="relative w-20 h-20 mb-3">
                  {/* Progress Circle Placeholder / Simple Visual */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-muted/30" />
                    <circle cx="40" cy="40" r="34" stroke={item.fill} strokeWidth="6" strokeDasharray={213.6} 
                            strokeDashoffset={213.6 - (213.6 * item.value) / 100} fill="transparent" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-sm">
                    {item.value}%
                  </div>
                </div>
                <p className="text-xs font-semibold">{item.name}</p>
                <p className="text-[10px] text-muted-foreground">Verified</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Destinations */}
        <motion.div variants={fadeInUp} className="card-premium p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-display font-semibold">Top Destinations</h2>
              <p className="text-xs text-muted-foreground">Geographic demand for Filipino workers</p>
            </div>
            <Globe className="w-5 h-5 text-accent opacity-50" />
          </div>
          
          <div className="space-y-4">
            {(analytics.destinations || []).map((dest: any, i: number) => (
              <div key={dest.country} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium flex items-center gap-2">
                    <Badge variant="outline" className="w-5 h-5 p-0 flex items-center justify-center text-[10px] border-accent/20 text-accent">{i + 1}</Badge>
                    {dest.country}
                  </span>
                  <span className="text-muted-foreground">{dest.count} Job Orders</span>
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(dest.count / analytics.destinations[0].count) * 100}%` }}
                              className="h-full bg-accent" transition={{ duration: 1, delay: i * 0.1 }} />
                </div>
              </div>
            ))}
            {(!analytics.destinations || analytics.destinations.length === 0) && (
              <p className="text-center py-6 text-sm text-muted-foreground">No geographic data yet</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity Log */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-display font-semibold">System Audit Stream</h2>
            <p className="text-xs text-muted-foreground">Latest events from applicants and employers</p>
          </div>
          <Badge variant="outline" className="text-[10px] flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Feed
          </Badge>
        </div>
        
        <div className="bg-secondary/30 rounded-xl overflow-hidden border border-border/50">
          {recentActivity.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground text-sm italic">No recent activity detected.</div>
          ) : (
            <div className="divide-y divide-border/40">
              {recentActivity.map((log: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                      log.type === "application" ? "bg-blue-500/10 text-blue-500" :
                      log.type === "complaint"   ? "bg-red-500/10 text-red-500" :
                      log.type === "job_order"   ? "bg-amber-500/10 text-amber-500" : 
                      "bg-gray-500/10 text-gray-500"
                    )}>
                      {log.type === "application" ? <Users className="w-4 h-4" /> :
                       log.type === "complaint" ? <AlertTriangle className="w-4 h-4" /> :
                       log.type === "job_order" ? <Briefcase className="w-4 h-4" /> :
                       <FileText className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium group-hover:text-accent transition-colors">{log.description}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">{log.type.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-mono text-muted-foreground">
                      {log.date ? new Date(log.date).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }) : "Recently"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-center mt-5">
          <Link to="/admin/applications">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Explore All Logs <ArrowRight className="w-3 h-3 ml-2" />
            </Button>
          </Link>
        </div>
      </motion.div>
      
    </motion.div>
  );
}

