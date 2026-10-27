import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { FileCheck, GraduationCap, Headphones, Sparkles, Users, Video } from "lucide-react";
import { AuthCTA } from "@/components/AuthCTA";
import {
  CtaBand,
  DiamondList,
  FeatureGrid,
  Highlight,
  PageHero,
  Reveal,
  RouteSteps,
  SectionHeader,
  StatStrip,
  type Feature,
} from "@/components/marketing";

const getCoreServices = (t: TFunction): Feature[] => [
  {
    icon: Sparkles,
    title: t("services.cvBuilder"),
    description: t("services.cvBuilderDesc"),
    details: <DiamondList items={[t("services.multipleTemplates"), t("services.industryOptimization"), t("services.multiLanguage")]} />,
  },
  {
    icon: Users,
    title: t("services.matching"),
    description: t("services.matchingDesc"),
    details: <DiamondList items={[t("services.skillsMatch"), t("services.experienceVerify"), t("services.realTimeUpdates")]} />,
  },
  {
    icon: Video,
    title: t("services.videoInterview"),
    description: t("services.videoInterviewDesc"),
    details: <DiamondList items={[t("services.oneClick"), t("services.hdVideo"), t("services.collaborativeScoring")]} />,
  },
  {
    icon: FileCheck,
    title: t("services.documents"),
    description: t("services.documentsDesc"),
    details: <DiamondList items={[t("services.visaProcessing"), t("services.medicalExams"), t("services.backgroundCheck")]} />,
  },
  {
    icon: GraduationCap,
    title: t("services.training"),
    description: t("services.trainingDesc"),
    details: <DiamondList items={[t("services.languageCourses"), t("services.culturalOrientation"), t("services.jobTraining")]} />,
  },
  {
    icon: Headphones,
    title: t("services.support"),
    description: t("services.supportDesc"),
    details: <DiamondList items={[t("services.hotlineSupport"), t("services.emergencyAssistance"), t("services.legalAdvocacy")]} />,
  },
];

const getValueProps = (t: TFunction) => [
  { title: t("services.fasterDeployment"), stat: t("services.stat21Days"), description: t("services.vs90Days") },
  { title: t("services.ethicalRecruitment"), stat: t("services.zeroFees"), description: t("services.forWorkers") },
  { title: t("services.qualityAssurance"), stat: t("services.stat98"), description: t("services.satisfactionRate") },
  { title: t("services.globalReach"), stat: t("services.stat30"), description: t("services.countriesServed") },
];

function ValueProps({ items }: { items: ReturnType<typeof getValueProps> }) {
  return (
    <dl className="divide-y overflow-hidden rounded-lg border bg-card">
      {items.map((item) => (
        <div key={item.title} className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-0.5 px-5 py-4">
          <dt className="text-sm font-bold">{item.title}</dt>
          <dd className="row-span-2 self-center font-mono text-2xl font-medium tracking-tight text-primary dark:text-accent">
            {item.stat}
          </dd>
          <dd className="text-xs text-muted-foreground">{item.description}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function ServicesPage() {
  const { t } = useTranslation();

  const processSteps = [
    { title: t("services.processInquiry", "Inquiry") },
    { title: t("services.processMatching", "Matching") },
    { title: t("services.processInterview", "Interview") },
    { title: t("services.processDeploy", "Deploy") },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("services.badge")}
        title={
          <>
            {t("services.title")} <Highlight>{t("services.subtitle")}</Highlight>
          </>
        }
        description={t("services.description")}
        actions={
          <AuthCTA
            primaryText={t("services.getStarted")}
            secondaryText={t("services.learnAbout")}
            primaryLink="/register"
            secondaryLink="/about"
          />
        }
        aside={<ValueProps items={getValueProps(t)} />}
      />

      <section className="py-20 lg:py-28">
        <div className="container">
          <SectionHeader
            eyebrow={t("services.coreServices")}
            title={t("services.coreServicesTitle", "Everything You Need for Successful Recruitment")}
            description={t("services.coreServicesSubtitle", "Our comprehensive suite covers every aspect of international recruitment.")}
          />
          <Reveal className="mt-12">
            <FeatureGrid items={getCoreServices(t)} />
          </Reveal>
        </div>
      </section>

      <section className="border-y border-border bg-card py-20 lg:py-28">
        <div className="container">
          <SectionHeader
            eyebrow={t("services.ourProcess", "Our Process")}
            title={t("services.processTitle", "From Inquiry to Deployment")}
            description={t("services.processSubtitle", "A streamlined, technology-driven process.")}
          />
          <Reveal className="mt-14">
            <RouteSteps steps={processSteps} />
          </Reveal>
          <Reveal className="mt-14">
            <StatStrip
              items={[
                { value: "70%", label: t("services.fasterThanTraditional", "Faster than traditional") },
                { value: "98%", label: t("services.successRate", "Success rate") },
                { value: t("services.stat21DaysShort", "21 Days"), label: t("services.averageDeployment", "Average deployment") },
              ]}
            />
          </Reveal>
        </div>
      </section>

      <CtaBand
        title={t("services.ctaTitle", "Ready to Get Started?")}
        description={t("services.ctaSubtitle", "Whether you're looking for your next opportunity or seeking top talent, we're here to help.")}
        actions={
          <AuthCTA
            tone="dark"
            size="xl"
            primaryText={t("services.getStarted")}
            secondaryText={t("services.aboutLegaforce", "About Legaforce")}
            primaryLink="/register"
            secondaryLink="/about"
          />
        }
      />
    </>
  );
}
