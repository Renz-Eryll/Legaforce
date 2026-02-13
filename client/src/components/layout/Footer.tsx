import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
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

const getFooterLinks = (t: any) => ({
  company: [
    { name: t("footer.about"), href: "/about" },
    { name: t("footer.careers"), href: "/careers" },
    { name: t("footer.press"), href: "/press" },
    { name: t("footer.blog"), href: "/blog" },
  ],
  services: [
    { name: t("footer.jobs"), href: "/jobs" },
    { name: t("footer.recruitment"), href: "/recruitment" },
    { name: t("footer.process"), href: "/services" },
    { name: t("footer.compliance"), href: "/compliance" },
  ],
  support: [
    { name: t("footer.helpCenter"), href: "/help" },
    { name: t("footer.contact"), href: "/contact" },
    { name: t("footer.privacy"), href: "/privacy" },
    { name: t("footer.terms"), href: "/terms" },
  ],
});

const socialLinks = (t: any) => [
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
];

export function Footer() {
  const { t } = useTranslation();
  const footerLinks = getFooterLinks(t);
  const socialLinksArray = socialLinks(t);
  return (
    <footer className="relative overflow-hidden bg-primary dark:bg-card">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Section */}

        {/* Main Footer Content */}
        <div className="py-12 lg:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative flex items-center justify-center p-1 w-10 h-10 rounded-md overflow-hidden shine-effect">
                {/* Navy Background with Gold Accent */}
                <div className="absolute inset-0 bg-white" />
                {/* Logo Text */}
                <span className="relative font-bold text-lg ">
                  <img src="legaforce-logo.png" alt="Logo" />
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl tracking-tight">
                  Legaforce
                </span>
                <span className="text-[10px] text-accent tracking-wider uppercase hidden sm:block">
                  Recruitment Platform
                </span>
              </div>
            </Link>
            <p className="text-primary-foreground/60 dark:text-muted-foreground text-sm leading-relaxed max-w-sm mb-8">
              {t("footer.companyDescription")}
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
                  {t("footer.philippines")}
                </span>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-primary-foreground dark:text-foreground mb-6">
              {t("footer.company")}
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
              {t("footer.services")}
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
              {t("footer.support")}
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
            © {new Date().getFullYear()} Legaforce. {t("footer.rights")}
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            {socialLinksArray.map((social) => (
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
