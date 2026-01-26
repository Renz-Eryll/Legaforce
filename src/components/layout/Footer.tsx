import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const footerLinks = {
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
    { name: "Blog", href: "/blog" },
  ],
  services: [
    { name: "For Applicants", href: "/applicants" },
    { name: "For Employers", href: "/employers" },
    { name: "Recruitment Process", href: "/services" },
    { name: "Compliance", href: "/compliance" },
  ],
  support: [
    { name: "Help Center", href: "/help" },
    { name: "Contact Us", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-primary dark:bg-card">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Section */}
        <div className="py-16 lg:py-20 border-b border-primary-foreground/10 dark:border-border">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-primary-foreground dark:text-foreground mb-6">
                Ready to Transform Your{" "}
                <span className="text-accent">Recruitment Journey?</span>
              </h2>
              <p className="text-lg text-primary-foreground/70 dark:text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of workers and employers who trust Legaforce for
                transparent, ethical, and efficient recruitment.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register">
                  <Button
                    size="lg"
                    className="group gradient-bg-accent text-accent-foreground font-semibold shadow-lg hover:shadow-xl hover:shadow-accent/20 px-8 transition-all duration-300"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Start Your Journey
                    <ArrowUpRight className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary dark:border-border dark:text-foreground dark:hover:bg-muted px-8"
                  >
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12 lg:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative flex items-center justify-center w-12 h-12 rounded-xl overflow-hidden bg-accent">
                <span className="relative font-bold text-xl text-accent-foreground">L</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-2xl text-primary-foreground dark:text-foreground">
                  Legaforce
                </span>
                <span className="text-xs text-primary-foreground/50 dark:text-muted-foreground tracking-wider uppercase">
                  Recruitment Platform
                </span>
              </div>
            </Link>
            <p className="text-primary-foreground/60 dark:text-muted-foreground text-sm leading-relaxed max-w-sm mb-8">
              Empowering Filipino workers with transparent, ethical recruitment
              services. Your trusted partner for overseas employment
              opportunities since 2020.
            </p>
            <div className="space-y-4">
              <a
                href="mailto:info@legaforce.com"
                className="flex items-center gap-3 text-primary-foreground/60 dark:text-muted-foreground hover:text-accent transition-colors group"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-foreground/5 dark:bg-muted group-hover:bg-accent/10 transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="text-sm">info@legaforce.com</span>
              </a>
              <a
                href="tel:+639123456789"
                className="flex items-center gap-3 text-primary-foreground/60 dark:text-muted-foreground hover:text-accent transition-colors group"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-foreground/5 dark:bg-muted group-hover:bg-accent/10 transition-colors">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="text-sm">+63 912 345 6789</span>
              </a>
              <div className="flex items-start gap-3 text-primary-foreground/60 dark:text-muted-foreground">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-foreground/5 dark:bg-muted flex-shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-sm pt-2.5">
                  123 Recruitment Building, Makati City,
                  <br />
                  Metro Manila, Philippines
                </span>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-primary-foreground dark:text-foreground mb-6">
              Company
            </h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/60 dark:text-muted-foreground hover:text-accent transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-primary-foreground dark:text-foreground mb-6">
              Services
            </h4>
            <ul className="space-y-4">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/60 dark:text-muted-foreground hover:text-accent transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-primary-foreground dark:text-foreground mb-6">
              Support
            </h4>
            <ul className="space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/60 dark:text-muted-foreground hover:text-accent transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-primary-foreground/10 dark:border-border flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm text-primary-foreground/50 dark:text-muted-foreground">
            © {new Date().getFullYear()} Legaforce. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-foreground/5 dark:bg-muted text-primary-foreground/60 dark:text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all"
                aria-label={social.name}
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
