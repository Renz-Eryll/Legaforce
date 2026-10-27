import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { Handshake, Heart, Lightbulb, Shield } from "lucide-react";
import { AuthCTA } from "@/components/AuthCTA";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FeatureGrid,
  Highlight,
  PageHero,
  Reveal,
  SectionHeader,
  StatStrip,
  type Feature,
} from "@/components/marketing";

const getValues = (t: TFunction): Feature[] => [
  { icon: Heart, title: t("about.workerFirst"), description: t("about.workerFirstDesc") },
  { icon: Shield, title: t("about.integrity"), description: t("about.integrityDesc") },
  { icon: Lightbulb, title: t("about.innovation"), description: t("about.innovationDesc") },
  { icon: Handshake, title: t("about.partnership"), description: t("about.partnershipDesc") },
];

const getMilestones = (t: TFunction) => [
  { year: "2018", title: t("about.founded"), description: t("about.foundedDesc") },
  { year: "2019", title: t("about.poealicense"), description: t("about.poealicenseDesc") },
  { year: "2020", title: t("about.digitalPlatform"), description: t("about.digitalPlatformDesc") },
  { year: "2021", title: t("about.workers10k"), description: t("about.workers10kDesc") },
  { year: "2022", title: t("about.isoCertified"), description: t("about.isoCertifiedDesc") },
  { year: "2023", title: t("about.workers50k"), description: t("about.workers50kDesc") },
];

const getAccreditations = (t: TFunction) => [
  t("about.poea"),
  t("about.iso"),
  t("about.dmw"),
  t("about.owwa"),
  t("about.iom"),
  t("about.pjsfa"),
];

const getLeadership = (t: TFunction) => [
  { name: "Maria dela Cruz", role: t("about.ceo"), bio: t("about.yearsExperience"), initials: "MC" },
  { name: "Roberto Santos", role: t("about.coo"), bio: t("about.poealead"), initials: "RS" },
  { name: "Jennifer Tan", role: t("about.cto"), bio: t("about.techLead"), initials: "JT" },
];

const contactDetails = [
  { label: "Address", value: "Philippines" },
  { label: "Email", value: "info@legaforce.com", href: "mailto:info@legaforce.com" },
  { label: "Phone", value: "+63 2 1234 5678", href: "tel:+63212345678" },
];

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <>
      <PageHero
        eyebrow={t("about.badge")}
        title={
          <>
            {t("about.title")} <Highlight>{t("about.subtitle")}</Highlight>
          </>
        }
        description={t("about.description")}
        aside={
          <figure className="overflow-hidden rounded-lg border bg-card">
            <img
              src="/legaforce-image2.png"
              alt="Legaforce office reception"
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
            <figcaption className="flex items-center justify-between border-t px-4 py-2.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <span>Legaforce office</span>
              <span>Est. 2018</span>
            </figcaption>
          </figure>
        }
      />

      <section className="py-20 lg:py-28">
        <div className="container">
          <Reveal className="grid gap-px overflow-hidden rounded-lg border bg-border md:grid-cols-2">
            {[
              { title: t("about.mission"), text: t("about.missionDescription") },
              { title: t("about.vision"), text: t("about.visionDescription") },
            ].map((item) => (
              <div key={item.title} className="bg-card p-7 lg:p-10">
                <p className="eyebrow">{item.title}</p>
                <p className="mt-5 font-display text-2xl font-semibold leading-snug lg:text-[28px]">{item.text}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="pb-20 lg:pb-28">
        <div className="container">
          <SectionHeader eyebrow={t("about.values")} title={t("about.whyChooseUs")} />
          <Reveal className="mt-12">
            <FeatureGrid items={getValues(t)} columns={4} />
          </Reveal>
        </div>
      </section>

      <section className="border-y border-border bg-card py-20 lg:py-28">
        <div className="container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeader eyebrow={t("about.journey")} title={t("about.milestones")} />
          </div>
          <Reveal className="lg:col-span-8">
            <ol className="border-t border-border">
              {getMilestones(t).map((milestone) => (
                <li
                  key={milestone.year}
                  className="grid grid-cols-[4.5rem_1fr] gap-x-6 gap-y-1 border-b border-border py-5 sm:grid-cols-[6rem_14rem_1fr]"
                >
                  <span className="row-span-2 font-mono text-2xl font-medium tracking-tight text-primary sm:row-span-1 dark:text-accent">
                    {milestone.year}
                  </span>
                  <h3 className="text-base font-bold">{milestone.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{milestone.description}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container">
          <SectionHeader eyebrow={t("about.accreditations")} title="Trusted & Certified" />
          <Reveal className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {getAccreditations(t).map((item) => (
              <div key={item} className="flex items-center gap-3 bg-card px-5 py-5">
                <span className="diamond bg-accent" aria-hidden="true" />
                <span className="font-semibold">{item}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="pb-20 lg:pb-28">
        <div className="container">
          <SectionHeader
            eyebrow={t("about.leadership")}
            title="Our Team"
            description="Led by experienced professionals committed to transforming recruitment."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {getLeadership(t).map((person, i) => (
              <Reveal key={person.name} delay={0.06 * i} className="rounded-lg border bg-card p-6">
                <Avatar className="h-14 w-14 rounded-md">
                  <AvatarImage
                    src={`/images/team/${person.name.toLowerCase().replace(/\s+/g, "-")}.jpg`}
                    alt={person.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-md bg-sidebar font-mono text-sm font-semibold text-accent">
                    {person.initials}
                  </AvatarFallback>
                </Avatar>
                <h3 className="mt-5 text-lg font-bold">{person.name}</h3>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-text">{person.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{person.bio}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-card py-20 lg:py-28">
        <div className="container">
          <SectionHeader eyebrow="Our Impact" title="Making a Difference" />
          <Reveal className="mt-12">
            <StatStrip
              items={[
                { value: "50,000+", label: "Workers Deployed" },
                { value: "500+", label: "Partner Companies" },
                { value: "30+", label: "Countries" },
                { value: "98%", label: "Success Rate" },
              ]}
            />
          </Reveal>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <SectionHeader eyebrow="Contact Us" title="Get in Touch" />
            <AuthCTA
              className="mt-8"
              size="xl"
              primaryText="Get Started"
              secondaryText="View Services"
              primaryLink="/register"
              secondaryLink="/services"
            />
          </div>
          <Reveal className="lg:col-span-6">
            <dl className="divide-y overflow-hidden rounded-lg border bg-card">
              {contactDetails.map((item) => (
                <div key={item.label} className="flex items-baseline justify-between gap-6 px-5 py-4">
                  <dt className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {item.label}
                  </dt>
                  <dd className="text-sm font-semibold">
                    {item.href ? (
                      <a href={item.href} className="hover:text-primary dark:hover:text-accent">
                        {item.value}
                      </a>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>
    </>
  );
}
