import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Briefcase, FileText, TrendingUp, Star, Bell, ArrowRight, MapPin,
  Building2, CheckCircle, AlertCircle, Sparkles, Clock, ArrowUpRight,
  Eye, Calendar, ChevronRight,
} from "lucide-react";
import {
  AreaChart, Area, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { applicantService } from "@/services/applicantService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };
const staggerContainer = { animate: { transition: { staggerChildren: 0.08 } } };

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  APPLIED:     { label: "Applied",     className: "status-applied" },
  SHORTLISTED: { label: "Shortlisted", className: "status-shortlisted" },
  INTERVIEWED: { label: "Interviewed", className: "status-interviewed" },
  SELECTED:    { label: "Selected",    className: "status-selected" },
  PROCESSING:  { label: "Processing",  className: "status-processing" },
  DEPLOYED:    { label: "Deployed",    className: "status-deployed" },
  REJECTED:    { label: "Rejected",    className: "status-rejected" },
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

export default function ApplicantDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [profileCompletion, setProfileCompletion] = useState(75);
  const [profileViews, setProfileViews] = useState(0);
  const [matchScore, setMatchScore] = useState(0);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [analytics, setAnalytics] = useState<any>({ weeklyActivity: [], statusBreakdown: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setIsLoading(true);
        const [
          profileRes, appsRes, notifRes, compRes, recRes,
          viewsRes, matchRes, rewardRes, analyticsRes
        ] = await Promise.all([
          applicantService.getProfile().catch(() => null),
          applicantService.getApplications().catch(() => []),
          applicantService.getNotifications().catch(() => []),
          applicantService.getProfileCompletion().catch(() => 75),
          applicantService.getRecommendedJobs().catch(() => []),
          applicantService.getProfileViews().catch(() => 0),
          applicantService.getMatchScore().catch(() => 0),
          applicantService.getRewardPoints().catch(() => 0),
          applicantService.getDashboardAnalytics().catch(() => ({ weeklyActivity: [], statusBreakdown: [] })),
        ]);
        setProfile(profileRes);
        setApplications(Array.isArray(appsRes) ? appsRes : []);
        setNotifications(Array.isArray(notifRes) ? notifRes : []);
        setProfileCompletion(typeof compRes === "number" ? compRes : 75);
        setRecommendedJobs(Array.isArray(recRes) ? recRes : []);
        setProfileViews(typeof viewsRes === "number" ? viewsRes : 0);
        setMatchScore(typeof matchRes === "number" ? matchRes : 0);
        setRewardPoints(typeof rewardRes === "number" ? rewardRes : 0);
        setAnalytics(analyticsRes || { weeklyActivity: [], statusBreakdown: [] });
      } catch (e) {
        toast.error("Failed to load dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  const firstName = profile?.firstName || user?.profile?.firstName || "User";

  return (
    <motion.div initial="initial" animate="animate" variants={staggerContainer} className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1">Welcome back, {firstName}! 👋</h1>
          <p className="text-muted-foreground text-sm">Here's your job search overview</p>
        </div>
        <Link to="/app/jobs">
          <Button className="gradient-bg-accent text-accent-foreground font-semibold shadow-lg">
            <Sparkles className="w-4 h-4 mr-2" />Browse Jobs <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </motion.div>

      {/* Profile Completion Banner */}
      {profileCompletion < 100 && (
        <motion.div variants={fadeInUp} className="card-premium p-5 border-accent/20 bg-gradient-to-r from-accent/5 to-transparent">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-accent" />
                <h3 className="font-semibold">Complete Your Profile</h3>
                <Badge className="bg-accent/10 text-accent border-accent/20">{profileCompletion}%</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">A complete profile gets 3× more employer views</p>
              <Progress value={profileCompletion} className="h-2" />
            </div>
            <Link to="/app/profile">
              <Button className="gradient-bg-accent text-accent-foreground font-semibold shrink-0">
                Complete Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* KPI Cards */}
      <motion.div variants={fadeInUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Applications", value: applications.length, icon: Briefcase, color: "text-cyan-500", bg: "bg-cyan-500/10" },
          { label: "Profile Views",        value: profileViews,        icon: Eye,       color: "text-violet-500", bg: "bg-violet-500/10" },
          { label: "AI Match Score",       value: `${matchScore}%`,   icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Reward Points",        value: rewardPoints,        icon: Star,      color: "text-amber-500", bg: "bg-amber-500/10" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="card-premium p-5">
            <div className="flex items-start justify-between mb-4">
              <div className={cn("p-2.5 rounded-xl", s.bg)}>
                <s.icon className={cn("h-5 w-5", s.color)} />
              </div>
            </div>
            <p className="text-3xl font-display font-bold mb-1">{isLoading ? "—" : s.value.toLocaleString()}</p>
            <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Row 2: Activity Chart + Application Status Pie (REAL DATA) */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly Activity Area Chart */}
        <motion.div variants={fadeInUp} className="lg:col-span-2 card-premium p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-display font-semibold">Weekly Activity</h2>
              <p className="text-xs text-muted-foreground">Applications sent this week</p>
            </div>
          </div>
          {analytics.weeklyActivity?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={analytics.weeklyActivity} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="gApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="applications" name="Applications" stroke="#06b6d4" strokeWidth={2} fill="url(#gApps)" dot={{ r: 3, fill: "#06b6d4" }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-sm text-muted-foreground">No activity data yet</div>
          )}
        </motion.div>

        {/* Application Status Pie */}
        <motion.div variants={fadeInUp} className="card-premium p-6">
          <h2 className="text-lg font-display font-semibold mb-1">Application Status</h2>
          <p className="text-xs text-muted-foreground mb-4">Your pipeline breakdown</p>
          {analytics.statusBreakdown?.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={analytics.statusBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" paddingAngle={3}>
                  {analytics.statusBreakdown.map((d: any, i: number) => <Cell key={i} fill={d.fill} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-[180px] text-center">
              <Briefcase className="w-10 h-10 text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">No applications yet</p>
              <Link to="/app/jobs" className="mt-2">
                <Button variant="outline" size="sm" className="text-xs">Browse Jobs</Button>
              </Link>
            </div>
          )}
        </motion.div>
      </div>

      {/* Row 3: Recent Applications + Right Sidebar */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <motion.div variants={fadeInUp} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-semibold">Recent Applications</h2>
            <Link to="/app/applications" className="text-sm text-accent hover:underline flex items-center gap-1">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {applications.length > 0 ? applications.slice(0, 4).map((app, i) => (
              <motion.div key={app.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="card-premium p-4 group">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center font-bold text-sm shrink-0">
                    {((app.employer?.companyName || app.company || "?").charAt(0))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-sm group-hover:text-accent transition-colors truncate">
                        {app.position || app.jobTitle || app.jobOrder?.title || "Position"}
                      </h3>
                      <Badge className={cn("text-xs shrink-0", STATUS_CONFIG[app.status?.toUpperCase() || "APPLIED"]?.className)}>
                        {STATUS_CONFIG[app.status?.toUpperCase() || "APPLIED"]?.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{app.employer?.companyName || app.company || app.jobOrder?.employer?.companyName || "—"}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{app.jobOrder?.location || app.location || "—"}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "—"}</span>
                    </div>
                  </div>
                  <Link to={`/app/applications/${app.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0"><ArrowUpRight className="h-4 w-4" /></Button>
                  </Link>
                </div>
              </motion.div>
            )) : (
              <div className="flex flex-col items-center justify-center py-12 card-premium border-dashed border-2 bg-muted/10 text-center">
                <Briefcase className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <h3 className="font-medium text-muted-foreground mb-1">No applications yet</h3>
                <p className="text-xs text-muted-foreground/70 mb-4">Start by browsing jobs that match your skills</p>
                <Link to="/app/jobs"><Button variant="outline" size="sm">Browse Jobs</Button></Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Sidebar */}
        <motion.div variants={fadeInUp} className="space-y-4">
          {/* Notifications */}
          <div className="card-premium p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Notifications</h3>
              {notifications.length > 0 && (
                <button onClick={() => { setNotifications([]); toast.success("All read"); }} className="text-xs text-accent hover:underline">
                  Mark all read
                </button>
              )}
            </div>
            <div className="space-y-2">
              {notifications.length > 0 ? notifications.slice(0, 3).map((n: any, i) => (
                <div key={i} className="flex gap-2.5 p-2.5 rounded-lg bg-muted/40">
                  <div className={cn("w-6 h-6 rounded-md flex items-center justify-center shrink-0",
                    n.type === "success" ? "bg-emerald-500/10 text-emerald-500" :
                    n.type === "warning" ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"
                  )}>
                    {n.type === "success" ? <CheckCircle className="w-3 h-3" /> : <Bell className="w-3 h-3" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{n.time}</p>
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center py-6 text-center">
                  <Bell className="w-6 h-6 text-muted-foreground/30 mb-2" />
                  <p className="text-xs text-muted-foreground">No new notifications</p>
                </div>
              )}
            </div>
          </div>

          {/* Recommended Jobs */}
          <div className="card-premium p-5">
            <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-accent" />Recommended for You
            </h3>
            <div className="space-y-2">
              {recommendedJobs.length > 0 ? recommendedJobs.slice(0, 3).map((job: any, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors cursor-pointer">
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{job.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{job.company} • {job.location}</p>
                  </div>
                  <Badge className="bg-accent/10 text-accent border-accent/20 text-xs shrink-0 ml-2">{job.match}%</Badge>
                </div>
              )) : (
                <div className="flex flex-col items-center py-4 text-center">
                  <Sparkles className="w-6 h-6 text-muted-foreground/30 mb-2" />
                  <p className="text-xs text-muted-foreground">No recommendations yet</p>
                </div>
              )}
            </div>
            <Link to="/app/jobs" className="block mt-3">
              <Button variant="outline" size="sm" className="w-full text-xs">View More Jobs <ArrowRight className="ml-1 h-3 w-3" /></Button>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="card-premium p-5">
            <h3 className="font-semibold text-sm mb-3">Quick Actions</h3>
            <div className="space-y-1.5">
              {[
                { to: "/app/cv-builder", icon: FileText, label: "Update AI CV", color: "text-cyan-500" },
                { to: "/app/documents", icon: Briefcase, label: "Upload Documents", color: "text-violet-500" },
                { to: "/app/complaints", icon: AlertCircle, label: "File a Complaint", color: "text-red-500" },
                { to: "/app/rewards", icon: Star, label: "My Rewards", color: "text-amber-500" },
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
    </motion.div>
  );
}
