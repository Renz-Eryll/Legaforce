import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight, Shield, Zap, Globe, Award, CheckCircle, Building2,
  Users, Clock, TrendingUp, Sparkles, FileCheck, BarChart3, Headphones,
  BadgeCheck, Search, Video, Target, DollarSign, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuthCTA } from "@/components/AuthCTA";
import { useRef } from "react";

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };
const staggerContainer = { animate: { transition: { staggerChildren: 0.1 } } };

const getWhyFilipino = (t: any) => [
  { icon: Globe, title: t("employers.englishProficiency"), description: t("employers.englishProficiencyDesc"), stat: "#1", statLabel: t("employers.englishStat") },
  { icon: Award, title: t("employers.workEthic"), description: t("employers.workEthicDesc"), stat: "98%", statLabel: t("employers.retentionStat") },
  { icon: Users, title: t("employers.adaptability"), description: t("employers.adaptabilityDesc"), stat: "30+", statLabel: t("employers.countriesStat") },
  { icon: TrendingUp, title: t("employers.skilledWorkforce"), description: t("employers.skilledWorkforceDesc"), stat: "10M+", statLabel: t("employers.workersStat") },
];

const getServices = (t: any) => [
  { icon: Search, title: t("employers.aiMatching"), description: t("employers.aiMatchingDesc"), features: [t("services.skillsMatch"), t("services.experienceVerify"), t("employers.culturalFit", "Cultural fit assessment")], accent: "#005085" },
  { icon: Video, title: t("employers.videoInterviews"), description: t("employers.videoInterviewsDesc"), features: [t("employers.schedulingAutomation", "Scheduling automation"), t("employers.recordingPlayback", "Recording & playback"), t("services.collaborativeScoring")], accent: "#E38534" },
  { icon: FileCheck, title: t("employers.docProcessing"), description: t("employers.docProcessingDesc"), features: [t("services.visaProcessing"), t("employers.medicalClearances", "Medical clearances"), t("employers.backgroundChecks", "Background checks")], accent: "#005085" },
  { icon: Headphones, title: t("employers.dedicatedSupport"), description: t("employers.dedicatedSupportDesc"), features: [t("employers.assistance247", "24/7 assistance"), t("employers.onboardingSupport", "Onboarding support"), t("employers.issueResolution", "Issue resolution")], accent: "#E38534" },
];

const getIndustries = (t: any) => [
  t("employers.industryHealthcare", "Healthcare"), t("employers.industryConstruction", "Construction"),
  t("employers.industryHospitality", "Hospitality"), t("employers.industryManufacturing", "Manufacturing"),
  t("employers.industryOilGas", "Oil & Gas"), t("employers.industryIT", "IT & Technology"),
  t("employers.industryEducation", "Education"), t("employers.industryRetail", "Retail"),
  t("employers.industryTransportation", "Transportation"), t("employers.industryAgriculture", "Agriculture"),
  t("employers.industryFoodBeverage", "Food & Beverage"), t("employers.industryFinance", "Finance"),
];

const getStats = (t: any) => [
  { value: "500+", label: t("employers.partnerEmployers"), icon: Building2 },
  { value: "98%", label: t("employers.retentionRate"), icon: TrendingUp },
  { value: "21 Days", label: t("employers.averageDeployment"), icon: Clock },
  { value: "50,000+", label: t("employers.workersDeployed"), icon: Users },
];

const getProcessSteps = (t: any) => [
  { step: "01", title: t("employers.shareRequirements"), description: t("employers.shareReqDesc"), icon: FileCheck },
  { step: "02", title: t("employers.candidateMatching"), description: t("employers.candidateMatchingDesc"), icon: Search },
  { step: "03", title: t("employers.interviewSelect"), description: t("employers.interviewSelectDesc"), icon: Video },
  { step: "04", title: t("employers.handleRest"), description: t("employers.handleRestDesc"), icon: Zap },
];

const getTestimonials = (t: any) => [
  { company: t("employers.globalHealthcare"), industry: t("employers.healthcareIndustry"), quote: t("employers.healthcareQuote"), logo: "GH", rating: 5 },
  { company: t("employers.techSolutions"), industry: t("employers.itServices"), quote: t("employers.techQuote"), logo: "TS", rating: 5 },
  { company: t("employers.hospitalityInt"), industry: t("employers.hotels"), quote: t("employers.hospitalityQuote"), logo: "HI", rating: 5 },
];

export default function ForEmployersPage() {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  const whyFilipino = getWhyFilipino(t);
  const services = getServices(t);
  const industries = getIndustries(t);
  const stats = getStats(t);
  const processSteps = getProcessSteps(t);
  const testimonials = getTestimonials(t);

  return (
    <div className="overflow-hidden">
      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-[100vh] flex items-center justify-center bg-background overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#005085]/6 via-background to-[#E38534]/5 dark:from-[#005085]/15 dark:to-[#E38534]/8" />
        <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.05]"
          style={{ backgroundImage: `radial-gradient(circle, #005085 1px, transparent 1px)`, backgroundSize: "32px 32px" }} />
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#005085]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-[#E38534]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <motion.div initial="initial" animate="animate" variants={staggerContainer} style={{ opacity }} className="text-center max-w-3xl mx-auto">
            <motion.div variants={fadeInUp} className="mb-6">
              <div className="inline-flex items-center gap-2 bg-[#005085]/10 dark:bg-[#005085]/20 border border-[#005085]/25 rounded-full px-4 py-2">
                <Building2 className="w-3.5 h-3.5 text-[#005085]" />
                <span className="text-[#005085] text-xs font-bold tracking-widest uppercase">{t("employers.title")}</span>
              </div>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-foreground leading-[1.05]">
              {t("employers.heroTitle", "Hire Top")} <span className="text-[#E38534]">{t("employers.heroHighlight", "Filipino Talent")}</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed mx-auto">
              {t("employers.heroSubtitle", "Access a pool of 50,000+ skilled, pre-screened Filipino workers. Streamlined recruitment, faster deployment, and comprehensive support.")}
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 mb-10 justify-center">
              <AuthCTA primaryText={t("employers.startHiring", "Start Hiring")} secondaryText={t("employers.viewServices", "View Our Services")}
                primaryLink="/register" secondaryLink="/services" primaryVariant="default" secondaryVariant="outline" size="xl" />
            </motion.div>

            {/* Trust indicators */}
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 items-center justify-center">
              {[{ icon: Shield, label: t("employers.isoCertified", "ISO Certified") },
                { icon: BadgeCheck, label: t("employers.poeaLicensed", "POEA Licensed") },
                { icon: Award, label: t("employers.fiveHundredClients", "500+ Clients") }].map((item) => (
                <div key={item.label} className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2">
                  <item.icon className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-semibold text-foreground/80">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 bg-[#005085] dark:bg-[#003a63] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`, backgroundSize: "28px 28px" }} />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center group">
                <motion.div whileHover={{ scale: 1.1, rotate: 10 }}
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#E38534]/20 text-[#E38534] mb-4">
                  <stat.icon className="h-6 w-6" />
                </motion.div>
                <motion.p initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.2, type: "spring" }}
                  className="text-2xl sm:text-3xl font-black text-white mb-1">{stat.value}</motion.p>
                <p className="text-sm text-white/55">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY FILIPINO ── */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#E38534]/10 border border-[#E38534]/25 rounded-full px-4 py-2 mb-5">
              <span className="text-[#E38534] text-xs font-bold tracking-widest uppercase">{t("employers.whyFilipino")}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 text-foreground">{t("employers.worldsPreferred", "The World's Preferred Workforce")}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("employers.whyFilipinoSubtitle", "Over 10 million Filipino workers are employed worldwide, valued for their skills and professionalism.")}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {whyFilipino.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group relative p-6 lg:p-8 rounded-2xl border border-border/60 bg-card hover:border-[#005085]/30 hover:shadow-xl transition-all duration-300 text-center overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#005085] to-[#E38534]" />
                <motion.div whileHover={{ scale: 1.1, rotate: 8 }}
                  className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#E38534]/10 mb-4">
                  <item.icon className="h-7 w-7 text-[#E38534]" />
                </motion.div>
                <p className="text-3xl font-black text-[#E38534] mb-0.5">{item.stat}</p>
                <p className="text-[11px] text-muted-foreground mb-4">{item.statLabel}</p>
                <h3 className="text-base font-bold mb-2 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-20 lg:py-32 bg-muted/40 dark:bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#005085]/10 border border-[#005085]/20 rounded-full px-4 py-2 mb-5">
              <span className="text-[#005085] text-xs font-bold tracking-widest uppercase">{t("employers.services")}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 text-foreground">{t("employers.endToEnd", "End-to-End Recruitment Solutions")}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("employers.servicesSubtitle", "From sourcing to deployment, we handle every aspect of international recruitment.")}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {services.map((service, i) => (
              <motion.div key={service.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="group relative rounded-2xl border border-border/60 bg-card hover:border-[#005085]/30 hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="h-1 w-full" style={{ backgroundColor: service.accent }} />
                <div className="relative h-44 overflow-hidden bg-gradient-to-br from-[#005085]/8 to-[#E38534]/8 dark:from-[#005085]/15 dark:to-[#E38534]/10">
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }}
                    className="absolute top-4 right-4 w-12 h-12 rounded-xl backdrop-blur-sm flex items-center justify-center text-white"
                    style={{ backgroundColor: service.accent }}>
                    <service.icon className="h-6 w-6" />
                  </motion.div>
                </div>
                <div className="p-6 lg:p-8">
                  <h3 className="text-lg font-bold mb-2 text-foreground">{service.title}</h3>
                  <p className="text-muted-foreground text-sm mb-5 leading-relaxed">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                        <CheckCircle className="h-4 w-4 flex-shrink-0" style={{ color: service.accent }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES ── */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#E38534]/10 border border-[#E38534]/25 rounded-full px-4 py-2 mb-5">
              <span className="text-[#E38534] text-xs font-bold tracking-widest uppercase">{t("employers.industriesWeServe", "Industries We Serve")}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 text-foreground">{t("employers.talentForSector", "Talent for Every Sector")}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("employers.industriesSubtitle", "We provide skilled workers across all major industries worldwide.")}</p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-3">
            {industries.map((industry, i) => (
              <motion.div key={industry} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.03 }} whileHover={{ scale: 1.06 }}>
                <div className="flex items-center gap-1.5 bg-muted/60 dark:bg-muted/40 border border-border/60 hover:border-[#005085]/40 hover:bg-[#005085]/5 transition-all rounded-full px-4 py-2 cursor-pointer">
                  <span className="text-sm font-semibold text-foreground/80">{industry}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 lg:py-32 bg-muted/40 dark:bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#E38534]/10 border border-[#E38534]/25 rounded-full px-4 py-2 mb-5">
              <Star className="w-4 h-4 fill-[#E38534] text-[#E38534]" />
              <span className="text-[#E38534] text-xs font-bold tracking-widest uppercase">{t("employers.clientSuccess", "Client Success")}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              {t("employers.trustedBy", "Trusted by")} <span className="text-[#E38534]">{t("employers.leadingCompanies", "Leading Companies")}</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div key={testimonial.company} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="relative p-6 rounded-2xl border border-border/60 bg-card hover:border-[#E38534]/30 hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl bg-gradient-to-b from-[#005085] to-[#E38534]" />
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#005085] text-white font-bold flex items-center justify-center text-sm">{testimonial.logo}</div>
                  <div>
                    <p className="font-bold text-sm text-foreground">{testimonial.company}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.industry}</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-4 italic leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-[#E38534] text-[#E38534]" />)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="py-20 lg:py-32 bg-[#005085] dark:bg-[#003a63] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`, backgroundSize: "28px 28px" }} />
        <motion.div animate={{ x: [0, 50, 0], y: [0, 30, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-96 h-96 bg-[#E38534]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-5">
              <span className="text-white text-xs font-bold tracking-widest uppercase">{t("employers.howItWorks", "How It Works")}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">{t("employers.simpleHiring", "Simple Hiring Process")}</h2>
            <p className="text-lg text-white/65 max-w-2xl mx-auto">{t("employers.hiringProcessSubtitle", "Start hiring world-class Filipino talent in four simple steps.")}</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 lg:gap-8">
            {processSteps.map((item, i) => (
              <motion.div key={item.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center group">
                <motion.div whileHover={{ scale: 1.1, rotate: 8 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#E38534] text-white font-black text-xl mb-4 shadow-lg shadow-black/20">
                  {item.step}
                </motion.div>
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-[#E38534]" />
                </div>
                <h3 className="text-base font-bold mb-2 text-white">{item.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-6 text-foreground">
              {t("employers.readyToHire")}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{t("employers.readyToHireSubtitle")}</p>
            <AuthCTA primaryText={t("employers.startHiringNow", "Start Hiring Now")} secondaryText={t("common.learnAboutUs")}
              primaryLink="/register" secondaryLink="/about" primaryVariant="default" secondaryVariant="outline" size="xl" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}