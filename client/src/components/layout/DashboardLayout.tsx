import { useState, useEffect, useRef, Suspense } from "react";
import type React from "react";
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

import { BrandMark } from "@/components/brand/BrandMark";
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

type Badges = Record<string, string | number>;

/** A notification from either the REST list or the live SSE stream */
interface NotificationItem {
  id?: string;
  _id?: string;
  type: string;
  title?: string;
  message?: string;
  read?: boolean;
  link?: string;
  date?: string;
  createdAt?: string;
}

// Applicant Navigation - will be translated in component
const getApplicantNavigation = (badges: Badges = {}): NavSection[] => [
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
const getEmployerNavigation = (badges: Badges = {}): NavSection[] => [
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
const getAdminNavigation = (badges: Badges = {}): NavSection[] => [
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

// ── Notification marker colour ──────────────────
// Handles both SSE types (success/warning/info) and DB enum types (APPLICATION_STATUS, DEPLOYMENT, etc.)
function getNotifTone(type: string): string {
  switch (type) {
    case "success":
    case "DEPLOYMENT":
    case "OFFER":
      return "bg-success";
    case "warning":
      return "bg-warning";
    default:
      return "bg-primary dark:bg-accent";
  }
}

// ── Role presentation ───────────────────────────
const ROLE_META: Record<NonNullable<DashboardLayoutProps["userRole"]>, { label: string; color: string }> = {
  applicant: { label: "Applicant portal", color: "hsl(var(--accent))" },
  employer: { label: "Employer console", color: "#4FA8DE" },
  admin: { label: "Admin console", color: "#F2C14E" },
};

export function DashboardLayout({
  userRole = "applicant",
}: DashboardLayoutProps) {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [badges, setBadges] = useState<Badges>({});
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
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
    const merged: NotificationItem[] = [];
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
      const nid = n.id || n._id;
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

  // Close the notification dropdown on route change (ScrollToTop handles scrolling)
  useEffect(() => {
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
            applications: apps.status === 'fulfilled' ? (apps.value as unknown[]).length : 0,
            savedJobs: saved.status === 'fulfilled' ? (saved.value as unknown[]).length : 0,
            rewards: points.status === 'fulfilled' ? `${points.value} pts` : "0 pts",
            complaints: complaints.status === 'fulfilled' ? (complaints.value as unknown[]).length : 0,
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

  // Detail pages (e.g. /app/jobs/123) keep their parent item highlighted
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  const handleLogout = () => {
    const { logout } = useAuthStore.getState();
    logout();
    navigate("/login", { replace: true });
  };

  const role = ROLE_META[userRole];
  const unreadCount = allNotifications.filter((n) => !n.read).length;

  const currentPage = navigation.flatMap((s) => s.items).find((n) => isActive(n.href))?.name ?? "Dashboard";

  const handleBellClick = async () => {
    const willOpen = !showNotifDropdown;
    setShowNotifDropdown(willOpen);

    if (willOpen && unreadCount > 0) {
      try {
        await notificationApiService.markAllRead();
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      } catch (err) {
        console.error("Failed to mark notifications as read:", err);
      }
    }
  };

  const handleNotificationClick = async (notif: NotificationItem) => {
    setShowNotifDropdown(false);

    // Mark as read locally and on server
    if (!notif.read) {
      try {
        const nid = notif.id;
        if (nid && !String(nid).startsWith("sse-")) {
          await notificationApiService.markRead(nid);
        }
        setNotifications((prev) => prev.map((n) => (n.id === nid ? { ...n, read: true } : n)));
      } catch (e) {
        console.error("Failed to mark as read", e);
      }
    }

    // Dynamic navigation based on notification link or role
    if (notif.link) {
      navigate(notif.link);
    } else if (userRole === "applicant") navigate("/app/applications");
    else if (userRole === "employer") navigate("/employer/dashboard");
    else navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-background" style={{ "--role": role.color } as React.CSSProperties}>
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-sidebar/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Rail */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-start justify-between gap-2 border-b border-sidebar-border px-5 pb-4 pt-5">
          <div>
            <BrandMark tone="dark" />
            <p className="mt-2 pl-[46px] font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--role)]">
              {role.label}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X />
          </Button>
        </div>

        <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 py-4" aria-label="Dashboard">
          {navigation.map((section, sectionIndex) => (
            <div key={section.title ?? sectionIndex} className={cn(sectionIndex > 0 && "mt-5")}>
              {section.title && (
                <h3 className="mb-1.5 px-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-muted">
                  {section.title}
                </h3>
              )}
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          active
                            ? "bg-sidebar-accent text-sidebar-foreground before:absolute before:-left-3 before:inset-y-1.5 before:w-1 before:rounded-r-sm before:bg-[var(--role)]"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                        )}
                      >
                        <item.icon className={cn("h-[18px] w-[18px] shrink-0", active && "text-[var(--role)]")} strokeWidth={1.8} />
                        <span className="flex-1 truncate">{item.name}</span>
                        {item.badge ? (
                          <span
                            className={cn(
                              "rounded-sm px-1.5 py-px font-mono text-[11px] tabular",
                              active ? "bg-[var(--role)] text-sidebar" : "bg-sidebar-border text-sidebar-muted",
                            )}
                          >
                            {item.badge}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-3 border-t border-sidebar-border px-4 py-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sidebar-accent font-mono text-xs font-semibold text-[var(--role)]">
            {userInfo.initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold leading-tight">{userInfo.name}</p>
            <p className="truncate text-[11.5px] text-sidebar-muted">{userInfo.email}</p>
          </div>
          <Link
            to={settingsPath}
            aria-label="Settings"
            title="Settings"
            className={cn(
              "grid h-8 w-8 place-items-center rounded-md transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
              isActive(settingsPath) ? "text-[var(--role)]" : "text-sidebar-muted",
            )}
          >
            <Settings className="h-4 w-4" />
          </Link>
          <button
            onClick={handleLogout}
            aria-label="Sign out"
            title="Sign out"
            className="grid h-8 w-8 place-items-center rounded-md text-sidebar-muted transition-colors hover:bg-destructive/15 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* Work area */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="!size-5" />
              </Button>
              <p className="flex min-w-0 items-center gap-2 text-sm">
                <span className="hidden text-muted-foreground sm:inline">{role.label}</span>
                <span className="hidden text-border-strong sm:inline" aria-hidden="true">/</span>
                <span className="truncate font-semibold">{isActive(settingsPath) ? "Settings" : currentPage}</span>
              </p>
            </div>

            <div className="flex items-center gap-1">
              <ThemeToggle />

              <div className="relative" ref={notifRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={handleBellClick}
                  id="notification-bell"
                  aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
                  aria-expanded={showNotifDropdown}
                >
                  <Bell className="!size-5" />
                  {unreadCount > 0 && (
                    <span className="absolute right-1 top-1 grid h-[18px] min-w-[18px] place-items-center rounded-sm bg-accent px-1 font-mono text-[10px] font-semibold text-accent-foreground">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Button>

                <AnimatePresence>
                  {showNotifDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.14 }}
                      className="absolute right-0 top-12 z-50 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-lg border bg-popover shadow-xl"
                    >
                      <div className="flex items-center justify-between border-b px-4 py-3">
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-base font-bold uppercase tracking-wide">Notifications</h3>
                          {unreadCount > 0 && (
                            <span className="rounded-sm bg-accent px-1.5 py-px font-mono text-[10.5px] font-semibold text-accent-foreground">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {sseConnected && (
                          <span className="flex items-center gap-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-wider text-success">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                            Live
                          </span>
                        )}
                      </div>

                      <div className="scrollbar-thin max-h-[400px] overflow-y-auto">
                        {allNotifications.length === 0 ? (
                          <div className="hatch m-3 flex flex-col items-center justify-center rounded-md border border-dashed border-border-strong px-4 py-8 text-center">
                            <Bell className="mb-2 h-6 w-6 text-muted-foreground" />
                            <p className="text-sm font-semibold">No notifications yet</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">You'll see updates here</p>
                          </div>
                        ) : (
                          <ul className="divide-y">
                            {allNotifications.slice(0, 10).map((notif, idx) => (
                              <li key={notif.id || notif._id || idx}>
                                <button
                                  type="button"
                                  onClick={() => handleNotificationClick(notif)}
                                  className={cn(
                                    "grid w-full grid-cols-[14px_1fr_auto] gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60",
                                    !notif.read && "bg-accent/[0.06]",
                                  )}
                                >
                                  <span className={cn("diamond mt-1.5", getNotifTone(notif.type))} aria-hidden="true" />
                                  <span className="min-w-0">
                                    <span className="block truncate text-sm font-semibold">{notif.title}</span>
                                    <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">{notif.message}</span>
                                  </span>
                                  <time className="whitespace-nowrap pt-0.5 font-mono text-[10.5px] text-muted-foreground">
                                    {timeAgo(notif.date || notif.createdAt)}
                                  </time>
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <span className="ml-2 hidden h-8 w-8 place-items-center rounded-full bg-muted font-mono text-xs font-semibold text-primary sm:grid dark:text-accent">
                {userInfo.initials}
              </span>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Suspense fallback={<PageContentSkeleton />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
