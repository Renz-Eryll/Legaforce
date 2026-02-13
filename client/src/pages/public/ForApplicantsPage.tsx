import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Shield,
  Sparkles,
  Globe,
  Award,
  CheckCircle,
  Briefcase,
  FileText,
  Users,
  Clock,
  TrendingUp,
  Heart,
  MapPin,
  DollarSign,
  GraduationCap,
  Zap,
  Target,
  Star,
  Search,
  Video,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuthCTA } from "@/components/AuthCTA";
import { useRef } from "react";

// Animation variants
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

// Job categories with brand-themed gradients
const getJobCategories = (t: any) => [
  {
    icon: Heart,
    title: t("applicants.healthcare"),
    description: t("applicants.healthcareDesc"),
    jobs: "2,500+ " + t("applicants.openings"),
    gradient: "from-red-500/10 to-pink-500/10",
    iconBg: "bg-red-500/10",
    iconColor: "text-red-600 dark:text-red-400",
    image: "/images/applicants/healthcare-jobs.jpg",
  },
  {
    icon: Briefcase,
    title: t("applicants.engineering"),
    description: t("applicants.engineeringDesc"),
    jobs: "1,200+ " + t("applicants.openings"),
    gradient: "from-primary/10 to-blue-500/10",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    image: "/images/applicants/engineering-jobs.jpg",
  },
  {
    icon: Users,
    title: t("applicants.hospitality"),
    description: t("applicants.hospitalityDesc"),
    jobs: "3,000+ " + t("applicants.openings"),
    gradient: "from-accent/10 to-orange-500/10",
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
    image: "/images/applicants/hospitality-jobs.jpg",
  },
  {
    icon: GraduationCap,
    title: t("applicants.education"),
    description: t("applicants.educationDesc"),
    jobs: "800+ " + t("applicants.openings"),
    gradient: "from-purple-500/10 to-indigo-500/10",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-600 dark:text-purple-400",
    image: "/images/applicants/education-jobs.jpg",
  },
  {
    icon: Globe,
    title: t("applicants.technology"),
    description: t("applicants.technologyDesc"),
    jobs: "1,500+ " + t("applicants.openings"),
    gradient: "from-cyan-500/10 to-blue-500/10",
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    image: "/images/applicants/tech-jobs.jpg",
  },
  {
    icon: TrendingUp,
    title: t("applicants.trades"),
    description: t("applicants.tradesDesc"),
    jobs: "2,000+ " + t("applicants.openings"),
    gradient: "from-green-500/10 to-emerald-500/10",
    iconBg: "bg-green-500/10",
    iconColor: "text-green-600 dark:text-green-400",
    image: "/images/applicants/trades-jobs.jpg",
  },
];

// Benefits with modern styling
const getBenefits = (t: any) => [
  {
    icon: DollarSign,
    title: t("applicants.zeroFees"),
    description: t("applicants.zeroFeesDesc"),
    gradient: "from-green-500/5 to-emerald-500/5",
  },
  {
    icon: Shield,
    title: t("applicants.workerProtection"),
    description: t("applicants.workerProtectionDesc"),
    gradient: "from-primary/5 to-blue-500/5",
  },
  {
    icon: Sparkles,
    title: t("applicants.aiCVBuilder"),
    description: t("applicants.aiCVBuilderDesc"),
    gradient: "from-accent/5 to-yellow-500/5",
  },
  {
    icon: Clock,
    title: t("applicants.fastDeployment"),
    description: t("applicants.fastDeploymentDesc"),
    gradient: "from-orange-500/5 to-red-500/5",
  },
  {
    icon: FileText,
    title: t("applicants.tracking"),
    description: t("applicants.trackingDesc"),
    gradient: "from-purple-500/5 to-pink-500/5",
  },
  {
    icon: Award,
    title: t("applicants.rewards"),
    description: t("applicants.rewardsDesc"),
    gradient: "from-accent/5 to-orange-500/5",
  },
];

// Destination countries
const destinations = [
  {
    nameKey: "saudiArabia",
    name: "Saudi Arabia",
    flag: "🇸🇦",
    jobs: "5,000+",
    color: "from-green-500/10 to-emerald-500/10",
  },
  {
    nameKey: "uae",
    name: "UAE",
    flag: "🇦🇪",
    jobs: "3,500+",
    color: "from-red-500/10 to-green-500/10",
  },
  {
    nameKey: "qatar",
    name: "Qatar",
    flag: "🇶🇦",
    jobs: "2,000+",
    color: "from-red-500/10 to-purple-500/10",
  },
  {
    nameKey: "singapore",
    name: "Singapore",
    flag: "🇸🇬",
    jobs: "1,800+",
    color: "from-red-500/10 to-white/5",
  },
  {
    nameKey: "japan",
    name: "Japan",
    flag: "🇯🇵",
    jobs: "1,500+",
    color: "from-red-500/10 to-white/5",
  },
  {
    nameKey: "canada",
    name: "Canada",
    flag: "🇨🇦",
    jobs: "1,200+",
    color: "from-red-500/10 to-white/5",
  },
  {
    nameKey: "germany",
    name: "Germany",
    flag: "🇩🇪",
    jobs: "900+",
    color: "from-black/5 to-red-500/10",
  },
  {
    nameKey: "australia",
    name: "Australia",
    flag: "🇦🇺",
    jobs: "800+",
    color: "from-blue-500/10 to-white/5",
  },
];

// Steps to get started
const getSteps = (t: any) => [
  {
    number: "01",
    title: t("applicants.createAccount"),
    description: t("applicants.createAccountDesc"),
    icon: Users,
  },
  {
    number: "02",
    title: t("applicants.buildCV"),
    description: t("applicants.buildCVDesc"),
    icon: FileText,
  },
  {
    number: "03",
    title: t("applicants.browseJobs"),
    description: t("applicants.browseJobsDesc"),
    icon: Search,
  },
  {
    number: "04",
    title: t("applicants.applyInterview"),
    description: t("applicants.applyInterviewDesc"),
    icon: Video,
  },
  {
    number: "05",
    title: t("applicants.getDeployed"),
    description: t("applicants.getDeployedDesc"),
    icon: Rocket,
  },
];

// Success stories
const getSuccessStories = (t: any) => [
  {
    name: "Maria Santos",
    role: t("applicants.nurse"),
    quote: t("applicants.nurseQuote"),
    avatar: "MS",
    flag: "🇸🇦",
  },
  {
    name: "Jose Cruz",
    role: t("applicants.engineer"),
    quote: t("applicants.engineerQuote"),
    avatar: "JC",
    flag: "🇦🇪",
  },
  {
    name: "Anna Reyes",
    role: t("applicants.hotelManager"),
    quote: t("applicants.hotelManagerQuote"),
    avatar: "AR",
    flag: "🇶🇦",
  },
];

export default function ForApplicantsPage() {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  const jobCategories = getJobCategories(t);
  const benefits = getBenefits(t);
  const steps = getSteps(t);
  const successStories = getSuccessStories(t);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-[100vh] flex items-center justify-center hero-pattern particle-bg"
      >
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
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
          <motion.div
            className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
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
                <Badge className="px-4 py-2 bg-gradient-to-r from-accent/10 to-primary/10 text-foreground border-accent/20 font-medium">
                  <Users className="w-4 h-4 mr-2 text-accent" />
                  {t("applicants.heroLabel", "For Job Seekers")}
                </Badge>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6"
              >
                {t("applicants.heroTitle", "Find Your Dream Job")}{" "}
                <span className="gradient-text">
                  {t("applicants.heroTitleHighlight", "Abroad")}
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed"
              >
                {t(
                  "applicants.heroSubtitle",
                  "Access 10,000+ verified job openings worldwide. Get deployed in",
                )}{" "}
                <span className="font-semibold text-accent">
                  {t("applicants.heroDays", "21-30 days")}
                </span>{" "}
                {t("applicants.heroZeroFees", "with zero placement fees.")}
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 mb-8 justify-center"
              >
                <AuthCTA
                  primaryText={t("applicants.startFree", "Start Free")}
                  secondaryText={t("applicants.browseJobs")}
                  primaryLink="/register"
                  secondaryLink="/services"
                  primaryVariant="default"
                  secondaryVariant="outline"
                  size="lg"
                />
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-6 items-center justify-center"
              >
                {[
                  {
                    icon: Users,
                    value: "50K+",
                    label: t("landing.stats.workersDeployed"),
                  },
                  {
                    icon: Globe,
                    value: "30+",
                    label: t("landing.stats.countries"),
                  },
                  {
                    icon: TrendingUp,
                    value: "98%",
                    label: t("landing.stats.successRate"),
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-lg font-bold">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Job Categories with Images */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-muted/50 via-background to-muted/30" />

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              <Briefcase className="w-4 h-4 mr-2" />
              {t("applicants.jobCategories")}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              {t("applicants.explorJobs", "Explore")}{" "}
              <span className="gradient-text">
                {t("applicants.exploreJobsHighlight", "10,000+ Jobs")}
              </span>{" "}
              {t("applicants.acrossIndustries", "Across Industries")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t(
                "applicants.categoriesSubtitle",
                "Find opportunities in your field with verified employers worldwide.",
              )}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {jobCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:shadow-2xl hover:border-accent/30 transition-all duration-300"
              >
                {/* Category Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.parentElement!.style.background = `linear-gradient(135deg, ${category.gradient})`;
                    }}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />

                  {/* Icon Badge */}
                  <motion.div
                    className={`absolute top-4 right-4 w-12 h-12 rounded-xl ${category.iconBg} ${category.iconColor} backdrop-blur-sm flex items-center justify-center`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <category.icon className="h-6 w-6" />
                  </motion.div>

                  {/* Job Count Badge */}
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-accent/90 text-white backdrop-blur-sm">
                      {category.jobs}
                    </Badge>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-display font-semibold mb-2">
                    {category.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {category.description}
                  </p>

                  <Link to="/register">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="group/btn text-accent hover:text-accent hover:bg-accent/5 w-full"
                    >
                      {t("applicants.browseJobs")}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/3 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              <Award className="w-4 h-4 mr-2" />
              {t("applicants.whyChooseUs", "Why Choose Us")}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              {t("applicants.benefits")} {t("applicants.forApplicants", "for")}{" "}
              <span className="gradient-text">
                {t("applicants.applicantsLabel", "Applicants")}
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t(
                "applicants.benefitsSubtitle",
                "We put workers first with comprehensive support and transparent practices.",
              )}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-accent/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />

                <div className="relative neon-box bg-card p-6 rounded-2xl hover:shadow-xl transition-all duration-300">
                  <div className="flex gap-4">
                    <motion.div
                      className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform"
                      whileHover={{ rotate: 5 }}
                    >
                      <benefit.icon className="h-6 w-6" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              <MapPin className="w-4 h-4 mr-2" />
              {t("applicants.destinations")}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              {t("applicants.workIn", "Work in")}{" "}
              <span className="gradient-text">
                {t("applicants.thirtyCountries", "30+ Countries")}
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t(
                "applicants.destinationsSubtitle",
                "Connect with verified employers from around the world.",
              )}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {destinations.map((destination, index) => (
              <motion.div
                key={destination.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.2 },
                }}
                className="neon-box bg-card p-6 rounded-2xl text-center group cursor-pointer"
              >
                <motion.span
                  className="text-5xl mb-4 block"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {destination.flag}
                </motion.span>
                <h3 className="font-semibold mb-1">{destination.name}</h3>
                <p className="text-sm text-accent font-medium">
                  {destination.jobs} {t("applicants.jobsLabel", "jobs")}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              <Star className="w-4 h-4 mr-2 fill-accent text-accent" />
              {t("applicants.successStories")}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              {t("applicants.realStories", "Real Stories from")}{" "}
              <span className="gradient-text">
                {t("applicants.realPeople", "Real People")}
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {successStories.map((story, index) => (
              <motion.div
                key={story.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="neon-box bg-card p-6 rounded-2xl"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full gradient-bg text-white font-semibold flex items-center justify-center">
                    {story.avatar}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{story.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {story.role}
                    </p>
                  </div>
                  <span className="text-2xl">{story.flag}</span>
                </div>
                <p className="text-muted-foreground italic">"{story.quote}"</p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Get Started Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg" />

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-white/10 text-white border-white/20">
              <Clock className="w-4 h-4 mr-2" />
              {t("applicants.steps")}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              {t("applicants.fiveSteps", "5 Simple Steps to Your Dream Job")}
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              {t(
                "applicants.stepsSubtitle",
                "Our streamlined process makes finding work abroad easier than ever.",
              )}
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6 mb-8 last:mb-0 group"
              >
                <motion.div
                  className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-accent text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform"
                  whileHover={{ rotate: 5 }}
                >
                  {step.number}
                </motion.div>
                <div className="flex-1 pt-3">
                  <div className="flex items-center gap-3 mb-2">
                    <step.icon className="h-6 w-6 text-accent" />
                    <h3 className="text-xl font-display font-semibold text-white">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-white/70">{step.description}</p>
                </div>
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
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
              {t("applicants.ctaTitle", "Ready to Start Your")}{" "}
              <span className="gradient-text">
                {t("applicants.ctaHighlight", "Global Career?")}
              </span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t(
                "applicants.ctaSubtitle",
                "Create your free account today and take the first step towards your dream job abroad. No fees, no hidden costs.",
              )}
            </p>
            <AuthCTA
              primaryText={t("common.getStarted")}
              secondaryText={t("common.learnMore")}
              primaryLink="/register"
              secondaryLink="/services"
              primaryVariant="default"
              secondaryVariant="outline"
              size="lg"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
