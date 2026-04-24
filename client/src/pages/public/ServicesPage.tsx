import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Shield, Globe, CheckCircle, Sparkles, FileCheck, Video,
  Users, Clock, Headphones, GraduationCap, Briefcase, Zap, Target, TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuthCTA } from "@/components/AuthCTA";
import { useRef } from "react";

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };
const staggerContainer = { animate: { transition: { staggerChildren: 0.1 } } };

const getCoreServices = (t: any) => [
  { icon: Sparkles, title: t("services.cvBuilder"), description: t("services.cvBuilderDesc"), features: [t("services.multipleTemplates"), t("services.industryOptimization"), t("services.multiLanguage")], accent: "#E38534" },
  { icon: Users, title: t("services.matching"), description: t("services.matchingDesc"), features: [t("services.skillsMatch"), t("services.experienceVerify"), t("services.realTimeUpdates")], accent: "#005085" },
  { icon: Video, title: t("services.videoInterview"), description: t("services.videoInterviewDesc"), features: [t("services.oneClick"), t("services.hdVideo"), t("services.collaborativeScoring")], accent: "#E38534" },
  { icon: FileCheck, title: t("services.documents"), description: t("services.documentsDesc"), features: [t("services.visaProcessing"), t("services.medicalExams"), t("services.backgroundCheck")], accent: "#005085" },
  { icon: GraduationCap, title: t("services.training"), description: t("services.trainingDesc"), features: [t("services.languageCourses"), t("services.culturalOrientation"), t("services.jobTraining")], accent: "#16a34a" },
  { icon: Headphones, title: t("services.support"), description: t("services.supportDesc"), features: [t("services.hotlineSupport"), t("services.emergencyAssistance"), t("services.legalAdvocacy")], accent: "#E38534" },
];

const getValueProps = (t: any) => [
  { icon: Clock, title: t("services.fasterDeployment"), stat: t("services.stat21Days"), description: t("services.vs90Days") },
  { icon: Shield, title: t("services.ethicalRecruitment"), stat: t("services.zeroFees"), description: t("services.forWorkers") },
  { icon: CheckCircle, title: t("services.qualityAssurance"), stat: t("services.stat98"), description: t("services.satisfactionRate") },
  { icon: Globe, title: t("services.globalReach"), stat: t("services.stat30"), description: t("services.countriesServed") },
];

export default function ServicesPage() {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  const coreServices = getCoreServices(t);
  const valueProps = getValueProps(t);

  return (
    <div className="overflow-hidden">
      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-[100vh] flex items-center bg-background overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#005085]/6 via-background to-[#E38534]/5 dark:from-[#005085]/15 dark:to-[#E38534]/8" />
        <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.05]"
          style={{ backgroundImage: `radial-gradient(circle, #005085 1px, transparent 1px)`, backgroundSize: "32px 32px" }} />
        <div className="absolute top-1/3 -left-20 w-96 h-96 bg-[#E38534]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 -right-20 w-96 h-96 bg-[#005085]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="initial" animate="animate" variants={staggerContainer} style={{ opacity }}>
              <motion.div variants={fadeInUp} className="mb-6">
                <div className="inline-flex items-center gap-2 bg-[#005085]/10 dark:bg-[#005085]/20 border border-[#005085]/25 rounded-full px-4 py-2">
                  <Briefcase className="w-3.5 h-3.5 text-[#005085]" />
                  <span className="text-[#005085] text-xs font-bold tracking-widest uppercase">{t("services.badge")}</span>
                </div>
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-foreground leading-[1.05]">
                {t("services.title")} <span className="text-[#E38534]">{t("services.subtitle")}</span>
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
                {t("services.description")}
              </motion.p>
              <motion.div variants={fadeInUp}>
                <AuthCTA primaryText={t("services.getStarted")} secondaryText={t("services.learnAbout")}
                  primaryLink="/register" secondaryLink="/about" primaryVariant="default" secondaryVariant="outline" size="xl" />
              </motion.div>
            </motion.div>

            {/* Hero image */}
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="relative">
              <div className="relative rounded-3xl overflow-hidden border border-border/60 shadow-2xl aspect-[4/3] bg-gradient-to-br from-[#005085] to-[#003a63]">
                <img src="/legaforce-image.png" alt="Recruitment services" className="w-full h-full object-cover opacity-80"
                  onError={(e) => { e.currentTarget.style.display = "none"; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#003a63]/70 via-transparent to-transparent" />
                {[
                  { icon: Sparkles, pos: "top-6 left-6" }, { icon: Video, pos: "top-6 right-6" },
                  { icon: FileCheck, pos: "bottom-6 left-6" }, { icon: Headphones, pos: "bottom-6 right-6" },
                ].map((item, i) => (
                  <motion.div key={i} className={`absolute ${item.pos} bg-white/90 dark:bg-[#0a1628]/90 backdrop-blur-md border border-white/20 p-3 rounded-xl`}
                    animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }} transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}>
                    <item.icon className="w-5 h-5 text-[#E38534]" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── VALUE PROPS ── */}
      <section className="py-16 bg-[#005085] dark:bg-[#003a63] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`, backgroundSize: "28px 28px" }} />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {valueProps.map((prop, i) => (
              <motion.div key={prop.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center group">
                <motion.div whileHover={{ scale: 1.1, rotate: 10 }}
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#E38534]/20 text-[#E38534] mb-4">
                  <prop.icon className="h-6 w-6" />
                </motion.div>
                <p className="text-2xl sm:text-3xl font-black text-[#E38534] mb-1">{prop.stat}</p>
                <p className="font-bold text-white text-sm mb-1">{prop.title}</p>
                <p className="text-xs text-white/55">{prop.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CORE SERVICES ── */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#005085]/10 border border-[#005085]/20 rounded-full px-4 py-2 mb-5">
              <span className="text-[#005085] text-xs font-bold tracking-widest uppercase">{t("services.coreServices")}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 text-foreground">
              {t("services.coreServicesTitle", "Everything You Need for Successful Recruitment")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("services.coreServicesSubtitle", "Our comprehensive suite covers every aspect of international recruitment.")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {coreServices.map((service, i) => (
              <motion.div key={service.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="group relative rounded-2xl border border-border/60 bg-card hover:border-[#005085]/30 hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Accent top bar */}
                <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${service.accent}, ${service.accent}80)` }} />
                <div className="p-6 lg:p-8">
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ backgroundColor: `${service.accent}18` }}>
                    <service.icon className="h-6 w-6" style={{ color: service.accent }} />
                  </motion.div>
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

      {/* ── PROCESS ── */}
      <section className="py-20 lg:py-32 bg-muted/40 dark:bg-muted/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{ backgroundImage: `linear-gradient(#005085 1px, transparent 1px), linear-gradient(90deg, #005085 1px, transparent 1px)`, backgroundSize: "48px 48px" }} />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#E38534]/10 border border-[#E38534]/25 rounded-full px-4 py-2 mb-5">
              <Target className="w-4 h-4 text-[#E38534]" />
              <span className="text-[#E38534] text-xs font-bold tracking-widest uppercase">{t("services.ourProcess", "Our Process")}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 text-foreground">{t("services.processTitle", "From Inquiry to Deployment")}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("services.processSubtitle", "A streamlined, technology-driven process.")}</p>
          </motion.div>

          {/* Process steps visual */}
          <div className="max-w-5xl mx-auto mb-16">
            <div className="relative rounded-3xl overflow-hidden border border-border/60 bg-gradient-to-br from-[#005085]/8 to-[#E38534]/8 dark:from-[#005085]/15 dark:to-[#E38534]/10 aspect-[21/9] flex items-center justify-around p-8">
              {[{ label: t("services.processInquiry", "Inquiry"), icon: Briefcase }, { label: t("services.processMatching", "Matching"), icon: Users },
                { label: t("services.processInterview", "Interview"), icon: Video }, { label: t("services.processDeploy", "Deploy"), icon: Globe }].map((step, i) => (
                <motion.div key={step.label} className="bg-white/90 dark:bg-[#0a1628]/90 backdrop-blur-md border border-border/50 p-5 rounded-2xl text-center"
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }} whileHover={{ scale: 1.05 }}>
                  <div className="w-12 h-12 rounded-xl bg-[#E38534]/15 flex items-center justify-center mx-auto mb-3">
                    <step.icon className="w-6 h-6 text-[#E38534]" />
                  </div>
                  <p className="font-bold text-sm text-foreground">{step.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Process stats */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Clock, value: "70%", label: t("services.fasterThanTraditional", "Faster than traditional") },
              { icon: TrendingUp, value: "98%", label: t("services.successRate", "Success rate") },
              { icon: Zap, value: t("services.stat21DaysShort", "21 Days"), label: t("services.averageDeployment", "Average deployment") },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-border/60 bg-card text-center hover:border-[#005085]/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#005085]/10 text-[#005085] flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6" />
                </div>
                <p className="text-3xl font-black text-[#E38534] mb-2">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 lg:py-32 bg-[#005085] dark:bg-[#003a63] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`, backgroundSize: "28px 28px" }} />
        <motion.div animate={{ x: [0, 50, 0], y: [0, 30, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-96 h-96 bg-[#E38534]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6">{t("services.ctaTitle", "Ready to Get Started?")}</h2>
            <p className="text-lg text-white/65 mb-8">{t("services.ctaSubtitle", "Whether you're looking for your next opportunity or seeking top talent, we're here to help.")}</p>
            <AuthCTA primaryText={t("services.getStarted")} secondaryText={t("services.aboutLegaforce", "About Legaforce")}
              primaryLink="/register" secondaryLink="/about" primaryVariant="default" secondaryVariant="outline" size="xl" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}