import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Users,
  Building2,
  Briefcase,
  FileText,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "For Applicants",
    href: "/applicants",
    icon: Users,
    description: "Find your dream job abroad",
  },
  {
    name: "For Employers",
    href: "/employers",
    icon: Building2,
    description: "Hire skilled Filipino workers",
  },
  {
    name: "Services",
    href: "/services",
    icon: Briefcase,
    description: "Our recruitment services",
  },
  {
    name: "About",
    href: "/about",
    icon: FileText,
    description: "Learn about Legaforce",
  },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "glass border-b border-border/50 py-2"
          : "bg-transparent py-4"
      )}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden shine-effect">
              {/* Navy Background with Gold Accent */}
              <div className="absolute inset-0 bg-primary dark:bg-accent" />
              {/* Logo Text */}
              <span className="relative font-bold text-lg text-primary-foreground dark:text-accent-foreground">
                L
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl tracking-tight">
                Legaforce
              </span>
              <span className="text-[10px] text-muted-foreground tracking-wider uppercase hidden sm:block">
                Recruitment Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive(item.href)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.name}
                {isActive(item.href) && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-lg bg-accent/10 -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex lg:items-center lg:gap-3">
            <ThemeToggle />
            <Link to="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button
                size="sm"
                className="group relative overflow-hidden gradient-bg-accent text-accent-foreground font-semibold shadow-sm hover:shadow-lg hover:shadow-accent/20 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                {/* Shine on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className="relative"
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-6 space-y-2">
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-medium transition-all",
                        isActive(item.href)
                          ? "bg-accent/10 text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center w-10 h-10 rounded-lg",
                          isActive(item.href)
                            ? "bg-accent text-accent-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="pt-4 px-4 space-y-3"
                >
                  <Link to="/login" className="block">
                    <Button variant="outline" className="w-full h-12">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register" className="block">
                    <Button className="w-full h-12 gradient-bg-accent text-accent-foreground font-semibold">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Get Started Free
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
