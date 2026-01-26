import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

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
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent text-accent-foreground font-bold text-lg">
                L
              </div>
              <span className="font-bold text-xl tracking-tight">
                Legaforce
              </span>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed max-w-sm mb-6">
              Empowering Filipino workers with transparent, ethical recruitment
              services. Your trusted partner for overseas employment
              opportunities.
            </p>
            <div className="space-y-3 text-sm">
              <a
                href="mailto:info@legaforce.com"
                className="flex items-center gap-2 text-primary-foreground/70 hover:text-accent transition-colors"
              >
                <Mail className="h-4 w-4" />
                info@legaforce.com
              </a>
              <a
                href="tel:+639123456789"
                className="flex items-center gap-2 text-primary-foreground/70 hover:text-accent transition-colors"
              >
                <Phone className="h-4 w-4" />
                +63 912 345 6789
              </a>
              <div className="flex items-start gap-2 text-primary-foreground/70">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>
                  123 Recruitment Building, Makati City,
                  <br />
                  Metro Manila, Philippines
                </span>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-primary-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Legaforce. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="text-primary-foreground/60 hover:text-accent transition-colors"
                aria-label={social.name}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
