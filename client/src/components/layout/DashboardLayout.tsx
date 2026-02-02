import { useState, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
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

// Applicant Navigation
const applicantNavigation: NavSection[] = [
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
        badge: 3,
      },
      { name: "Saved Jobs", href: "/app/saved-jobs", icon: Star },
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
      { name: "Rewards", href: "/app/rewards", icon: Star, badge: "250 pts" },
      { name: "Support", href: "/app/support", icon: HelpCircle },
      { name: "Complaints", href: "/app/complaints", icon: MessageSquare },
    ],
  },
];

// Employer Navigation
const employerNavigation: NavSection[] = [
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
        badge: 5,
      },
      { name: "Candidates", href: "/employer/candidates", icon: Users },
      {
        name: "Interviews",
        href: "/employer/interviews",
        icon: UserCheck,
        badge: 2,
      },
    ],
  },
  {
    title: "Management",
    items: [
      { name: "Deployments", href: "/employer/deployments", icon: Globe },
      { name: "Invoices", href: "/employer/invoices", icon: DollarSign },
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

// Admin Navigation
const adminNavigation: NavSection[] = [
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
        badge: 120,
      },
      {
        name: "Employers",
        href: "/admin/employers",
        icon: Building2,
        badge: 45,
      },
      { name: "Job Orders", href: "/admin/job-orders", icon: Briefcase },
    ],
  },
  {
    title: "Workflows",
    items: [
      {
        name: "Applications",
        href: "/admin/applications",
        icon: ClipboardList,
        badge: 28,
      },
      { name: "Deployments", href: "/admin/deployments", icon: Globe },
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
    title: "Support",
    items: [
      {
        name: "Complaints",
        href: "/admin/complaints",
        icon: AlertTriangle,
        badge: 5,
      },
      { name: "User Verification", href: "/admin/verification", icon: Shield },
    ],
  },
];

interface DashboardLayoutProps {
  userRole?: "applicant" | "employer" | "admin";
}

export function DashboardLayout({
  userRole = "applicant",
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Get navigation based on role
  const getNavigation = () => {
    switch (userRole) {
      case "employer":
        return employerNavigation;
      case "admin":
        return adminNavigation;
      default:
        return applicantNavigation;
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
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
              </Button>
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
          <Outlet />
        </main>
      </div>
    </div>
  );
}
