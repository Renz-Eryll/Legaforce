import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Briefcase, Users, ArrowRight, Clock, Calendar, ArrowUpRight,
  UserCheck, Globe, FileText, Plus, Eye, Building2, Video, Wallet,
  ChevronRight, TrendingUp, Target,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { employerService } from "@/services/employerService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { DashboardPageSkeleton } from "@/components/ui/page-skeletons";

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };
const staggerContainer = { animate: { transition: { staggerChildren: 0.08 } } };

const statusConfig: Record<string, { label: string; className: string }> = {
  APPLIED:     { label: "Applied",     className: "status-applied"     },
  SHORTLISTED: { label: "Shortlisted", className: "status-shortlisted" },
  INTERVIEWED: { label: "Interviewed", className: "status-interviewed" },
  SELECTED:    { label: "Selected",    className: "status-selected"    },
  ACTIVE:      { label: "Active",      className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  FILLED:      { label: "Filled",      className: "bg-blue-500/10 text-blue-500 border-blue-500/20"         },
  CANCELLED:   { label: "Cancelled",   className: "bg-red-500/10 text-red-500 border-red-500/20"            },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-xl text-xs">
      {label && <p className="font-semibold mb-2 text-foreground">{label}</p>}
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

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [employer, setEmployer] = useState<any>(null);
  const [jobOrders, setJobOrders] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [recentCandidates, setRecentCandidates] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [analytics, setAnalytics] = useState<any>({ trend: [], pipeline: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setIsLoading(true);
        const [profileData, jobData, interviewData, candidatesData, statsData, analyticsData] = await Promise.all([
          employerService.getProfile().catch(() => null),
          employerService.getJobOrders().catch(() => []),
          employerService.getUpcomingInterviews().catch(() => []),
          employerService.getRecentCandidates().catch(() => []),
          employerService.getDashboardStats().catch(() => ({})),
          employerService.getDashboardAnalytics().catch(() => ({ trend: [], pipeline: [] })),
        ]);
        setEmployer(profileData);
        setJobOrders(Array.isArray(jobData) ? jobData : []);
        setInterviews(Array.isArray(interviewData) ? interviewData : []);
        setRecentCandidates(Array.isArray(candidatesData) ? candidatesData : []);
        setStats((statsData as any) || {});
        setAnalytics(analyticsData || { trend: [], pipeline: [] });
      } catch (e) {
        toast.error("Failed to load dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (isLoading) return <DashboardPageSkeleton />;

  const companyName = employer?.companyName || (user as any)?.employer?.companyName || "Company";

  const kpiCards = [
    { label: "Active Job Orders", value: stats.activeJobOrders ?? 0, icon: Briefcase, color: "text-cyan-500",   bg: "bg-cyan-500/10"   },
    { label: "Total Candidates",  value: stats.candidateCount  ?? 0, icon: Users,     color: "text-violet-500", bg: "bg-violet-500/10" },
    { label: "Interviews",        value: stats.interviewCount  ?? 0, icon: UserCheck, color: "text-emerald-500",bg: "bg-emerald-500/10"},
    { label: "Deployed Workers",  value: stats.deployedCount   ?? 0, icon: Globe,     color: "text-amber-500",  bg: "bg-amber-500/10"  },
  ];

  return (
    <motion.div initial="initial" animate="animate" variants={staggerContainer} className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1">Welcome, {companyName}! 🏢</h1>
          <p className="text-muted-foreground text-sm">Manage your workforce pipeline</p>
        </div>
        <div className="flex gap-2">
          <Link to="/employer/pricing">
            <Button variant="outline" size="sm"><Wallet className="w-4 h-4 mr-2" />Pricing</Button>
          </Link>
          <Link to="/employer/create-job-order">
            <Button className="gradient-bg-accent text-accent-foreground font-semibold shadow-lg">
              <Plus className="w-4 h-4 mr-2" />Post New Job
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={fadeInUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="card-premium p-5 hover:scale-[1.02] transition-transform">
            <div className="flex items-start justify-between mb-4">
              <div className={cn("p-2.5 rounded-xl", card.bg)}>
                <card.icon className={cn("h-5 w-5", card.color)} />
              </div>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-3xl font-display font-bold mb-1">{card.value.toLocaleString()}</p>
            <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Row 2: Hiring Trend + Candidate Pipeline (REAL DATA) */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Hiring Trend Area Chart */}
        <motion.div variants={fadeInUp} className="lg:col-span-2 card-premium p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-display font-semibold">Hiring Trend</h2>
              <p className="text-xs text-muted-foreground">Job orders posted vs hired — last 6 months</p>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Live</Badge>
          </div>
          {analytics.trend?.length > 0 ? (
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={analytics.trend} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="gPosted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gHired" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="posted" name="Jobs Posted" stroke="#06b6d4" strokeWidth={2} fill="url(#gPosted)" dot={{ r: 3, fill: "#06b6d4" }} />
                <Area type="monotone" dataKey="hired" name="Candidates Hired" stroke="#10b981" strokeWidth={2} fill="url(#gHired)" dot={{ r: 3, fill: "#10b981" }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
             <div className="flex items-center justify-center h-[210px] text-sm text-muted-foreground">No trend data yet</div>
          )}
        </motion.div>

        {/* Candidate Pipeline Bar */}
        <motion.div variants={fadeInUp} className="card-premium p-6">
          <h2 className="text-lg font-display font-semibold mb-1">Candidate Pipeline</h2>
          <p className="text-xs text-muted-foreground mb-5">Current hiring funnel across all jobs</p>
          {analytics.pipeline?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics.pipeline} layout="vertical" margin={{ left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="stage" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Candidates" radius={[0, 4, 4, 0]}>
                  {analytics.pipeline.map((d: any, i: number) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-sm text-muted-foreground">No pipeline data yet</div>
          )}
        </motion.div>
      </div>

      {/* Row 3: Job Orders + Right Sidebar */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Job Orders */}
        <motion.div variants={fadeInUp} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-semibold">Active Job Orders</h2>
            <Link to="/employer/job-orders" className="text-sm text-accent hover:underline flex items-center gap-1">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {jobOrders.length === 0 ? (
            <div className="card-premium p-10 text-center">
              <Briefcase className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
              <p className="text-muted-foreground mb-4">No job orders yet</p>
              <Link to="/employer/create-job-order">
                <Button className="gradient-bg-accent text-accent-foreground"><Plus className="w-4 h-4 mr-2" />Post Your First Job</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {jobOrders.slice(0, 5).map((job, i) => (
                <motion.div key={job.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="card-premium p-4 group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm group-hover:text-accent transition-colors truncate">{job.title}</h3>
                        <Badge className={cn("text-xs shrink-0", statusConfig[job.status?.toUpperCase() || "ACTIVE"]?.className)}>
                          {statusConfig[job.status?.toUpperCase() || "ACTIVE"]?.label || job.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                        <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{job.location || "—"}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{job.salary ? `$${job.salary}/mo` : "TBD"}</span>
                        <span className="flex items-center gap-1"><Target className="w-3 h-3" />{job.positions || 1} position{job.positions !== 1 ? "s" : ""}</span>
                      </p>
                    </div>
                    <Link to={`/employer/job-orders/${job.id}`}>
                      <Button variant="outline" size="sm" className="text-xs shrink-0">
                        Manage <ArrowUpRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right Sidebar */}
        <motion.div variants={fadeInUp} className="space-y-4">
          {/* Upcoming Interviews */}
          <div className="card-premium p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-accent" />Upcoming Interviews
              </h3>
              <Badge variant="secondary">{interviews.length}</Badge>
            </div>
            <div className="space-y-2">
              {interviews.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No upcoming interviews</p>
              ) : interviews.slice(0, 3).map((iv, i) => (
                <div key={iv.id || i} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-muted/40">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent font-semibold text-xs flex items-center justify-center shrink-0">
                    {(iv.candidateName || "?").split(" ").map((n: string) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{iv.candidateName}</p>
                    <p className="text-xs text-muted-foreground truncate">{iv.position}</p>
                  </div>
                  <p className="text-xs text-accent font-medium shrink-0">
                    {iv.date ? new Date(iv.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "TBD"}
                  </p>
                </div>
              ))}
            </div>
            <Link to="/employer/interviews" className="block mt-3">
              <Button variant="outline" size="sm" className="w-full text-xs">View All <ArrowRight className="ml-1 h-3 w-3" /></Button>
            </Link>
          </div>

          {/* Recent Candidates */}
          <div className="card-premium p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Users className="h-4 w-4 text-accent" />Recent Candidates
              </h3>
            </div>
            <div className="space-y-2">
              {recentCandidates.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No candidates yet</p>
              ) : recentCandidates.slice(0, 4).map((c, i) => (
                <div key={c.id || i} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors cursor-pointer">
                  <div className="w-7 h-7 rounded-md bg-primary/10 text-primary font-semibold text-xs flex items-center justify-center shrink-0">
                    {(c.name || "?").split(" ").map((n: string) => n[0]).join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{c.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{c.position}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/employer/candidates" className="block mt-3">
              <Button variant="outline" size="sm" className="w-full text-xs">Browse All <ArrowRight className="ml-1 h-3 w-3" /></Button>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="card-premium p-5">
            <h3 className="font-semibold text-sm mb-3">Quick Actions</h3>
            <div className="space-y-1.5">
              {[
                { to: "/employer/create-job-order", icon: Plus,     label: "Create Job Order",    color: "text-cyan-500"    },
                { to: "/employer/candidates",        icon: Eye,      label: "Browse Candidates",   color: "text-violet-500"  },
                { to: "/employer/interviews",        icon: Video,    label: "Manage Interviews",   color: "text-emerald-500" },
                { to: "/employer/reports",           icon: FileText, label: "View Reports",        color: "text-amber-500"   },
                { to: "/employer/pricing",           icon: Wallet,   label: "Pricing & Invoices",  color: "text-muted-foreground" },
              ].map(({ to, icon: Icon, label, color }) => (
                <Link to={to} key={to}>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs">
                    <Icon className={cn("h-3.5 w-3.5 shrink-0", color)} />{label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Optimization callout */}
      <motion.div variants={fadeInUp} className="card-premium p-4 bg-muted/20 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-accent/10"><TrendingUp className="w-4 h-4 text-accent" /></div>
          <span className="text-sm font-medium">Cost Optimization Active</span>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><Video className="w-3.5 h-3.5 text-emerald-500" />No physical interviews needed</span>
          <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-cyan-500" />AI-powered candidate matching</span>
          <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-violet-500" />Target: 21-30 day deployment</span>
        </div>
        <Link to="/employer/pricing" className="ml-auto">
          <Button variant="outline" size="sm" className="text-xs"><Wallet className="w-3.5 h-3.5 mr-1.5" />View Pricing</Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
