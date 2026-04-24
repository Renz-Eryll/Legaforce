import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight, Shield, Sparkles, Globe, Award, CheckCircle, Briefcase,
  FileText, Users, Clock, TrendingUp, Heart, MapPin, DollarSign,
  GraduationCap, Zap, Target, Star, Search, Video, Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuthCTA } from "@/components/AuthCTA";
import { useRef } from "react";

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };
const staggerContainer = { animate: { transition: { staggerChildren: 0.1 } } };

const getJobCategories = (t: any) => [
  { icon: Heart, title: t("applicants.healthcare"), description: t("applicants.healthcareDesc"), jobs: "2,500+", accent: "#e53e3e", image: "/images/applicants/healthcare-jobs.png" },
  { icon: Briefcase, title: t("applicants.engineering"), description: t("applicants.engineeringDesc"), jobs: "1,200+", accent: "#005085", image: "/images/applicants/engineering-jobs.png" },
  { icon: Users, title: t("applicants.hospitality"), description: t("applicants.hospitalityDesc"), jobs: "3,000+", accent: "#E38534", image: "/images/applicants/hospitality-jobs.png" },
  { icon: GraduationCap, title: t("applicants.education"), description: t("applicants.educationDesc"), jobs: "800+", accent: "#7c3aed", image: "/images/applicants/education-jobs.svg" },
  { icon: Globe, title: t("applicants.technology"), description: t("applicants.technologyDesc"), jobs: "1,500+", accent: "#0891b2", image: "/images/applicants/tech-jobs.svg" },
  { icon: TrendingUp, title: t("applicants.trades"), description: t("applicants.tradesDesc"), jobs: "2,000+", accent: "#16a34a", image: "/images/applicants/trades-jobs.svg" },
];

const getBenefits = (t: any) => [
  { icon: DollarSign, title: t("applicants.zeroFees"), description: t("applicants.zeroFeesDesc"), accent: "#16a34a" },
  { icon: Shield, title: t("applicants.workerProtection"), description: t("applicants.workerProtectionDesc"), accent: "#005085" },
  { icon: Sparkles, title: t("applicants.aiCVBuilder"), description: t("applicants.aiCVBuilderDesc"), accent: "#E38534" },
  { icon: Clock, title: t("applicants.fastDeployment"), description: t("applicants.fastDeploymentDesc"), accent: "#e53e3e" },
  { icon: FileText, title: t("applicants.tracking"), description: t("applicants.trackingDesc"), accent: "#7c3aed" },
  { icon: Award, title: t("applicants.rewards"), description: t("applicants.rewardsDesc"), accent: "#E38534" },
];

const destinations = [
  { name: "Saudi Arabia", flag: "🇸🇦", jobs: "5,000+" }, { name: "UAE", flag: "🇦🇪", jobs: "3,500+" },
  { name: "Qatar", flag: "🇶🇦", jobs: "2,000+" }, { name: "Singapore", flag: "🇸🇬", jobs: "1,800+" },
  { name: "Japan", flag: "🇯🇵", jobs: "1,500+" }, { name: "Canada", flag: "🇨🇦", jobs: "1,200+" },
  { name: "Germany", flag: "🇩🇪", jobs: "900+" }, { name: "Australia", flag: "🇦🇺", jobs: "800+" },
];

const getSteps = (t: any) => [
  { number: "01", title: t("applicants.createAccount"), description: t("applicants.createAccountDesc"), icon: Users },
  { number: "02", title: t("applicants.buildCV"), description: t("applicants.buildCVDesc"), icon: FileText },
  { number: "03", title: t("applicants.browseJobs"), description: t("applicants.browseJobsDesc"), icon: Search },
  { number: "04", title: t("applicants.applyInterview"), description: t("applicants.applyInterviewDesc"), icon: Video },
  { number: "05", title: t("applicants.getDeployed"), description: t("applicants.getDeployedDesc"), icon: Rocket },
];

const getSuccessStories = (t: any) => [
  { name: "Maria Santos", role: t("applicants.nurse"), quote: t("applicants.nurseQuote"), avatar: "MS", flag: "🇸🇦" },
  { name: "Jose Cruz", role: t("applicants.engineer"), quote: t("applicants.engineerQuote"), avatar: "JC", flag: "🇦🇪" },
  { name: "Anna Reyes", role: t("applicants.hotelManager"), quote: t("applicants.hotelManagerQuote"), avatar: "AR", flag: "🇶🇦" },
];

export default function ForApplicantsPage() {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  const jobCategories = getJobCategories(t);
  const benefits = getBenefits(t);
  const steps = getSteps(t);
  const successStories = getSuccessStories(t);

  return (
    <div className="overflow-hidden">
      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-[100vh] flex items-center justify-center bg-background overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#005085]/6 via-background to-[#E38534]/5 dark:from-[#005085]/15 dark:to-[#E38534]/8" />
        <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.05]"
          style={{ backgroundImage: `radial-gradient(circle, #005085 1px, transparent 1px)`, backgroundSize: "32px 32px" }} />
        <motion.div animate={{ x: [0, 50, 0], y: [0, 30, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-20 w-96 h-96 bg-[#005085]/12 rounded-full blur-3xl pointer-events-none" />
        <motion.div animate={{ x: [0, -50, 0], y: [0, -30, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#E38534]/12 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <motion.div initial="initial" animate="animate" variants={staggerContainer} style={{ opacity }} className="text-center max-w-3xl mx-auto">
            <motion.div variants={fadeInUp} className="mb-6">
              <div className="inline-flex items-center gap-2 bg-[#E38534]/10 border border-[#E38534]/30 rounded-full px-4 py-2">
                <Users className="w-3.5 h-3.5 text-[#E38534]" />
                <span className="text-[#E38534] text-xs font-bold tracking-widest uppercase">{t("applicants.heroLabel", "For Job Seekers")}</span>
              </div>
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-foreground leading-[1.05]">
              {t("applicants.heroTitle", "Find Your Dream Job")}{" "}
              <span className="text-[#E38534]">{t("applicants.heroTitleHighlight", "Abroad")}</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed">
              {t("applicants.heroSubtitle", "Access 10,000+ verified job openings worldwide. Get deployed in")}{" "}
              <span className="font-bold text-[#005085]">{t("applicants.heroDays", "21-30 days")}</span>{" "}
              {t("applicants.heroZeroFees", "with zero placement fees.")}
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
              <AuthCTA primaryText={t("applicants.startFree", "Start Free")} secondaryText={t("applicants.browseJobs")}
                primaryLink="/register" secondaryLink="/services" primaryVariant="default" secondaryVariant="outline" size="lg" />
            </motion.div>
            {/* Quick stats */}
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-5 items-center justify-center">
              {[{ icon: Users, value: "50K+", label: t("landing.stats.workersDeployed") },
                { icon: Globe, value: "30+", label: t("landing.stats.countries") },
                { icon: TrendingUp, value: "98%", label: t("landing.stats.successRate") }].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2.5 bg-muted/60 dark:bg-muted/40 border border-border/50 rounded-2xl px-4 py-3">
                  <div className="w-9 h-9 rounded-xl bg-[#005085]/10 flex items-center justify-center">
                    <stat.icon className="w-4.5 h-4.5 text-[#005085]" />
                  </div>
                  <div className="text-left">
                    <p className="text-base font-black text-foreground leading-none">{stat.value}</p>
                    <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── JOB CATEGORIES ── */}
      <section className="py-20 lg:py-32 bg-muted/40 dark:bg-muted/20 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#005085]/4 via-transparent to-[#E38534]/4" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#005085]/10 border border-[#005085]/20 rounded-full px-4 py-2 mb-5">
              <Briefcase className="w-4 h-4 text-[#005085]" />
              <span className="text-[#005085] text-xs font-bold tracking-widest uppercase">{t("applicants.jobCategories")}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 text-foreground">
              {t("applicants.explorJobs", "Explore")} <span className="text-[#E38534]">{t("applicants.exploreJobsHighlight", "10,000+ Jobs")}</span> {t("applicants.acrossIndustries", "Across Industries")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("applicants.categoriesSubtitle", "Find opportunities in your field with verified employers worldwide.")}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {jobCategories.map((cat, i) => (
              <motion.div key={cat.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="group relative rounded-2xl border border-border/60 bg-card hover:border-[#005085]/30 hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="h-1 w-full" style={{ backgroundColor: cat.accent }} />
                <div className="relative h-44 overflow-hidden" style={{ backgroundColor: `${cat.accent}10` }}>
                  <img src={cat.image} alt={cat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.style.display = "none"; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }}
                    className="absolute top-4 right-4 w-11 h-11 rounded-xl backdrop-blur-sm flex items-center justify-center"
                    style={{ backgroundColor: cat.accent }}>
                    <cat.icon className="h-5 w-5 text-white" />
                  </motion.div>
                  <div className="absolute bottom-4 left-4">
                    <span className="text-[11px] font-bold text-white px-3 py-1 rounded-full" style={{ backgroundColor: `${cat.accent}cc` }}>
                      {cat.jobs} {t("applicants.openings")}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-1.5 text-foreground">{cat.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{cat.description}</p>
                  <Link to="/register">
                    <button className="flex items-center gap-1.5 text-sm font-semibold transition-colors" style={{ color: cat.accent }}>
                      {t("applicants.browseJobs")} <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="py-20 lg:py-32 bg-background relative overflow-hidden">
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#E38534]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#E38534]/10 border border-[#E38534]/25 rounded-full px-4 py-2 mb-5">
              <Award className="w-4 h-4 text-[#E38534]" />
              <span className="text-[#E38534] text-xs font-bold tracking-widest uppercase">{t("applicants.whyChooseUs", "Why Choose Us")}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 text-foreground">
              {t("applicants.benefits")} <span className="text-[#E38534]">{t("applicants.applicantsLabel", "Applicants")}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("applicants.benefitsSubtitle", "We put workers first with comprehensive support and transparent practices.")}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {benefits.map((benefit, i) => (
              <motion.div key={benefit.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="group relative p-5 rounded-2xl border border-border/60 bg-card hover:border-[#005085]/30 hover:shadow-lg transition-all duration-300">
                <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ backgroundColor: benefit.accent }} />
                <div className="flex gap-4">
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }}
                    className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${benefit.accent}15` }}>
                    <benefit.icon className="h-5 w-5" style={{ color: benefit.accent }} />
                  </motion.div>
                  <div>
                    <h3 className="font-bold mb-1.5 text-foreground text-sm">{benefit.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DESTINATIONS ── */}
      <section className="py-20 lg:py-32 bg-muted/40 dark:bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#005085]/10 border border-[#005085]/20 rounded-full px-4 py-2 mb-5">
              <MapPin className="w-4 h-4 text-[#005085]" />
              <span className="text-[#005085] text-xs font-bold tracking-widest uppercase">{t("applicants.destinations")}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 text-foreground">
              {t("applicants.workIn", "Work in")} <span className="text-[#E38534]">{t("applicants.thirtyCountries", "30+ Countries")}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("applicants.destinationsSubtitle", "Connect with verified employers from around the world.")}</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-5">
            {destinations.map((dest, i) => (
              <motion.div key={dest.name} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }} whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="p-5 rounded-2xl border border-border/60 bg-card hover:border-[#005085]/30 hover:shadow-lg transition-all text-center cursor-pointer group">
                <motion.span className="text-5xl mb-3 block" whileHover={{ scale: 1.2, rotate: 8 }} transition={{ type: "spring", stiffness: 300 }}>
                  {dest.flag}
                </motion.span>
                <h3 className="font-bold text-sm text-foreground mb-1">{dest.name}</h3>
                <p className="text-xs font-bold text-[#E38534]">{dest.jobs} {t("applicants.jobsLabel", "jobs")}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUCCESS STORIES ── */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#E38534]/10 border border-[#E38534]/25 rounded-full px-4 py-2 mb-5">
              <Star className="w-4 h-4 fill-[#E38534] text-[#E38534]" />
              <span className="text-[#E38534] text-xs font-bold tracking-widest uppercase">{t("applicants.successStories")}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              {t("applicants.realStories", "Real Stories from")} <span className="text-[#E38534]">{t("applicants.realPeople", "Real People")}</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {successStories.map((story, i) => (
              <motion.div key={story.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="relative p-6 rounded-2xl border border-border/60 bg-card hover:border-[#E38534]/30 hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl bg-gradient-to-b from-[#005085] to-[#E38534]" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#005085] text-white font-bold flex items-center justify-center text-sm">{story.avatar}</div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-foreground">{story.name}</p>
                    <p className="text-xs text-muted-foreground">{story.role}</p>
                  </div>
                  <span className="text-2xl">{story.flag}</span>
                </div>
                <p className="text-muted-foreground text-sm italic leading-relaxed mb-4">"{story.quote}"</p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-[#E38534] text-[#E38534]" />)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STEPS ── */}
      <section className="py-20 lg:py-32 bg-[#005085] dark:bg-[#003a63] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`, backgroundSize: "28px 28px" }} />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-5">
              <Clock className="w-4 h-4 text-[#E38534]" />
              <span className="text-white text-xs font-bold tracking-widest uppercase">{t("applicants.steps")}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">{t("applicants.fiveSteps", "5 Simple Steps to Your Dream Job")}</h2>
            <p className="text-lg text-white/65 max-w-2xl mx-auto">{t("applicants.stepsSubtitle", "Our streamlined process makes finding work abroad easier than ever.")}</p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {steps.map((step, i) => (
              <motion.div key={step.number} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex gap-5 group bg-white/8 border border-white/10 hover:bg-white/12 hover:border-white/20 rounded-2xl p-5 transition-all">
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }}
                  className="flex-shrink-0 w-14 h-14 rounded-2xl bg-[#E38534] text-white font-black text-lg flex items-center justify-center shadow-lg">
                  {step.number}
                </motion.div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <step.icon className="h-5 w-5 text-[#E38534]" />
                    <h3 className="text-base font-bold text-white">{step.title}</h3>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">{step.description}</p>
                </div>
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
              {t("applicants.ctaTitle", "Ready to Start Your")} <span className="text-[#E38534]">{t("applicants.ctaHighlight", "Global Career?")}</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{t("applicants.ctaSubtitle", "Create your free account today and take the first step towards your dream job abroad.")}</p>
            <AuthCTA primaryText={t("common.getStarted")} secondaryText={t("common.learnMore")}
              primaryLink="/register" secondaryLink="/services" primaryVariant="default" secondaryVariant="outline" size="lg" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}