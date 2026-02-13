import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Award,
  CheckCircle,
  Building2,
  Users,
  Clock,
  TrendingUp,
  Sparkles,
  FileCheck,
  BarChart3,
  Headphones,
  BadgeCheck,
  Search,
  Video,
  Target,
  DollarSign,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuthCTA } from "@/components/AuthCTA";
import { useRef } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Why hire Filipino workers
const getWhyFilipino = (t: any) => [
  {
    icon: Globe,
    title: t("employers.englishProficiency"),
    description: t("employers.englishProficiencyDesc"),
    stat: "#1",
    statLabel: t("employers.englishStat"),
  },
  {
    icon: Award,
    title: t("employers.workEthic"),
    description: t("employers.workEthicDesc"),
    stat: "98%",
    statLabel: t("employers.retentionStat"),
  },
  {
    icon: Users,
    title: t("employers.adaptability"),
    description: t("employers.adaptabilityDesc"),
    stat: "30+",
    statLabel: t("employers.countriesStat"),
  },
  {
    icon: TrendingUp,
    title: t("employers.skilledWorkforce"),
    description: t("employers.skilledWorkforceDesc"),
    stat: "10M+",
    statLabel: t("employers.workersStat"),
  },
];

// Services for employers
const getServices = (t: any) => [
  {
    icon: Search,
    title: t("employers.aiMatching"),
    description: t("employers.aiMatchingDesc"),
    features: [
      t("services.skillsMatch"),
      t("services.experienceVerify"),
      t("employers.culturalFit", "Cultural fit assessment"),
    ],
    image: "/images/employers/ai-matching.jpg",
  },
  {
    icon: Video,
    title: t("employers.videoInterviews"),
    description: t("employers.videoInterviewsDesc"),
    features: [
      t("employers.schedulingAutomation", "Scheduling automation"),
      t("employers.recordingPlayback", "Recording & playback"),
      t("services.collaborativeScoring"),
    ],
    image: "/images/employers/video-interview.jpg",
  },
  {
    icon: FileCheck,
    title: t("employers.docProcessing"),
    description: t("employers.docProcessingDesc"),
    features: [
      t("services.visaProcessing"),
      t("employers.medicalClearances", "Medical clearances"),
      t("employers.backgroundChecks", "Background checks"),
    ],
    image: "/images/employers/documents.jpg",
  },
  {
    icon: Headphones,
    title: t("employers.dedicatedSupport"),
    description: t("employers.dedicatedSupportDesc"),
    features: [
      t("employers.assistance247", "24/7 assistance"),
      t("employers.onboardingSupport", "Onboarding support"),
      t("employers.issueResolution", "Issue resolution"),
    ],
    image: "/images/employers/support.jpg",
  },
];

// Industries served
const getIndustries = (t: any) => [
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

// Stats
const getStats = (t: any) => [
  { value: "500+", label: t("employers.partnerEmployers"), icon: Building2 },
  { value: "98%", label: t("employers.retentionRate"), icon: TrendingUp },
  { value: "21 Days", label: t("employers.averageDeployment"), icon: Clock },
  { value: "50,000+", label: t("employers.workersDeployed"), icon: Users },
];

// Process steps
const getProcessSteps = (t: any) => [
  {
    step: "01",
    title: t("employers.shareRequirements"),
    description: t("employers.shareReqDesc"),
    icon: FileCheck,
  },
  {
    step: "02",
    title: t("employers.candidateMatching"),
    description: t("employers.candidateMatchingDesc"),
    icon: Search,
  },
  {
    step: "03",
    title: t("employers.interviewSelect"),
    description: t("employers.interviewSelectDesc"),
    icon: Video,
  },
  {
    step: "04",
    title: t("employers.handleRest"),
    description: t("employers.handleRestDesc"),
    icon: Zap,
  },
];

// Client testimonials
const getTestimonials = (t: any) => [
  {
    company: t("employers.globalHealthcare"),
    industry: t("employers.healthcareIndustry"),
    quote: t("employers.healthcareQuote"),
    logo: "GH",
    rating: 5,
  },
  {
    company: t("employers.techSolutions"),
    industry: t("employers.itServices"),
    quote: t("employers.techQuote"),
    logo: "TS",
    rating: 5,
  },
  {
    company: t("employers.hospitalityInt"),
    industry: t("employers.hotels"),
    quote: t("employers.hospitalityQuote"),
    logo: "HI",
    rating: 5,
  },
];

export default function ForEmployersPage() {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  const whyFilipino = getWhyFilipino(t);
  const services = getServices(t);
  const industries = getIndustries(t);
  const stats = getStats(t);
  const processSteps = getProcessSteps(t);
  const testimonials = getTestimonials(t);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-[100vh] flex items-center bg-gradient-to-br from-primary/5 via-background to-accent/5"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid place-items-center">
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              style={{ opacity }}
              className="text-center mx-auto max-w-2xl"
            >
              <motion.div variants={fadeInUp} className="mb-6">
                <Badge variant="premium" className="px-4 py-1.5 text-sm">
                  <Building2 className="w-4 h-4 mr-2" />
                  {t("employers.title")}
                </Badge>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
              >
                {t("employers.heroTitle", "Hire Top")}{" "}
                <span className="text-accent">
                  {t("employers.heroHighlight", "Filipino Talent")}
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-8"
              >
                {t(
                  "employers.heroSubtitle",
                  "Access a pool of 50,000+ skilled, pre-screened Filipino workers. Streamlined recruitment, faster deployment, and comprehensive support for employers worldwide.",
                )}
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-5 mb-8 items-center justify-center"
              >
                <AuthCTA
                  primaryText={t("employers.startHiring", "Start Hiring")}
                  secondaryText={t(
                    "employers.viewServices",
                    "View Our Services",
                  )}
                  primaryLink="/register"
                  secondaryLink="/services"
                  primaryVariant="default"
                  secondaryVariant="outline"
                  size="xl"
                />
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-6  items-center justify-center"
              >
                {[
                  {
                    icon: Shield,
                    label: t("employers.isoCertified", "ISO Certified"),
                  },
                  {
                    icon: BadgeCheck,
                    label: t("employers.poeaLicensed", "POEA Licensed"),
                  },
                  {
                    icon: Award,
                    label: t("employers.fiveHundredClients", "500+ Clients"),
                  },
                ].map((item, index) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-success" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {item.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group cursor-pointer"
              >
                <motion.div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/20 text-accent mb-4 group-hover:scale-110 transition-transform"
                  whileHover={{ rotate: 10 }}
                >
                  <stat.icon className="h-6 w-6" />
                </motion.div>
                <motion.div
                  className="text-2xl sm:text-3xl font-bold mb-1"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Filipino Workers Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              {t("employers.whyFilipino")}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {t(
                "employers.worldsPreferred",
                "The World's Preferred Workforce",
              )}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t(
                "employers.whyFilipinoSubtitle",
                "Over 10 million Filipino workers are employed worldwide, valued for their skills and professionalism.",
              )}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {whyFilipino.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-accent/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />

                <div className="relative p-6 lg:p-8 rounded-2xl border border-border bg-card hover:shadow-xl hover:border-accent/30 transition-all duration-300 text-center">
                  <motion.div
                    className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent/10 text-accent mb-4 group-hover:scale-110 transition-transform"
                    whileHover={{ rotate: 10 }}
                  >
                    <item.icon className="h-7 w-7" />
                  </motion.div>

                  <div className="text-3xl font-bold text-accent mb-1">
                    {item.stat}
                  </div>
                  <div className="text-xs text-muted-foreground mb-3">
                    {item.statLabel}
                  </div>

                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section with Images */}
      <section className="py-20 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              {t("employers.services")}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {t("employers.endToEnd", "End-to-End Recruitment Solutions")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t(
                "employers.servicesSubtitle",
                "From sourcing to deployment, we handle every aspect of international recruitment.",
              )}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:shadow-xl hover:border-accent/30 transition-all duration-300"
              >
                {/* Service Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />

                  <motion.div
                    className="absolute top-4 right-4 w-12 h-12 rounded-xl bg-accent/90 text-white backdrop-blur-sm flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <service.icon className="h-6 w-6" />
                  </motion.div>
                </div>

                <div className="p-6 lg:p-8">
                  <h3 className="text-xl font-semibold mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-success" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              {t("employers.industriesWeServe", "Industries We Serve")}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {t("employers.talentForSector", "Talent for Every Sector")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t(
                "employers.industriesSubtitle",
                "We provide skilled workers across all major industries worldwide.",
              )}
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3">
            {industries.map((industry, index) => (
              <motion.div
                key={industry}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ scale: 1.05 }}
              >
                <Badge
                  variant="outline"
                  className="px-4 py-2 text-sm hover:bg-accent/10 hover:border-accent/30 transition-colors cursor-pointer"
                >
                  {industry}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              <Star className="w-4 h-4 mr-2 fill-accent text-accent" />
              {t("employers.clientSuccess", "Client Success")}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {t("employers.trustedBy", "Trusted by")}{" "}
              <span className="gradient-text">
                {t("employers.leadingCompanies", "Leading Companies")}
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.company}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="neon-box bg-card p-6 rounded-2xl"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl gradient-bg text-white font-bold flex items-center justify-center">
                    {testimonial.logo}
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.company}</h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.industry}
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 lg:py-32 bg-primary text-primary-foreground relative overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge
              variant="secondary"
              className="mb-4 bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20"
            >
              {t("employers.howItWorks", "How It Works")}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {t("employers.simpleHiring", "Simple Hiring Process")}
            </h2>
            <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">
              {t(
                "employers.hiringProcessSubtitle",
                "Start hiring world-class Filipino talent in four simple steps.",
              )}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {processSteps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent text-white font-bold text-xl mb-4 group-hover:scale-110 transition-transform"
                  whileHover={{ rotate: 10 }}
                >
                  {item.step}
                </motion.div>
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-primary-foreground/70">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              {t("employers.readyToHire")}{" "}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t("employers.readyToHireSubtitle")}
            </p>
            <AuthCTA
              primaryText={t("employers.startHiringNow", "Start Hiring Now")}
              secondaryText={t("common.learnAboutUs")}
              primaryLink="/register"
              secondaryLink="/about"
              primaryVariant="default"
              secondaryVariant="outline"
              size="xl"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
