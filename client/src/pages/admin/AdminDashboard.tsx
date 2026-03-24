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
  const [analytics, setAnalytics] = useState<any>({ trend: [], pipeline: [] });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const [statsRes, analyticsRes, activityRes] = await Promise.all([
          adminService.getDashboardStats().catch(() => ({ data: {} })),
          adminService.getDashboardAnalytics().catch(() => ({ trend: [], pipeline: [] })),
          adminService.getRecentActivity(8).catch(() => ({ data: [] })),
        ]);
        const s = statsRes.data || {};
        setStats(s);
        setAnalytics(analyticsRes || { trend: [], pipeline: [] });
        setRecentActivity(activityRes.data || []);
        setPendingCount(s.pendingVerifications ?? 0);
      } catch (e) {
        toast.error("Failed to load dashboard");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const kpiCards = [
    { label: "Total Applicants",  value: stats.totalApplicants  ?? 0, icon: Users,     color: "text-blue-500",    bg: "bg-blue-500/10" },
    { label: "Registered Employers", value: stats.totalEmployers   ?? 0, icon: Building2,  color: "text-violet-500",  bg: "bg-violet-500/10" },
    { label: "Active Job Orders", value: stats.activeJobOrders ?? 0, icon: Briefcase,  color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Total Deployments", value: stats.totalDeployments ?? 0, icon: Globe,     color: "text-emerald-500",   bg: "bg-emerald-500/10" },
  ];

  return (
    <motion.div initial="initial" animate="animate" variants={staggerContainer} className="space-y-6">

      {/* Header */}
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm">Platform Overview</p>
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
              <Activity className="w-4 h-4 mr-2" />Generate Reports
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={fadeInUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }} className="card-premium p-5">
            <div className="flex items-start justify-between mb-4">
              <div className={cn("p-2.5 rounded-xl", card.bg)}>
                <card.icon className={cn("h-5 w-5", card.color)} />
              </div>
            </div>
            <p className="text-3xl font-display font-bold mb-1">
              {isLoading ? "—" : card.value.toLocaleString()}
            </p>
            <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Simple Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Simple Bar Chart: Monthly Activity */}
        <motion.div variants={fadeInUp} className="lg:col-span-2 card-premium p-6">
          <div className="mb-6">
            <h2 className="text-lg font-display font-semibold">Monthly Platform Activity</h2>
            <p className="text-xs text-muted-foreground">Applications and Deployments over the last 6 months</p>
          </div>
          {analytics.trend?.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={analytics.trend} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))" }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Bar dataKey="applications" name="Applications" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="deployments" name="Deployments" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[280px] text-sm text-muted-foreground">No data available</div>
          )}
        </motion.div>

        {/* Simple Pie Chart: Application Status */}
        <motion.div variants={fadeInUp} className="card-premium p-6 flex flex-col">
          <div className="mb-2">
            <h2 className="text-lg font-display font-semibold mb-1">Application Pipeline</h2>
            <p className="text-xs text-muted-foreground">Total records by status</p>
          </div>
          {analytics.pipeline?.length > 0 ? (
            <div className="flex-1 flex flex-col justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={analytics.pipeline} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={2}>
                    {analytics.pipeline.map((d: any, i: number) => <Cell key={i} fill={STATUS_COLORS[d.name] || "#64748b"} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-x-2 gap-y-3 mt-4">
                {analytics.pipeline.map((d: any) => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: STATUS_COLORS[d.name] || "#64748b" }} />
                    <span className="text-muted-foreground truncate">{d.name.charAt(0) + d.name.slice(1).toLowerCase()}</span>
                    <span className="font-semibold ml-auto">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">No pipeline data</div>
          )}
        </motion.div>
      </div>

      {/* Row 3: Recent Activity Logging */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-display font-semibold">Recent System Logs</h2>
            <p className="text-xs text-muted-foreground">Latest actions across all portals</p>
          </div>
          <Badge variant="outline" className="text-xs"><Clock className="w-3 h-3 mr-1" /> Live Updates</Badge>
        </div>
        
        <div className="bg-muted/30 border border-border rounded-xl divide-y divide-border">
          {recentActivity.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">No recent activity detected.</div>
          ) : (
            recentActivity.map((log: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
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
                    <p className="text-sm font-medium">{log.description}</p>
                    <p className="text-xs text-muted-foreground capitalize mt-0.5">{log.type.replace('_', ' ')} Logger</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {log.date ? new Date(log.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : "Recently"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="flex justify-center mt-4">
          <Link to="/admin/applications">
            <Button variant="ghost" size="sm" className="text-muted-foreground">View Application Records <ChevronRight className="w-4 h-4 ml-1" /></Button>
          </Link>
        </div>
      </motion.div>
      
    </motion.div>
  );
}
