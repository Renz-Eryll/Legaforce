import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Shield,
  Zap,
  Globe,
  CheckCircle,
  Star,
  ChevronRight,
  Award,
  FileCheck,
  Sparkles,
  Play,
  Users,
  Building2,
  TrendingUp,
  Briefcase,
  Clock,
  Target,
  MapPin,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRef } from "react";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
};

// Stats data
const stats = [
  { value: "50,000+", label: "Workers Deployed", icon: Users },
  { value: "500+", label: "Partner Employers", icon: Building2 },
  { value: "30+", label: "Countries", icon: Globe },
  { value: "98%", label: "Success Rate", icon: TrendingUp },
];

// Features data with brand colors
const features = [
  {
    icon: Sparkles,
    title: "AI-Powered CV Builder",
    description:
      "Generate professional CVs instantly with our AI technology. Stand out to employers worldwide.",
    gradient: "from-primary/20 via-primary/10 to-transparent",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    icon: Zap,
    title: "Faster Deployment",
    description:
      "Our automated workflows reduce deployment time from 90 days to just 21-30 days.",
    gradient: "from-accent/20 via-accent/10 to-transparent",
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
  },
  {
    icon: Shield,
    title: "Worker Protection",
    description:
      "Comprehensive support system with anonymous reporting and 24/7 assistance.",
    gradient: "from-emerald-500/20 via-emerald-500/10 to-transparent",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: Globe,
    title: "Global Opportunities",
    description:
      "Connect with verified employers from 30+ countries across all industries.",
    gradient: "from-primary/20 via-accent/10 to-transparent",
    iconBg: "bg-gradient-to-br from-primary/10 to-accent/10",
    iconColor: "text-primary dark:text-accent",
  },
  {
    icon: FileCheck,
    title: "End-to-End Tracking",
    description:
      "Real-time status updates from application to deployment. Always know where you stand.",
    gradient: "from-blue-500/20 via-blue-500/10 to-transparent",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: Award,
    title: "Rewards Program",
    description:
      "Earn points for completing milestones and redeem them for priority processing.",
    gradient: "from-accent/20 via-accent/10 to-transparent",
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
  },
];

// Trust indicators
const trustIndicators = [
  "POEA Licensed",
  "ISO 9001 Certified",
  "DMW Accredited",
  "OWWA Partner",
];

// Testimonials
const testimonials = [
  {
    quote:
      "Legaforce made my dream of working abroad a reality. The process was transparent and I felt supported every step of the way.",
    author: "Maria Santos",
    role: "Nurse, Saudi Arabia",
    rating: 5,
    avatar: "MS",
  },
  {
    quote:
      "The AI CV builder helped me present my skills professionally. I got shortlisted within a week of applying!",
    author: "Jose Reyes",
    role: "Engineer, Qatar",
    rating: 5,
    avatar: "JR",
  },
  {
    quote:
      "Unlike other agencies, Legaforce kept me informed throughout the process. No hidden fees, no surprises.",
    author: "Anna Cruz",
    role: "Hotel Staff, UAE",
    rating: 5,
    avatar: "AC",
  },
];

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  return (
    <div className="overflow-hidden">
      {/* Hero Section with Parallax & Animated Background */}
      <section
        ref={heroRef}
        className="relative min-h-[100vh] px-3 flex items-center hero-pattern particle-bg"
      >
        {/* Animated Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="orb orb-1"
            animate={{
              x: [0, 30, 0],
              y: [0, -30, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="orb orb-2"
            animate={{
              x: [0, -40, 0],
              y: [0, 40, 0],
              scale: [1, 0.95, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="orb orb-3"
            animate={{
              x: [0, 20, 0],
              y: [0, -20, 0],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23005085' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              style={{ opacity }}
            >
              {/* Badge with shine effect */}
              <motion.div variants={fadeInUp} className="mb-6">
                <Badge className="px-4 py-2 bg-gradient-to-r from-accent/10 to-primary/10 text-foreground border-accent/20 font-medium shine-effect">
                  <Sparkles className="w-4 h-4 mr-2 text-accent" />
                  Trusted by 50,000+ Filipino Workers
                </Badge>
              </motion.div>

              {/* Heading with gradient */}
              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold tracking-tight mb-6"
              >
                Your Gateway to{" "}
                <span className="gradient-text">Global Careers</span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                variants={fadeInUp}
                className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed"
              >
                Connect with verified employers worldwide. Get deployed in{" "}
                <span className="font-semibold text-accent">21-30 days</span>{" "}
                with our AI-powered recruitment platform.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 mb-8"
              >
                <Link to="/register">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className="group h-14 px-8 gradient-bg-accent text-white font-semibold shadow-2xl glow-accent"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/services">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-14 px-8 border-accent/20 hover:bg-accent/5"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Watch Demo
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-4 items-center"
              >
                {trustIndicators.map((indicator, index) => (
                  <motion.div
                    key={indicator}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle className="w-4 h-4 text-success" />
                    {indicator}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Content - Hero Image with Floating Elements */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
              style={{ scale }}
            >
              {/* Main Image Container with Neon Glow */}
              <div className="relative neon-box-lg rounded-3xl overflow-hidden aspect-[4/3]">
                {/* Placeholder for hero image */}
                <img
                  src="legaforce-image2.png"
                  alt="Filipino workers connecting with global employers"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback gradient background if image doesn't load
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement!.style.background =
                      "linear-gradient(135deg, hsl(201 100% 26%) 0%, hsl(26 74% 55%) 100%)";
                  }}
                />

                {/* Floating Stats Cards */}
                <motion.div
                  className="absolute top-6 left-6 glass-card p-4 rounded-xl backdrop-blur-md"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">50K+</div>
                      <div className="text-xs text-muted-foreground">
                        Deployed
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute bottom-6 right-6 glass-card p-4 rounded-xl backdrop-blur-md"
                  animate={{
                    y: [0, 10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">98%</div>
                      <div className="text-xs text-muted-foreground">
                        Success Rate
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Decorative Elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.7, 0.5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section with Parallax */}
      <section className="py-16 lg:py-20 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Animated background pattern */}
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zm20.97 0l9.315 9.314-1.414 1.414L34.828 0h2.83zM22.344 0L13.03 9.314l1.414 1.414L25.172 0h-2.83zM32 0l12.142 12.142-1.414 1.414L30 .828 17.272 13.556 15.858 12.14 28 0zm-4.828 0l6.485 6.485-1.414 1.414L24.344 0h2.83zM0 0l6.485 6.485 1.414-1.414L0 0zm0 0l16.485 16.485 1.414-1.414L1.414 0H0z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
          animate={{
            x: [0, 60, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
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
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/20 text-accent mb-4 group-hover:scale-110 transition-transform"
                  whileHover={{ rotate: 5 }}
                >
                  <stat.icon className="h-8 w-8" />
                </motion.div>
                <motion.div
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm sm:text-base text-primary-foreground/80">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with Image */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Platform Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
              Everything You Need to{" "}
              <span className="gradient-text">Succeed Abroad</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform combines cutting-edge AI technology
              with human expertise to support your global career journey.
            </p>
          </motion.div>

          {/* Feature Image Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="relative rounded-3xl overflow-hidden neon-box aspect-[16/9] lg:aspect-[21/9]">
              <img
                src="/images/platform-dashboard.jpg"
                alt="Legaforce platform dashboard showing AI CV builder and job matching"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement!.style.background =
                    "linear-gradient(135deg, hsl(201 100% 26% / 0.1) 0%, hsl(26 74% 55% / 0.1) 100%)";
                }}
              />

              {/* Floating UI Elements Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="glass-card p-6 rounded-2xl max-w-md"
                  initial={{ scale: 0, rotate: -5 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <div className="font-semibold">AI CV Builder</div>
                      <div className="text-sm text-muted-foreground">
                        Generate in 60 seconds
                      </div>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-accent"
                      initial={{ width: 0 }}
                      whileInView={{ width: "75%" }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, duration: 1 }}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
                <div className="relative p-6 lg:p-8 rounded-2xl border border-border bg-card hover:border-accent/30 transition-all duration-300">
                  <motion.div
                    className={`flex items-center justify-center w-14 h-14 rounded-xl ${feature.iconBg} ${feature.iconColor} mb-4 group-hover:scale-110 transition-transform`}
                    whileHover={{ rotate: 5 }}
                  >
                    <feature.icon className="h-7 w-7" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section with Visual Timeline */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              <Target className="w-4 h-4 mr-2" />
              Simple Process
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
              Your Journey to{" "}
              <span className="gradient-text">Global Success</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From application to deployment in just four simple steps.
            </p>
          </motion.div>

          {/* Visual Process Steps */}
          <div className="relative max-w-6xl mx-auto">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary transform -translate-y-1/2 opacity-20" />

            <div className="grid lg:grid-cols-4 gap-8 relative">
              {[
                {
                  step: "01",
                  title: "Create Profile",
                  description:
                    "Sign up and build your professional profile with our AI-powered CV builder.",
                  icon: Users,
                  color: "primary",
                },
                {
                  step: "02",
                  title: "Browse & Apply",
                  description:
                    "Explore job opportunities and apply to positions that match your skills.",
                  icon: Briefcase,
                  color: "accent",
                },
                {
                  step: "03",
                  title: "Interview",
                  description:
                    "Complete video interviews and get matched with the right employers.",
                  icon: Target,
                  color: "primary",
                },
                {
                  step: "04",
                  title: "Get Deployed",
                  description:
                    "Complete documentation and start your international career.",
                  icon: Globe,
                  color: "accent",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="relative text-center"
                >
                  <motion.div
                    className={`relative inline-flex items-center justify-center w-24 h-24 rounded-2xl ${
                      item.color === "accent"
                        ? "gradient-bg-accent"
                        : "gradient-bg"
                    } mb-6 shadow-lg`}
                    whileHover={{
                      scale: 1.1,
                      rotate: 5,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <span className="font-display font-bold text-3xl text-white relative z-10">
                      {item.step}
                    </span>
                    {/* Icon in background */}
                    <item.icon className="absolute w-12 h-12 text-white/20" />
                    {/* Pulse effect */}
                    <motion.div
                      className={`absolute inset-0 rounded-2xl ${
                        item.color === "accent"
                          ? "bg-accent/20"
                          : "bg-primary/20"
                      }`}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>
                  <h3 className="text-lg font-display font-semibold mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 lg:py-32 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              <Star className="w-4 h-4 mr-2 fill-accent text-accent" />
              Success Stories
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
              Trusted by Workers{" "}
              <span className="gradient-text">Worldwide</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.2 },
                }}
                className="neon-box backdrop-blur-sm bg-card/80 p-8"
              >
                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-foreground mb-8 leading-relaxed text-lg">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full gradient-bg text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 gradient-bg" />
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-0 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 25,
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
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-white mb-6">
              Ready to Start Your{" "}
              <span className="text-accent">Global Career?</span>
            </h2>
            <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of Filipino workers who have found success through
              Legaforce. Your dream job abroad is just a few clicks away.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="group h-14 px-10 bg-accent hover:bg-accent/90 text-white font-semibold shadow-2xl"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/about">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 px-10 border-white/20 text-white hover:bg-white/10"
                  >
                    Learn More About Us
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
