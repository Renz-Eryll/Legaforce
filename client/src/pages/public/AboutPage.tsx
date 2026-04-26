import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Shield, Heart, Globe, Award, CheckCircle, Users, Target,
  Lightbulb, Handshake, MapPin, Mail, Phone, FileText, TrendingUp, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuthCTA } from "@/components/AuthCTA";
import { useRef } from "react";

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };
const staggerContainer = { animate: { transition: { staggerChildren: 0.1 } } };

const getValues = (t: any) => [
  { icon: Heart, title: t("about.workerFirst"), description: t("about.workerFirstDesc"), color: "#E38534", bg: "#E38534" },
  { icon: Shield, title: t("about.integrity"), description: t("about.integrityDesc"), color: "#005085", bg: "#005085" },
  { icon: Lightbulb, title: t("about.innovation"), description: t("about.innovationDesc"), color: "#E38534", bg: "#E38534" },
  { icon: Handshake, title: t("about.partnership"), description: t("about.partnershipDesc"), color: "#16a34a", bg: "#16a34a" },
];

const getMilestones = (t: any) => [
  { year: "2018", title: t("about.founded"), description: t("about.foundedDesc") },
  { year: "2019", title: t("about.poealicense"), description: t("about.poealicenseDesc") },
  { year: "2020", title: t("about.digitalPlatform"), description: t("about.digitalPlatformDesc") },
  { year: "2021", title: t("about.workers10k"), description: t("about.workers10kDesc") },
  { year: "2022", title: t("about.isoCertified"), description: t("about.isoCertifiedDesc") },
  { year: "2023", title: t("about.workers50k"), description: t("about.workers50kDesc") },
];

const getAccreditations = (t: any) => [
  t("about.poea"), t("about.iso"), t("about.dmw"), t("about.owwa"), t("about.iom"), t("about.pjsfa"),
];

const getLeadership = (t: any) => [
  { name: "Maria dela Cruz", role: t("about.ceo"), bio: t("about.yearsExperience"), initials: "MC" },
  { name: "Roberto Santos", role: t("about.coo"), bio: t("about.poealead"), initials: "RS" },
  { name: "Jennifer Tan", role: t("about.cto"), bio: t("about.techLead"), initials: "JT" },
];

export default function AboutPage() {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  const values = getValues(t);
  const milestones = getMilestones(t);
  const accreditations = getAccreditations(t);
  const leadership = getLeadership(t);

  return (
    <div className="overflow-hidden">
      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-[100vh] flex items-center bg-background overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E38534]/5 via-background to-[#005085]/6 dark:from-[#E38534]/10 dark:to-[#005085]/15" />
        <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.05]"
          style={{ backgroundImage: `radial-gradient(circle, #005085 1px, transparent 1px)`, backgroundSize: "32px 32px" }} />
        <div className="absolute top-1/3 -left-20 w-96 h-96 bg-[#E38534]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 -right-20 w-96 h-96 bg-[#005085]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="initial" animate="animate" variants={staggerContainer} style={{ opacity }}>
              <motion.div variants={fadeInUp} className="mb-6">
                <div className="inline-flex items-center gap-2 bg-[#005085]/10 dark:bg-[#005085]/20 border border-[#005085]/25 rounded-full px-4 py-2">
                  <FileText className="w-3.5 h-3.5 text-[#005085]" />
                  <span className="text-[#005085] text-xs font-bold tracking-widest uppercase">{t("about.badge")}</span>
                </div>
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-foreground leading-[1.05]">
                {t("about.title")} <span className="text-[#E38534]">{t("about.subtitle")}</span>
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
                {t("about.description")}
              </motion.p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="relative">
              <div className="relative rounded-3xl overflow-hidden border border-border/60 shadow-2xl aspect-[4/3] bg-gradient-to-br from-[#005085] to-[#003a63]">
                <img src="/images/about/legaforce-team.png" alt="Legaforce team"
                  className="w-full h-full object-cover opacity-80"
                  onError={(e) => { e.currentTarget.src = "/legaforce-image2.png"; e.currentTarget.onerror = () => { e.currentTarget.style.display = "none"; }; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#003a63]/70 via-transparent to-transparent" />
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-6 right-6 bg-white/95 dark:bg-[#0a1628]/95 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E38534]/20 flex items-center justify-center">
                      <Award className="w-5 h-5 text-[#E38534]" />
                    </div>
                    <div>
                      <p className="text-xl font-black text-foreground">ISO 9001</p>
                      <p className="text-[11px] text-muted-foreground">Certified</p>
                    </div>
                  </div>
                </motion.div>
              </div>
              {/* Spinning globe */}
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full bg-gradient-to-br from-[#E38534]/20 to-[#005085]/20 backdrop-blur-sm border border-border/30 flex items-center justify-center">
                <Globe className="w-14 h-14 text-[#E38534]/60" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── MISSION & VISION ── */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {[
              { icon: Target, title: t("about.mission"), desc: t("about.missionDescription"), color: "#E38534" },
              { icon: Globe, title: t("about.vision"), desc: t("about.visionDescription"), color: "#005085" },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, x: i === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} className="relative group">
                <div className="relative p-8 rounded-2xl border border-border/60 bg-card hover:border-[#005085]/30 hover:shadow-xl transition-all duration-300 min-h-[280px] flex flex-col justify-center overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ backgroundColor: item.color }} />
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: `${item.color}15` }}>
                    <item.icon className="h-7 w-7" style={{ color: item.color }} />
                  </div>
                  <h2 className="text-2xl font-black mb-4 text-foreground">{item.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-20 lg:py-32 bg-muted/40 dark:bg-muted/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{ backgroundImage: `radial-gradient(circle, #005085 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#005085]/10 border border-[#005085]/20 rounded-full px-4 py-2 mb-5">
              <span className="text-[#005085] text-xs font-bold tracking-widest uppercase">{t("about.values")}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">{t("about.whyChooseUs")}</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div key={value.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group relative">
                <div className="relative p-6 rounded-2xl border border-border/60 bg-card text-center hover:border-[#005085]/30 hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: value.color }} />
                  <motion.div whileHover={{ scale: 1.1, rotate: 8 }}
                    className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5"
                    style={{ backgroundColor: `${value.bg}15` }}>
                    <value.icon className="h-6 w-6" style={{ color: value.color }} />
                  </motion.div>
                  <h3 className="font-bold mb-2 text-foreground">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#E38534]/10 border border-[#E38534]/25 rounded-full px-4 py-2 mb-5">
              <span className="text-[#E38534] text-xs font-bold tracking-widest uppercase">{t("about.journey")}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">{t("about.milestones")}</h2>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, i) => (
              <motion.div key={milestone.year} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="flex gap-6 mb-8 last:mb-0 group">
                <div className="flex-shrink-0 w-16 text-right">
                  <motion.span whileHover={{ scale: 1.1 }} className="font-black text-[#E38534] text-sm">{milestone.year}</motion.span>
                </div>
                <div className="flex-shrink-0 relative flex flex-col items-center">
                  <motion.div whileHover={{ scale: 1.3 }}
                    className="w-4 h-4 rounded-full bg-[#005085] mt-0.5 ring-4 ring-[#005085]/20 group-hover:ring-[#005085]/40 transition-all" />
                  {i < milestones.length - 1 && (
                    <div className="flex-1 w-px bg-border group-hover:bg-[#005085]/40 transition-colors mt-2" style={{ minHeight: "48px" }} />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="font-bold mb-1 text-foreground group-hover:text-[#005085] transition-colors">{milestone.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACCREDITATIONS ── */}
      <section className="py-20 lg:py-32 bg-[#005085] dark:bg-[#003a63] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`, backgroundSize: "28px 28px" }} />
        <motion.div animate={{ x: [0, 100, 0], y: [0, 50, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-96 h-96 bg-[#E38534]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-5">
              <Award className="w-4 h-4 text-[#E38534]" />
              <span className="text-white text-xs font-bold tracking-widest uppercase">Accreditations</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Trusted & Certified</h2>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-3">
            {accreditations.map((item, i) => (
              <motion.div key={item} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }} whileHover={{ scale: 1.05 }}>
                <div className="flex items-center gap-2 bg-white/10 border border-white/20 hover:bg-[#E38534]/20 hover:border-[#E38534]/40 transition-all rounded-full px-5 py-2.5 cursor-pointer">
                  <CheckCircle className="w-4 h-4 text-[#E38534]" />
                  <span className="text-white text-sm font-semibold">{item}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEADERSHIP ── */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#005085]/10 border border-[#005085]/20 rounded-full px-4 py-2 mb-5">
              <span className="text-[#005085] text-xs font-bold tracking-widest uppercase">Leadership</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">Our Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-3">Led by experienced professionals committed to transforming recruitment.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {leadership.map((person, i) => (
              <motion.div key={person.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group p-6 rounded-2xl border border-border/60 bg-card text-center hover:border-[#005085]/30 hover:shadow-xl transition-all duration-300">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#005085]/20 group-hover:border-[#005085]/50 transition-colors bg-gradient-to-br from-[#005085] to-[#E38534] flex items-center justify-center">
                    <img src={`/images/team/${person.name.toLowerCase().replace(/\s+/g, "-")}.jpg`} alt={person.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = "none"; const p = e.currentTarget.parentElement!; p.textContent = person.initials; }} />
                    <span className="text-white font-black text-xl hidden">{person.initials}</span>
                  </div>
                  <div className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 rounded-full border-4 border-card" />
                </div>
                <h3 className="font-bold text-foreground mb-1">{person.name}</h3>
                <p className="text-sm text-[#E38534] font-semibold mb-2">{person.role}</p>
                <p className="text-sm text-muted-foreground">{person.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMPACT STATS ── */}
      <section className="py-20 lg:py-32 bg-muted/40 dark:bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#E38534]/10 border border-[#E38534]/25 rounded-full px-4 py-2 mb-5">
              <TrendingUp className="w-4 h-4 text-[#E38534]" />
              <span className="text-[#E38534] text-xs font-bold tracking-widest uppercase">Our Impact</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">Making a Difference</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[{ value: "50,000+", label: "Workers Deployed", icon: Users }, { value: "500+", label: "Partner Companies", icon: Handshake },
              { value: "30+", label: "Countries", icon: Globe }, { value: "98%", label: "Success Rate", icon: TrendingUp }].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-border/60 bg-card text-center hover:border-[#005085]/30 hover:shadow-lg transition-all group">
                <motion.div whileHover={{ scale: 1.1, rotate: 8 }}
                  className="w-12 h-12 rounded-xl bg-[#E38534]/10 text-[#E38534] flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6" />
                </motion.div>
                <motion.p initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.2, type: "spring" }}
                  className="text-3xl font-black text-foreground mb-1">{stat.value}</motion.p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#005085]/10 border border-[#005085]/20 rounded-full px-4 py-2 mb-5">
              <span className="text-[#005085] text-xs font-bold tracking-widest uppercase">Contact Us</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-10 text-foreground">Get in Touch</h2>
            <div className="grid md:grid-cols-3 gap-5 mb-10">
              {[{ icon: MapPin, label: "Address", val: "Philippines" }, { icon: Mail, label: "Email", val: "info@legaforce.com" },
                { icon: Phone, label: "Phone", val: "+63 2 1234 5678" }].map((item) => (
                <motion.div key={item.label} whileHover={{ y: -5 }}
                  className="p-6 rounded-2xl border border-border/60 bg-card hover:border-[#005085]/30 hover:shadow-lg transition-all">
                  <item.icon className="h-6 w-6 text-[#E38534] mx-auto mb-3" />
                  <p className="font-bold text-sm text-foreground mb-1">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.val}</p>
                </motion.div>
              ))}
            </div>
            <AuthCTA primaryText="Get Started" secondaryText="View Services"
              primaryLink="/register" secondaryLink="/services" primaryVariant="default" secondaryVariant="outline" size="xl" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}