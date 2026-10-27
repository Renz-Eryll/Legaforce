import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import {
  ArrowUpRight,
  Award,
  Briefcase,
  Clock,
  DollarSign,
  FileText,
  GraduationCap,
  Globe,
  HeartPulse,
  Shield,
  Sparkles,
  Wrench,
  type LucideIcon,
  UtensilsCrossed,
} from "lucide-react";
import { AuthCTA } from "@/components/AuthCTA";
import {
  CtaBand,
  FeatureGrid,
  Highlight,
  PageHero,
  QuoteCard,
  Reveal,
  RouteSteps,
  SectionHeader,
  StatStrip,
  type Feature,
  type Quote,
  type RouteStep,
} from "@/components/marketing";

interface JobCategory {
  icon: LucideIcon;
  title: string;
  description: string;
  openings: string;
}

const getJobCategories = (t: TFunction): JobCategory[] => [
  { icon: HeartPulse, title: t("applicants.healthcare"), description: t("applicants.healthcareDesc"), openings: "2,500+" },
  { icon: Briefcase, title: t("applicants.engineering"), description: t("applicants.engineeringDesc"), openings: "1,200+" },
  { icon: UtensilsCrossed, title: t("applicants.hospitality"), description: t("applicants.hospitalityDesc"), openings: "3,000+" },
  { icon: GraduationCap, title: t("applicants.education"), description: t("applicants.educationDesc"), openings: "800+" },
  { icon: Globe, title: t("applicants.technology"), description: t("applicants.technologyDesc"), openings: "1,500+" },
  { icon: Wrench, title: t("applicants.trades"), description: t("applicants.tradesDesc"), openings: "2,000+" },
];

const getBenefits = (t: TFunction): Feature[] => [
  { icon: DollarSign, title: t("applicants.zeroFees"), description: t("applicants.zeroFeesDesc") },
  { icon: Shield, title: t("applicants.workerProtection"), description: t("applicants.workerProtectionDesc") },
  { icon: Sparkles, title: t("applicants.aiCVBuilder"), description: t("applicants.aiCVBuilderDesc") },
  { icon: Clock, title: t("applicants.fastDeployment"), description: t("applicants.fastDeploymentDesc") },
  { icon: FileText, title: t("applicants.tracking"), description: t("applicants.trackingDesc") },
  { icon: Award, title: t("applicants.rewards"), description: t("applicants.rewardsDesc") },
];

const destinations = [
  { code: "SA", name: "Saudi Arabia", jobs: "5,000+" },
  { code: "AE", name: "UAE", jobs: "3,500+" },
  { code: "QA", name: "Qatar", jobs: "2,000+" },
  { code: "SG", name: "Singapore", jobs: "1,800+" },
  { code: "JP", name: "Japan", jobs: "1,500+" },
  { code: "CA", name: "Canada", jobs: "1,200+" },
  { code: "DE", name: "Germany", jobs: "900+" },
  { code: "AU", name: "Australia", jobs: "800+" },
];

const getSteps = (t: TFunction): RouteStep[] => [
  { title: t("applicants.createAccount"), description: t("applicants.createAccountDesc") },
  { title: t("applicants.buildCV"), description: t("applicants.buildCVDesc") },
  { title: t("applicants.browseJobs"), description: t("applicants.browseJobsDesc") },
  { title: t("applicants.applyInterview"), description: t("applicants.applyInterviewDesc") },
  { title: t("applicants.getDeployed"), description: t("applicants.getDeployedDesc") },
];

const getSuccessStories = (t: TFunction): Quote[] => [
  { name: "Maria Santos", role: t("applicants.nurse"), quote: t("applicants.nurseQuote"), initials: "MS" },
  { name: "Jose Cruz", role: t("applicants.engineer"), quote: t("applicants.engineerQuote"), initials: "JC" },
  { name: "Anna Reyes", role: t("applicants.hotelManager"), quote: t("applicants.hotelManagerQuote"), initials: "AR" },
];

/** Destinations laid out like an airport departures board. */
function DeparturesBoard({ title }: { title: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-xl">
      <div className="flex items-center justify-between border-b border-sidebar-border px-5 py-3">
        <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-sidebar-muted">{title}</span>
        <span className="flex items-center gap-1.5 font-mono text-[10.5px] font-semibold text-accent">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          HIRING
        </span>
      </div>
      <ul className="divide-y divide-sidebar-border">
        {destinations.map((dest) => (
          <li key={dest.code} className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 px-5 py-2.5">
            <span className="font-mono text-xs font-semibold text-sidebar-muted">{dest.code}</span>
            <span className="truncate text-sm font-semibold uppercase tracking-wide">{dest.name}</span>
            <span className="font-mono text-sm tabular text-accent">{dest.jobs}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ForApplicantsPage() {
  const { t } = useTranslation();
  const [featuredStory, ...otherStories] = getSuccessStories(t);

  return (
    <>
      <PageHero
        eyebrow={t("applicants.heroLabel", "For Job Seekers")}
        title={
          <>
            {t("applicants.heroTitle", "Find Your Dream Job")}{" "}
            <Highlight>{t("applicants.heroTitleHighlight", "Abroad")}</Highlight>
          </>
        }
        description={
          <>
            {t("applicants.heroSubtitle", "Access 10,000+ verified job openings worldwide. Get deployed in")}{" "}
            <strong className="font-semibold text-foreground">{t("applicants.heroDays", "21-30 days")}</strong>{" "}
            {t("applicants.heroZeroFees", "with zero placement fees.")}
          </>
        }
        actions={
          <AuthCTA
            primaryText={t("applicants.startFree", "Start Free")}
            secondaryText={t("applicants.browseJobs")}
            primaryLink="/register"
            secondaryLink="/services"
          />
        }
        aside={<DeparturesBoard title={t("applicants.destinations")} />}
      >
        <StatStrip
          items={[
            { value: "50K+", label: t("landing.stats.workersDeployed") },
            { value: "30+", label: t("landing.stats.countries") },
            { value: "98%", label: t("landing.stats.successRate") },
          ]}
        />
      </PageHero>

      <section className="py-20 lg:py-28">
        <div className="container">
          <SectionHeader
            eyebrow={t("applicants.jobCategories")}
            title={
              <>
                {t("applicants.explorJobs", "Explore")} <Highlight>{t("applicants.exploreJobsHighlight", "10,000+ Jobs")}</Highlight>{" "}
                {t("applicants.acrossIndustries", "Across Industries")}
              </>
            }
            description={t("applicants.categoriesSubtitle", "Find opportunities in your field with verified employers worldwide.")}
          />
          <Reveal className="mt-12 grid gap-px overflow-hidden rounded-lg border bg-border md:grid-cols-2 lg:grid-cols-3">
            {getJobCategories(t).map((category) => (
              <Link
                key={category.title}
                to="/register"
                className="group flex flex-col bg-card p-6 transition-colors hover:bg-muted lg:p-7"
              >
                <div className="flex items-center justify-between">
                  <category.icon className="h-5 w-5 text-primary dark:text-accent" strokeWidth={1.75} />
                  <span className="font-mono text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">{category.openings}</span> {t("applicants.openings")}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-bold leading-tight">{category.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{category.description}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary dark:text-accent">
                  {t("applicants.browseJobs")}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="border-y border-border bg-card py-20 lg:py-28">
        <div className="container">
          <SectionHeader
            eyebrow={t("applicants.steps")}
            title={t("applicants.fiveSteps", "5 Simple Steps to Your Dream Job")}
            description={t("applicants.stepsSubtitle", "Our streamlined process makes finding work abroad easier than ever.")}
          />
          <Reveal className="mt-14">
            <RouteSteps steps={getSteps(t)} />
          </Reveal>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container">
          <SectionHeader
            eyebrow={t("applicants.whyChooseUs", "Why Choose Us")}
            title={
              <>
                {t("applicants.benefits")} <Highlight>{t("applicants.applicantsLabel", "Applicants")}</Highlight>
              </>
            }
            description={t("applicants.benefitsSubtitle", "We put workers first with comprehensive support and transparent practices.")}
          />
          <Reveal className="mt-12">
            <FeatureGrid items={getBenefits(t)} />
          </Reveal>
        </div>
      </section>

      <section className="pb-20 lg:pb-28">
        <div className="container">
          <SectionHeader
            eyebrow={t("applicants.successStories")}
            title={
              <>
                {t("applicants.realStories", "Real Stories from")} <Highlight>{t("applicants.realPeople", "Real People")}</Highlight>
              </>
            }
          />
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            <Reveal className="lg:col-span-1">
              <QuoteCard {...featuredStory} featured />
            </Reveal>
            {otherStories.map((story, i) => (
              <Reveal key={story.name} delay={0.08 * (i + 1)}>
                <QuoteCard {...story} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title={
          <>
            {t("applicants.ctaTitle", "Ready to Start Your")} <span className="text-accent">{t("applicants.ctaHighlight", "Global Career?")}</span>
          </>
        }
        description={t("applicants.ctaSubtitle", "Create your free account today and take the first step towards your dream job abroad.")}
        actions={
          <AuthCTA
            tone="dark"
            size="xl"
            primaryText={t("common.getStarted")}
            secondaryText={t("common.learnMore")}
            primaryLink="/register"
            secondaryLink="/services"
          />
        }
      />
    </>
  );
}
