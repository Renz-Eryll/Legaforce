import { useState, useEffect, useRef, Suspense } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { PageContentSkeleton } from "@/components/ui/page-skeletons";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/stores/authStore";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  User,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Star,
  HelpCircle,
  Users,
  Building2,
  ClipboardList,
  FileCheck,
  DollarSign,
  BarChart3,
  Shield,
  MessageSquare,
  Globe,
  UserCheck,
  AlertTriangle,
  Wallet,
  Search,
  CheckCircle,
  Activity,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { applicantService } from "@/services/applicantService";
import { employerService } from "@/services/employerService";
import { adminService } from "@/services/adminService";
import { notificationApiService } from "@/services/notificationApiService";
import { useSSENotifications } from "@/hooks/useSSENotifications";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";


interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

// Applicant Navigation - will be translated in component
const getApplicantNavigation = (badges: any = {}): NavSection[] => [
  {
    items: [
      { name: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Job Search",
    items: [
      { name: "Browse Jobs", href: "/app/jobs", icon: Search },
      {
        name: "My Applications",
        href: "/app/applications",
        icon: Briefcase,
        badge: badges.applications || 0,
      },
      { name: "Saved Jobs", href: "/app/saved-jobs", icon: Star, badge: badges.savedJobs || 0 },
    ],
  },
  {
    title: "Tracking",
    items: [
      { name: "Status Report", href: "/app/status-report", icon: ClipboardList },
    ],
  },
  {
    title: "Profile",
    items: [
      { name: "My Profile", href: "/app/profile", icon: User },
      { name: "Documents", href: "/app/documents", icon: FileText },
      { name: "CV Builder", href: "/app/cv-builder", icon: FileCheck },
    ],
  },
  {
    title: "Rewards & Support",
    items: [
      { name: "Rewards", href: "/app/rewards", icon: Star, badge: badges.rewards || "0 pts" },
      { name: "Support", href: "/app/support", icon: HelpCircle },
      { name: "Complaints", href: "/app/complaints", icon: MessageSquare, badge: badges.complaints || 0 },
    ],
  },
];

// Employer Navigation - will be translated in component
const getEmployerNavigation = (badges: any = {}): NavSection[] => [
  {
    items: [
      { name: "Dashboard", href: "/employer/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Recruitment",
    items: [
      {
        name: "Job Orders",
        href: "/employer/job-orders",
        icon: Briefcase,
        badge: badges.jobOrders || 0,
      },
      { name: "Candidates", href: "/employer/candidates", icon: Users, badge: badges.candidates || 0 },
      {
        name: "Interviews",
        href: "/employer/interviews",
        icon: UserCheck,
        badge: badges.interviews || 0,
      },
    ],
  },
  {
    title: "Management",
    items: [
      { name: "Deployments", href: "/employer/deployments", icon: Globe },
      { name: "Invoices", href: "/employer/invoices", icon: DollarSign },
      { name: "Pricing & Cost", href: "/employer/pricing", icon: Wallet },
      { name: "Reports", href: "/employer/reports", icon: BarChart3 },
    ],
  },
  {
    title: "Account",
    items: [
      { name: "Company Profile", href: "/employer/profile", icon: Building2 },
      { name: "Support", href: "/employer/support", icon: HelpCircle },
    ],
  },
];

// Admin Navigation - will be translated in component
const getAdminNavigation = (badges: any = {}): NavSection[] => [
  {
    items: [
      { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Management",
    items: [
      {
        name: "Applicants",
        href: "/admin/applicants",
        icon: Users,
        badge: badges.applicants || 0,
      },
      {
        name: "Employers",
        href: "/admin/employers",
        icon: Building2,
        badge: badges.employers || 0,
      },
      { name: "Job Orders", href: "/admin/job-orders", icon: Briefcase, badge: badges.jobOrders || 0 },
    ],
  },
  {
    title: "Workflows",
    items: [
      {
        name: "Applications",
        href: "/admin/applications",
        icon: ClipboardList,
        badge: badges.applications || 0,
      },
      { name: "Deployments", href: "/admin/deployments", icon: Globe, badge: badges.deployments || 0 },
      { name: "Compliance", href: "/admin/compliance", icon: FileCheck },
    ],
  },
  {
    title: "Finance & Reports",
    items: [
      { name: "Invoices", href: "/admin/invoices", icon: Wallet },
      { name: "Reports", href: "/admin/reports", icon: BarChart3 },
    ],
  },
  {
    title: "Support & System",
    items: [
      {
        name: "Complaints",
        href: "/admin/complaints",
        icon: AlertTriangle,
        badge: badges.complaints || 0,
      },
      { name: "Verification", href: "/admin/verification", icon: Shield, badge: badges.verifications || 0 },
      { name: "System Health", href: "/admin/health", icon: Activity },
    ],
  },
];

interface DashboardLayoutProps {
  userRole?: "applicant" | "employer" | "admin";
}

// ── Relative time helper ────────────────────────
function timeAgo(date: string | Date): string {
  const now = new Date();
  const d = new Date(date);
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
}

// ── Notification type colors ────────────────────
// Handles both SSE types (success/warning/info) and DB enum types (APPLICATION_STATUS, DEPLOYMENT, etc.)
function getNotifColor(type: string): string {
  switch (type) {
    case "success":
    case "DEPLOYMENT":
    case "OFFER":
      return "text-emerald-500";
    case "warning":
      return "text-amber-500";
    case "info":
    case "APPLICATION_STATUS":
    case "JOB_RECOMMENDATION":
    case "MESSAGE":
    case "SYSTEM":
      return "text-blue-500";
    default:
      return "text-muted-foreground";
  }
}

// ── Map DB notification types to icon category ──
function getNotifIconType(type: string): "success" | "warning" | "info" {
  switch (type) {
    case "success":
    case "DEPLOYMENT":
    case "OFFER":
      return "success";
    case "warning":
      return "warning";
    default:
      return "info";
  }
}

export function DashboardLayout({
  userRole = "applicant",
}: DashboardLayoutProps) {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [badges, setBadges] = useState<any>({});
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Real-time SSE notifications
  const { liveNotifications, isConnected: sseConnected } = useSSENotifications();

  // Merge live SSE notifications with polled notifications (dedup by id)
  const allNotifications = (() => {
    const seen = new Set<string>();
    const merged: any[] = [];
    // Live SSE notifications first (newest)
    for (const n of liveNotifications) {
      const nid = n.id;
      if (nid && !seen.has(nid)) {
        seen.add(nid);
        merged.push(n);
      } else if (!nid) {
        merged.push(n);
      }
    }
    // Then polled notifications
    for (const n of notifications) {
      const nid = n.id || (n as any)._id;
      if (nid && !seen.has(nid)) {
        seen.add(nid);
        merged.push(n);
      } else if (!nid) {
        merged.push(n);
      }
    }
    return merged.slice(0, 20);
  })();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setShowNotifDropdown(false);
  }, [location.pathname]);

  // Fetch badges + notifications
  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const notifsRes = await notificationApiService.getNotifications();
        if (notifsRes.success) {
          setNotifications(Array.isArray(notifsRes.data) ? notifsRes.data : []);
        }

        if (userRole === "applicant") {
          const [apps, saved, points, complaints] = await Promise.allSettled([
            applicantService.getApplications(),
            applicantService.getSavedJobs(),
            applicantService.getRewardPoints(),
            applicantService.getComplaints(),
          ]);

          setBadges({
            applications: apps.status === 'fulfilled' ? (apps.value as any[]).length : 0,
            savedJobs: saved.status === 'fulfilled' ? (saved.value as any[]).length : 0,
            rewards: points.status === 'fulfilled' ? `${points.value} pts` : "0 pts",
            complaints: complaints.status === 'fulfilled' ? (complaints.value as any[]).length : 0,
          });
        } else if (userRole === "employer") {
          const [jobs, candidates, interviews] = await Promise.allSettled([
            employerService.getJobOrderCount("ACTIVE"),
            employerService.getCandidateCount(),
            employerService.getInterviewCount()
          ]);

          setBadges({
            jobOrders: jobs.status === 'fulfilled' ? jobs.value : 0,
            candidates: candidates.status === 'fulfilled' ? candidates.value : 0,
            interviews: interviews.status === 'fulfilled' ? interviews.value : 0,
          });
        } else if (userRole === "admin") {
          // Admin routes use different structure for response unwrap in adminService.ts
          // so we wrap with try/catch fallback since they aren't fully integrated yet
          try {
            const stats = await adminService.getDashboardStats();
            if (stats && stats.data) {
              const d = stats.data;
              setBadges({
                applicants: d.totalApplicants || 0,
                employers: d.totalEmployers || 0,
                jobOrders: d.totalJobOrders || 0,
                applications: d.totalApplications || 0,
                complaints: d.totalComplaints || 0,
                deployments: d.totalDeployments || 0,
              });
            }
          } catch (e) {
            console.warn("Failed to fetch admin badges", e);
          }
        }
      } catch (error) {
        console.error("Error fetching sidebar badges:", error);
      }
    };

    if (user) {
      fetchBadges();
      // Polling every minute to keep badges updated
      const interval = setInterval(fetchBadges, 60000);
      return () => clearInterval(interval);
    }
  }, [userRole, user]);

  // Get navigation based on role
  const getNavigation = () => {
    switch (userRole) {
      case "employer":
        return getEmployerNavigation(badges);
      case "admin":
        return getAdminNavigation(badges);
      default:
        return getApplicantNavigation(badges);
    }
  };

  // Get user info based on role
  const getUserInfo = () => {
    // Return real user data from auth store
    if (user) {
      let name = user.email;
      let initials = user.email.substring(0, 2).toUpperCase();

      if (userRole === "employer" && user.employer?.name) {
        name = user.employer.name;
        initials = name
          .split(" ")
          .map((word: string) => word[0])
          .join("")
          .toUpperCase()
          .substring(0, 2);
      } else if (
        userRole === "applicant" &&
        user.profile?.firstName &&
        user.profile?.lastName
      ) {
        name = `${user.profile.firstName} ${user.profile.lastName}`;
        initials =
          (user.profile.firstName?.[0] || "") +
          (user.profile.lastName?.[0] || "");
      } else if (userRole === "admin" && user.profile?.firstName) {
        name = user.profile.firstName;
        initials = user.profile.firstName.substring(0, 2).toUpperCase();
      }

      return {
        name,
        email: user.email,
        initials: initials.substring(0, 2),
      };
    }

    // Fallback defaults if no user data
    switch (userRole) {
      case "employer":
        return {
          name: "Company",
          email: "contact@company.com",
          initials: "CO",
        };
      case "admin":
        return {
          name: "Admin",
          email: "admin@legaforce.com",
          initials: "AD",
        };
      default:
        return {
          name: "User",
          email: "user@example.com",
          initials: "US",
        };
    }
  };

  // Get settings path based on role
  const getSettingsPath = () => {
    switch (userRole) {
      case "employer":
        return "/employer/settings";
      case "admin":
        return "/admin/settings";
      default:
        return "/app/settings";
    }
  };

  const navigation = getNavigation();
  const userInfo = getUserInfo();
  const settingsPath = getSettingsPath();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    const { logout } = useAuthStore.getState();
    logout();
    navigate("/login", { replace: true });
  };

  // Get role badge color
  const getRoleBadge = () => {
    switch (userRole) {
      case "employer":
        return {
          label: "Employer",
          className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        };
      case "admin":
        return {
          label: "Admin",
          className: "bg-purple-500/10 text-purple-500 border-purple-500/20",
        };
      default:
        return {
          label: "Applicant",
          className: "bg-accent/10 text-accent border-accent/20",
        };
    }
  };

  const roleBadge = getRoleBadge();
  const unreadCount = allNotifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            <Link to="/" className="flex items-center gap-3">
              <div className="relative flex items-center justify-center p-1 w-10 h-10 rounded-md overflow-hidden shine-effect">
                {/* Navy Background with Gold Accent */}
                <div className="absolute inset-0 " />
                {/* Logo Text */}
                <span className="relative font-bold text-lg ">
                  <img src="/legaforce-logo.png" alt="Logo" />
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl tracking-tight">
                  Legaforce
                </span>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Info */}
          <div className="px-4 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-accent text-accent-foreground font-semibold">
                {userInfo.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {userInfo.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {userInfo.email}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <Badge className={cn("text-xs", roleBadge.className)}>
                {roleBadge.label}
              </Badge>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-thin">
            {navigation.map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                className={cn(sectionIndex > 0 && "mt-6")}
              >
                {section.title && (
                  <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {section.title}
                  </h3>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                        isActive(item.href)
                          ? "bg-accent/10 text-accent"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted",
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <Badge
                          variant={
                            isActive(item.href) ? "default" : "secondary"
                          }
                          className={cn(
                            "h-5 min-w-5 flex items-center justify-center text-xs",
                            isActive(item.href) &&
                            "bg-accent text-accent-foreground",
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-border space-y-1">
            <Link
              to={settingsPath}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-72">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="flex items-center justify-between h-full px-4 sm:px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="hidden sm:block">
                <h1 className="text-lg font-display font-semibold">
                  {navigation
                    .flatMap((s) => s.items)
                    .find((n) => isActive(n.href))?.name || "Dashboard"}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">

              <ThemeToggle />

              {/* ── Notification Bell with Dropdown ── */}
              <div className="relative" ref={notifRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={async () => {
                    const willOpen = !showNotifDropdown;
                    setShowNotifDropdown(willOpen);

                    if (willOpen && unreadCount > 0) {
                      try {
                        await notificationApiService.markAllRead();
                        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                      } catch (err) {
                        console.error("Failed to mark notifications as read:", err);
                      }
                    }
                  }}
                  id="notification-bell"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold bg-accent text-accent-foreground rounded-full px-1 animate-pulse">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                  {unreadCount === 0 && notifications.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-muted-foreground/40 rounded-full" />
                  )}
                </Button>

                {/* Notification Dropdown */}
                <AnimatePresence>
                  {showNotifDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-50"
                    >
                      {/* Dropdown Header */}
                      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-accent" />
                          <h3 className="font-semibold text-sm">Notifications</h3>
                          {unreadCount > 0 && (
                            <Badge className="bg-accent text-accent-foreground text-[10px] h-5">
                              {unreadCount} new
                            </Badge>
                          )}
                        </div>
                        {sseConnected && (
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[10px] text-emerald-500 font-medium">Live</span>
                          </div>
                        )}
                      </div>

                      {/* Notification List */}
                      <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
                        {allNotifications.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                            <Bell className="w-8 h-8 mb-2 opacity-40" />
                            <p className="text-sm">No notifications yet</p>
                            <p className="text-xs mt-1">You'll see updates here</p>
                          </div>
                        ) : (
                          allNotifications.slice(0, 10).map((notif: any, idx: number) => (
                            <div
                              key={notif.id || notif._id || idx}
                              className={cn(
                                "px-4 py-3 border-b border-border/50 hover:bg-muted/50 cursor-pointer transition-colors",
                                !notif.read && "bg-accent/5"
                              )}
                              onClick={async () => {
                                setShowNotifDropdown(false);

                                // Mark as read locally and on server
                                if (!notif.read) {
                                  try {
                                    const nid = notif.id;
                                    if (nid && !String(nid).startsWith('sse-')) {
                                      await notificationApiService.markRead(nid);
                                    }
                                    // Update local state
                                    setNotifications(prev => prev.map(n => n.id === nid ? { ...n, read: true } : n));
                                  } catch (e) {
                                    console.error("Failed to mark as read", e);
                                  }
                                }

                                // Dynamic navigation based on notification link or role
                                if (notif.link) {
                                  navigate(notif.link);
                                } else {
                                  if (userRole === "applicant") navigate("/app/applications");
                                  else if (userRole === "employer") navigate("/employer/dashboard");
                                  else navigate("/admin/dashboard");
                                }
                              }}
                            >
                              <div className="flex items-start gap-3">
                                <div className={cn("mt-0.5", getNotifColor(notif.type))}>
                                  {getNotifIconType(notif.type) === "success" ? (
                                    <CheckCircle className="w-4 h-4" />
                                  ) : getNotifIconType(notif.type) === "warning" ? (
                                    <AlertTriangle className="w-4 h-4" />
                                  ) : (
                                    <Bell className="w-4 h-4" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className={cn("text-sm font-medium truncate", !notif.read && "text-foreground")}>
                                      {notif.title}
                                    </p>
                                    {!notif.read && (
                                      <span className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                    {notif.message}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground/70 mt-1">
                                    {timeAgo(notif.date || notif.createdAt)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="hidden sm:flex items-center gap-2 ml-2 pl-2 border-l border-border">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10 text-accent font-semibold text-sm">
                  {userInfo.initials}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Suspense fallback={<PageContentSkeleton />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
