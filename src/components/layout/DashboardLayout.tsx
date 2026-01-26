import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronDown,
  Shield,
  HelpCircle,
  Star,
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

const applicantNavigation: NavItem[] = [
  { name: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
  { name: "My Applications", href: "/app/applications", icon: Briefcase, badge: 3 },
  { name: "Job Search", href: "/app/jobs", icon: FileText },
  { name: "My Profile", href: "/app/profile", icon: User },
  { name: "Rewards", href: "/app/rewards", icon: Star },
  { name: "Support", href: "/app/support", icon: HelpCircle },
];

interface DashboardLayoutProps {
  userRole?: "applicant" | "employer" | "admin";
  userName?: string;
  userEmail?: string;
}

export function DashboardLayout({
  userRole = "applicant",
  userName = "Juan Dela Cruz",
  userEmail = "juan@example.com",
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = applicantNavigation;

  const isActive = (path: string) => location.pathname === path;

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
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold text-sm">
                L
              </div>
              <span className="font-bold text-lg tracking-tight text-sidebar-foreground">
                Legaforce
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon-sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Info */}
          <div className="px-4 py-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent text-accent-foreground font-semibold text-sm">
                {userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {userName}
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  {userEmail}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <Badge
                    variant={isActive(item.href) ? "premium" : "secondary"}
                    className="h-5 min-w-5 flex items-center justify-center text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-sidebar-border space-y-1">
            <Link
              to="/app/settings"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full">
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-lg border-b border-border">
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
                <h1 className="text-lg font-semibold">
                  {navigation.find((n) => isActive(n.href))?.name || "Dashboard"}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
              </Button>
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
