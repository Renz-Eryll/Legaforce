import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BrandMark } from "@/components/brand/BrandMark";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAuthStore } from "@/stores/authStore";
import { getDashboardRoute } from "@/hooks/useNavigation";
import { cn } from "@/lib/utils";

export function Header() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const signedIn = isAuthenticated && !!user;

  const navigation = [
    { name: t("navigation.applicant.jobSearch"), href: "/jobs", description: "Find work abroad" },
    { name: t("navigation.employer.recruitment"), href: "/recruitment", description: "Hire Filipino talent" },
    { name: t("navigation.header.services"), href: "/services", description: "What we handle for you" },
    { name: t("navigation.header.about"), href: "/about", description: "Who we are" },
  ];

  // Close the mobile menu whenever the route changes
  useEffect(() => setMenuOpen(false), [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <nav className="container flex h-16 items-center justify-between gap-6" aria-label="Main">
        <BrandMark tagline="Manpower Recruitment" />

        <div className="hidden h-full items-stretch gap-1 lg:flex">
          {navigation.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "relative flex items-center px-3.5 text-sm font-semibold transition-colors",
                  "after:absolute after:inset-x-3.5 after:-bottom-px after:h-[3px] after:bg-accent after:transition-transform",
                  isActive
                    ? "text-foreground after:scale-x-100"
                    : "text-muted-foreground after:scale-x-0 hover:text-foreground",
                )
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-1 lg:flex">
          <LanguageSwitcher />
          <ThemeToggle />
          <span className="mx-2 h-6 w-px bg-border" aria-hidden="true" />
          {signedIn ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to={getDashboardRoute(user.role)}>
                  <LayoutDashboard />
                  Dashboard
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut />
                {t("common.logout")}
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">{t("common.signIn")}</Link>
              </Button>
              <Button asChild size="sm" className="ml-1">
                <Link to="/register">
                  {t("common.getStarted")}
                  <ArrowRight />
                </Link>
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="!size-5" /> : <Menu className="!size-5" />}
          </Button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden border-t border-border bg-background lg:hidden"
          >
            <div className="container py-4">
              <ul className="divide-y divide-border border-b border-border">
                {navigation.map((item, i) => (
                  <li key={item.href}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        cn("flex items-baseline gap-4 py-4", isActive ? "text-foreground" : "text-foreground/80")
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span className={cn("font-mono text-xs", isActive ? "text-accent-text" : "text-muted-foreground")}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="flex-1">
                            <span className="block font-display text-xl font-bold uppercase">{item.name}</span>
                            <span className="text-sm text-muted-foreground">{item.description}</span>
                          </span>
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
              <div className="grid gap-2 pt-4 sm:grid-cols-2">
                {signedIn ? (
                  <>
                    <Button asChild variant="outline" size="lg">
                      <Link to={getDashboardRoute(user.role)}>
                        <LayoutDashboard />
                        Go to Dashboard
                      </Link>
                    </Button>
                    <Button variant="ghost" size="lg" onClick={handleLogout}>
                      <LogOut />
                      {t("common.logout")}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline" size="lg">
                      <Link to="/login">{t("common.signIn")}</Link>
                    </Button>
                    <Button asChild size="lg">
                      <Link to="/register">
                        {t("common.getStarted")}
                        <ArrowRight />
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
