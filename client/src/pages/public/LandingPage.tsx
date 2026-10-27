import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { ArrowRight, Award, FileCheck, Globe, Shield, Sparkles, Zap } from "lucide-react";
import { AuthCTA } from "@/components/AuthCTA";
import { Button } from "@/components/ui/button";
import {
  CtaBand,
  DeploymentPass,
  DiamondMark,
  FeatureGrid,
  QuoteCard,
  Reveal,
  RouteSteps,
  SectionHeader,
  StatStrip,
  type Feature,
  type Quote,
  type RouteStep,
  type Stat,
} from "@/components/marketing";

const getStats = (t: TFunction): Stat[] => [
  { value: "50,000+", label: t("landing.stats.workersDeployed") },
  { value: "500+", label: t("landing.stats.partnerEmployers") },
  { value: "30+", label: t("landing.stats.countries") },
  { value: "98%", label: t("landing.stats.successRate") },
];

const getFeatures = (t: TFunction): Feature[] => [
  { icon: Sparkles, title: t("landing.features.aiCVBuilder.title"), description: t("landing.features.aiCVBuilder.description") },
  { icon: Zap, title: t("landing.features.fasterDeployment.title"), description: t("landing.features.fasterDeployment.description") },
  { icon: Shield, title: t("landing.features.workerProtection.title"), description: t("landing.features.workerProtection.description") },
  { icon: Globe, title: t("landing.features.globalOpportunities.title"), description: t("landing.features.globalOpportunities.description") },
  { icon: FileCheck, title: t("landing.features.tracking.title"), description: t("landing.features.tracking.description") },
  { icon: Award, title: t("landing.features.rewards.title"), description: t("landing.features.rewards.description") },
];

const getSteps = (t: TFunction): RouteStep[] =>
  [1, 2, 3, 4].map((n) => ({
    title: t(`landing.howItWorks.step${n}.title`),
    description: t(`landing.howItWorks.step${n}.description`),
  }));

const getTrustIndicators = (t: TFunction) => [
  t("landing.trustIndicators.poea"),
  t("landing.trustIndicators.dmw"),
  t("landing.trustIndicators.owwa"),
  t("landing.trustIndicators.iso"),
];

const testimonials: Quote[] = [
  {
    quote:
      "Legaforce made my dream of working abroad a reality. The process was transparent and I felt supported every step of the way.",
    name: "Maria Santos",
    role: "Nurse · Saudi Arabia",
    initials: "MS",
  },
  {
    quote: "The AI CV builder helped me present my skills professionally. I got shortlisted within a week of applying!",
    name: "Jose Reyes",
    role: "Engineer · Qatar",
    initials: "JR",
  },
  {
    quote: "Unlike other agencies, Legaforce kept me informed throughout the process. No hidden fees, no surprises.",
    name: "Anna Cruz",
    role: "Hotel Staff · UAE",
    initials: "AC",
  },
];

export default function LandingPage() {
  const { t } = useTranslation();
  const [featured, ...otherQuotes] = testimonials;

  return (
    <>
      {/* Hero: the promise on the left, what tracking actually looks like on the right */}
      <section className="relative overflow-hidden border-b border-border">
        <DiamondMark className="absolute -left-40 top-24 h-[620px] w-[620px] text-primary/[0.03] dark:text-white/[0.025]" />
        <div className="container relative grid gap-14 pb-14 pt-14 lg:grid-cols-12 lg:items-center lg:gap-8 lg:pb-20 lg:pt-20">
          <Reveal immediate className="lg:col-span-7">
            <p className="eyebrow">{t("landing.hero.badge")}</p>
            <h1 className="mt-6 font-display text-[50px] font-extrabold uppercase leading-[0.9] sm:text-7xl xl:text-[92px]">
              {t("landing.hero.title")}
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground">{t("landing.hero.subtitle")}</p>
            <AuthCTA
              className="mt-9"
              primaryText={t("landing.hero.cta")}
              secondaryText={t("common.ourServices")}
              primaryLink="/register"
              secondaryLink="/services"
            />
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-6">
              {getTrustIndicators(t).map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                  <span className="diamond bg-accent" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal immediate delay={0.15} className="lg:col-span-5">
            <DeploymentPass />
          </Reveal>
        </div>
        <div className="container relative pb-16 lg:pb-20">
          <Reveal immediate delay={0.25}>
            <StatStrip items={getStats(t)} />
          </Reveal>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container">
          <SectionHeader
            eyebrow={t("landing.features.title")}
            title={t("landing.features.subtitle")}
            description={t("landing.features.description")}
          />
          <Reveal className="mt-12">
            <FeatureGrid items={getFeatures(t)} />
          </Reveal>
        </div>
      </section>

      <section className="border-y border-border bg-card py-20 lg:py-28">
        <div className="container">
          <SectionHeader
            eyebrow={t("landing.howItWorks.title")}
            title={t("landing.howItWorks.subtitle")}
            description={t("landing.howItWorks.description")}
            action={
              <Button asChild variant="outline">
                <Link to="/services">
                  {t("common.ourServices")}
                  <ArrowRight />
                </Link>
              </Button>
            }
          />
          <Reveal className="mt-14">
            <RouteSteps steps={getSteps(t)} />
          </Reveal>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container">
          <SectionHeader eyebrow={t("landing.testimonials.title")} title={t("landing.testimonials.subtitle")} />
          <div className="mt-12 grid gap-4 lg:grid-cols-12">
            <Reveal className="lg:col-span-7 lg:row-span-2">
              <QuoteCard {...featured} featured />
            </Reveal>
            {otherQuotes.map((quote, i) => (
              <Reveal key={quote.name} delay={0.08 * (i + 1)} className="lg:col-span-5">
                <QuoteCard {...quote} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title={t("landing.cta.title")}
        description={t("landing.cta.subtitle")}
        actions={
          <AuthCTA
            tone="dark"
            size="xl"
            primaryText={t("landing.cta.button")}
            secondaryText={t("landing.cta.learnMore")}
            primaryLink="/register"
            secondaryLink="/about"
          />
        }
      />
    </>
  );
}
