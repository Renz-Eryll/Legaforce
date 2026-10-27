import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { BadgeCheck, FileCheck, Headphones, Search, Video } from "lucide-react";
import { AuthCTA } from "@/components/AuthCTA";
import {
  CtaBand,
  DiamondList,
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
  type Stat,
} from "@/components/marketing";

const getWhyFilipino = (t: TFunction) => [
  { title: t("employers.englishProficiency"), description: t("employers.englishProficiencyDesc"), stat: "#1", statLabel: t("employers.englishStat") },
  { title: t("employers.workEthic"), description: t("employers.workEthicDesc"), stat: "98%", statLabel: t("employers.retentionStat") },
  { title: t("employers.adaptability"), description: t("employers.adaptabilityDesc"), stat: "30+", statLabel: t("employers.countriesStat") },
  { title: t("employers.skilledWorkforce"), description: t("employers.skilledWorkforceDesc"), stat: "10M+", statLabel: t("employers.workersStat") },
];

const getServices = (t: TFunction): Feature[] => [
  {
    icon: Search,
    title: t("employers.aiMatching"),
    description: t("employers.aiMatchingDesc"),
    details: (
      <DiamondList items={[t("services.skillsMatch"), t("services.experienceVerify"), t("employers.culturalFit", "Cultural fit assessment")]} />
    ),
  },
  {
    icon: Video,
    title: t("employers.videoInterviews"),
    description: t("employers.videoInterviewsDesc"),
    details: (
      <DiamondList
        items={[
          t("employers.schedulingAutomation", "Scheduling automation"),
          t("employers.recordingPlayback", "Recording & playback"),
          t("services.collaborativeScoring"),
        ]}
      />
    ),
  },
  {
    icon: FileCheck,
    title: t("employers.docProcessing"),
    description: t("employers.docProcessingDesc"),
    details: (
      <DiamondList
        items={[
          t("services.visaProcessing"),
          t("employers.medicalClearances", "Medical clearances"),
          t("employers.backgroundChecks", "Background checks"),
        ]}
      />
    ),
  },
  {
    icon: Headphones,
    title: t("employers.dedicatedSupport"),
    description: t("employers.dedicatedSupportDesc"),
    details: (
      <DiamondList
        items={[
          t("employers.assistance247", "24/7 assistance"),
          t("employers.onboardingSupport", "Onboarding support"),
          t("employers.issueResolution", "Issue resolution"),
        ]}
      />
    ),
  },
];

const getIndustries = (t: TFunction) => [
  t("employers.industryHealthcare", "Healthcare"),
  t("employers.industryConstruction", "Construction"),
  t("employers.industryHospitality", "Hospitality"),
  t("employers.industryManufacturing", "Manufacturing"),
  t("employers.industryOilGas", "Oil & Gas"),
  t("employers.industryIT", "IT & Technology"),
  t("employers.industryEducation", "Education"),
  t("employers.industryRetail", "Retail"),
  t("employers.industryTransportation", "Transportation"),
  t("employers.industryAgriculture", "Agriculture"),
  t("employers.industryFoodBeverage", "Food & Beverage"),
  t("employers.industryFinance", "Finance"),
];

const getStats = (t: TFunction): Stat[] => [
  { value: "500+", label: t("employers.partnerEmployers") },
  { value: "98%", label: t("employers.retentionRate") },
  { value: "21 Days", label: t("employers.averageDeployment") },
  { value: "50,000+", label: t("employers.workersDeployed") },
];

const getProcessSteps = (t: TFunction): RouteStep[] => [
  { title: t("employers.shareRequirements"), description: t("employers.shareReqDesc") },
  { title: t("employers.candidateMatching"), description: t("employers.candidateMatchingDesc") },
  { title: t("employers.interviewSelect"), description: t("employers.interviewSelectDesc") },
  { title: t("employers.handleRest"), description: t("employers.handleRestDesc") },
];

const getTestimonials = (t: TFunction): Quote[] => [
  { name: t("employers.globalHealthcare"), role: t("employers.healthcareIndustry"), quote: t("employers.healthcareQuote"), initials: "GH" },
  { name: t("employers.techSolutions"), role: t("employers.itServices"), quote: t("employers.techQuote"), initials: "TS" },
  { name: t("employers.hospitalityInt"), role: t("employers.hotels"), quote: t("employers.hospitalityQuote"), initials: "HI" },
];

/** Illustration of an employer job order moving through matching. */
function JobOrderCard({ badges }: { badges: string[] }) {
  const rows = [
    { label: "Position", value: "Registered Nurse" },
    { label: "Headcount", value: "25" },
    { label: "Destination", value: "Riyadh, KSA" },
    { label: "Shortlist", value: "In 7 days" },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-border-strong/70 bg-card shadow-2xl">
      <div className="flex items-center justify-between gap-4 bg-sidebar px-5 py-3 text-sidebar-foreground">
        <span className="font-mono text-[10.5px] font-semibold tracking-[0.18em] text-sidebar-muted">JOB ORDER</span>
        <span className="font-mono text-[11px] text-sidebar-muted">JO-26-0118</span>
      </div>
      <dl className="divide-y">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4 px-5 py-3">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{row.label}</dt>
            <dd className="text-sm font-semibold">{row.value}</dd>
          </div>
        ))}
      </dl>
      <div className="border-t px-5 py-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-semibold">Matching candidates</span>
          <span className="font-mono text-sm tabular">142 → 38</span>
        </div>
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-sm bg-muted">
          <div className="h-full w-[68%] bg-accent" />
        </div>
      </div>
      <ul className="flex flex-wrap gap-x-5 gap-y-2 border-t bg-muted/40 px-5 py-3">
        {badges.map((badge) => (
          <li key={badge} className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80">
            <BadgeCheck className="h-3.5 w-3.5 text-success" />
            {badge}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ForEmployersPage() {
  const { t } = useTranslation();
  const [featuredQuote, ...otherQuotes] = getTestimonials(t);

  return (
    <>
      <PageHero
        eyebrow={t("employers.title")}
        title={
          <>
            {t("employers.heroTitle", "Hire Top")} <Highlight>{t("employers.heroHighlight", "Filipino Talent")}</Highlight>
          </>
        }
        description={t(
          "employers.heroSubtitle",
          "Access a pool of 50,000+ skilled, pre-screened Filipino workers. Streamlined recruitment, faster deployment, and comprehensive support.",
        )}
        actions={
          <AuthCTA
            primaryText={t("employers.startHiring", "Start Hiring")}
            secondaryText={t("employers.viewServices", "View Our Services")}
            primaryLink="/register"
            secondaryLink="/services"
          />
        }
        aside={
          <JobOrderCard
            badges={[
              t("employers.poeaLicensed", "POEA Licensed"),
              t("employers.isoCertified", "ISO Certified"),
              t("employers.fiveHundredClients", "500+ Clients"),
            ]}
          />
        }
      >
        <StatStrip items={getStats(t)} />
      </PageHero>

      <section className="py-20 lg:py-28">
        <div className="container">
          <SectionHeader
            eyebrow={t("employers.whyFilipino")}
            title={t("employers.worldsPreferred", "The World's Preferred Workforce")}
            description={t(
              "employers.whyFilipinoSubtitle",
              "Over 10 million Filipino workers are employed worldwide, valued for their skills and professionalism.",
            )}
          />
          <Reveal className="mt-12 grid gap-px overflow-hidden rounded-lg border bg-border md:grid-cols-2 lg:grid-cols-4">
            {getWhyFilipino(t).map((item) => (
              <div key={item.title} className="flex flex-col bg-card p-6 lg:p-7">
                <p className="font-mono text-4xl font-medium tracking-tight text-primary dark:text-accent">{item.stat}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">{item.statLabel}</p>
                <h3 className="mt-8 text-lg font-bold">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="border-y border-border bg-card py-20 lg:py-28">
        <div className="container">
          <SectionHeader
            eyebrow={t("employers.howItWorks", "How It Works")}
            title={t("employers.simpleHiring", "Simple Hiring Process")}
            description={t("employers.hiringProcessSubtitle", "Start hiring world-class Filipino talent in four simple steps.")}
          />
          <Reveal className="mt-14">
            <RouteSteps steps={getProcessSteps(t)} />
          </Reveal>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container">
          <SectionHeader
            eyebrow={t("employers.services")}
            title={t("employers.endToEnd", "End-to-End Recruitment Solutions")}
            description={t("employers.servicesSubtitle", "From sourcing to deployment, we handle every aspect of international recruitment.")}
          />
          <Reveal className="mt-12">
            <FeatureGrid items={getServices(t)} columns={2} />
          </Reveal>
        </div>
      </section>

      <section className="pb-20 lg:pb-28">
        <div className="container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeader
              eyebrow={t("employers.industriesWeServe", "Industries We Serve")}
              title={t("employers.talentForSector", "Talent for Every Sector")}
              description={t("employers.industriesSubtitle", "We provide skilled workers across all major industries worldwide.")}
            />
          </div>
          <Reveal className="lg:col-span-8">
            <ol className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-3">
              {getIndustries(t).map((industry, i) => (
                <li key={industry} className="flex items-baseline gap-3 bg-card px-4 py-4">
                  <span className="font-mono text-[11px] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-sm font-semibold">{industry}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border pb-20 pt-20 lg:pb-28 lg:pt-28">
        <div className="container">
          <SectionHeader
            eyebrow={t("employers.clientSuccess", "Client Success")}
            title={
              <>
                {t("employers.trustedBy", "Trusted by")} <Highlight>{t("employers.leadingCompanies", "Leading Companies")}</Highlight>
              </>
            }
          />
          <div className="mt-12 grid gap-4 lg:grid-cols-12">
            <Reveal className="lg:col-span-7 lg:row-span-2">
              <QuoteCard {...featuredQuote} featured />
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
        title={t("employers.readyToHire")}
        description={t("employers.readyToHireSubtitle")}
        actions={
          <AuthCTA
            tone="dark"
            size="xl"
            primaryText={t("employers.startHiringNow", "Start Hiring Now")}
            secondaryText={t("common.learnAboutUs")}
            primaryLink="/register"
            secondaryLink="/about"
          />
        }
      />
    </>
  );
}
