import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { BrandMark } from "@/components/brand/BrandMark";

const getLinkGroups = (t: TFunction) => [
  {
    title: t("footer.company"),
    links: [
      { name: t("footer.about"), href: "/about" },
      { name: t("footer.careers"), href: "/careers" },
      { name: t("footer.press"), href: "/press" },
      { name: t("footer.blog"), href: "/blog" },
    ],
  },
  {
    title: t("footer.services"),
    links: [
      { name: t("footer.jobs"), href: "/jobs" },
      { name: t("footer.recruitment"), href: "/recruitment" },
      { name: t("footer.process"), href: "/services" },
      { name: t("footer.compliance"), href: "/compliance" },
    ],
  },
  {
    title: t("footer.support"),
    links: [
      { name: t("footer.helpCenter"), href: "/help" },
      { name: t("footer.contact"), href: "/contact" },
      { name: t("footer.privacy"), href: "/privacy" },
      { name: t("footer.terms"), href: "/terms" },
    ],
  },
];

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
];

export function Footer() {
  const { t } = useTranslation();

  const accreditations = [
    t("landing.trustIndicators.poea"),
    t("landing.trustIndicators.dmw"),
    t("landing.trustIndicators.owwa"),
    t("landing.trustIndicators.iso"),
  ];

  const contacts = [
    { label: t("footer.email"), value: "info@legaforce.com", href: "mailto:info@legaforce.com" },
    { label: t("footer.phone"), value: "+63 912 345 6789", href: "tel:+639123456789" },
    { label: t("footer.location"), value: t("footer.philippines") },
  ];

  return (
    <footer className="border-t border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="container">
        <ul className="grid grid-cols-2 gap-px border-b border-sidebar-border bg-sidebar-border md:grid-cols-4">
          {accreditations.map((item) => (
            <li
              key={item}
              className="flex items-center gap-3 bg-sidebar py-5 pr-4 text-sm font-semibold even:pl-5 md:[&:not(:first-child)]:pl-6"
            >
              <span className="diamond bg-accent" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>

        <div className="grid gap-12 py-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <BrandMark tone="dark" tagline="Manpower Recruitment" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-sidebar-muted">{t("footer.companyDescription")}</p>
            <dl className="mt-8 space-y-3">
              {contacts.map((contact) => (
                <div key={contact.label} className="flex items-baseline gap-4 text-sm">
                  <dt className="w-20 shrink-0 font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-sidebar-muted">
                    {contact.label}
                  </dt>
                  <dd>
                    {contact.href ? (
                      <a href={contact.href} className="transition-colors hover:text-accent">
                        {contact.value}
                      </a>
                    ) : (
                      contact.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            {getLinkGroups(t).map((group) => (
              <div key={group.title}>
                <h4 className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-sidebar-muted">
                  {group.title}
                </h4>
                <ul className="mt-5 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link to={link.href} className="text-sm text-sidebar-foreground/85 transition-colors hover:text-accent">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-5 border-t border-sidebar-border py-6 sm:flex-row sm:items-center">
          <p className="text-xs text-sidebar-muted">
            © {new Date().getFullYear()} Legaforce. {t("footer.rights")}
          </p>
          <div className="flex items-center gap-1">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                aria-label={social.name}
                className="grid h-9 w-9 place-items-center rounded-md text-sidebar-muted transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
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
