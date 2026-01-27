import { motion } from "framer-motion";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

// Stats data
const stats = [
  { value: "50,000+", label: "Workers Deployed", icon: Users },
  { value: "500+", label: "Partner Employers", icon: Building2 },
  { value: "30+", label: "Countries", icon: Globe },
  { value: "98%", label: "Success Rate", icon: TrendingUp },
];

// Features data
const features = [
  {
    icon: Sparkles,
    title: "AI-Powered CV Builder",
    description:
      "Generate professional CVs instantly with our AI technology. Stand out to employers worldwide.",
    color: "from-amber-500/20 to-yellow-500/10",
  },
  {
    icon: Zap,
    title: "Faster Deployment",
    description:
      "Our automated workflows reduce deployment time from 90 days to just 21-30 days.",
    color: "from-blue-500/20 to-indigo-500/10",
  },
  {
    icon: Shield,
    title: "Worker Protection",
    description:
      "Comprehensive support system with anonymous reporting and 24/7 assistance.",
    color: "from-emerald-500/20 to-green-500/10",
  },
  {
    icon: Globe,
    title: "Global Opportunities",
    description:
      "Connect with verified employers from 30+ countries across all industries.",
    color: "from-purple-500/20 to-violet-500/10",
  },
  {
    icon: FileCheck,
    title: "End-to-End Tracking",
    description:
      "Real-time status updates from application to deployment. Always know where you stand.",
    color: "from-orange-500/20 to-red-500/10",
  },
  {
    icon: Award,
    title: "Rewards Program",
    description:
      "Earn points for completing milestones and redeem them for priority processing.",
    color: "from-pink-500/20 to-rose-500/10",
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
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center mesh-gradient">
        {/* Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>

        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              {/* Badge */}
              <motion.div variants={fadeInUp} className="mb-6">
                <Badge className="px-4 py-2 bg-accent/10 text-accent border-accent/20 font-medium">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Trusted by 50,000+ Filipino Workers
                </Badge>
              </motion.div>

              {/* Heading */}
              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold tracking-tight mb-6"
              >
                Your Gateway to{" "}
                <span className="text-accent">Global Careers</span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                variants={fadeInUp}
                className="text-lg sm:text-xl text-muted-foreground max-w-xl mb-8"
              >
                The Philippines' most transparent and worker-first recruitment
                platform. AI-powered matching, real-time tracking, and
                comprehensive support from application to deployment.
              </motion.p>

              {/* CTAs */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row items-start gap-4 mb-10"
              >
                <Link to="/register">
                  <Button
                    size="lg"
                    className="group h-14 px-8 gradient-bg-accent text-accent-foreground font-semibold shadow-lg hover:shadow-xl hover:shadow-accent/20 transition-all duration-300"
                  >
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/employers">
                  <Button
                    variant="outline"
                    size="lg"
                    className="group h-14 px-8 border-2"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Watch Demo
                  </Button>
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap items-center gap-x-6 gap-y-3"
              >
                {trustIndicators.map((indicator) => (
                  <div
                    key={indicator}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle className="h-4 w-4 text-success" />
                    {indicator}
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Content - Stats Cards */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className={`card-premium p-6 ${index === 0 ? "col-span-2 sm:col-span-1" : ""}`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10">
                        <stat.icon className="h-5 w-5 text-accent" />
                      </div>
                    </div>
                    <div className="text-3xl lg:text-4xl font-display font-bold text-foreground mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute -top-4 -right-4 lg:-right-8 bg-accent text-accent-foreground px-4 py-2 rounded-full font-semibold text-sm shadow-lg shadow-accent/20"
              >
                🎉 Now Hiring!
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-sm">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronRight className="h-5 w-5 rotate-90" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 lg:py-32 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 lg:mb-20"
          >
            <Badge variant="secondary" className="mb-4">
              Why Choose Legaforce
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
              Recruitment, <span className="text-accent">Reimagined</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We combine cutting-edge AI technology with human-centered support
              to create the most transparent recruitment experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group card-premium p-8"
              >
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="h-7 w-7 text-foreground" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 lg:py-32 bg-muted/30 dark:bg-muted/10 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-y-1/2" />
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary/5 dark:bg-accent/5 rounded-full blur-3xl -translate-y-1/2" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 lg:mb-20"
          >
            <Badge variant="secondary" className="mb-4">
              Simple Process
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
              How It <span className="text-accent">Works</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From application to deployment in just a few simple steps.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 relative">
              {/* Connection Line */}
              <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-accent/50 via-accent to-accent/50" />

              {[
                {
                  step: "01",
                  title: "Create Profile",
                  description:
                    "Sign up and build your professional profile with our AI-powered CV builder.",
                },
                {
                  step: "02",
                  title: "Browse & Apply",
                  description:
                    "Explore job opportunities and apply to positions that match your skills.",
                },
                {
                  step: "03",
                  title: "Interview",
                  description:
                    "Complete video interviews and get matched with the right employers.",
                },
                {
                  step: "04",
                  title: "Get Deployed",
                  description:
                    "Complete documentation and start your international career.",
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
                  <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-card border-2 border-accent/20 mb-6 shadow-lg">
                    <span className="font-display font-bold text-3xl text-accent">
                      {item.step}
                    </span>
                    {/* Pulse effect */}
                    <div className="absolute inset-0 rounded-2xl bg-accent/20 animate-ping opacity-20" />
                  </div>
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
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              Success Stories
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
              Trusted by Workers <span className="text-accent">Worldwide</span>
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
                className="card-premium p-8"
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
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 text-accent font-semibold">
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
      <section className="py-24 lg:py-32 bg-primary dark:bg-card relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-primary-foreground dark:text-foreground mb-6">
              Ready to Start Your{" "}
              <span className="text-accent">Global Career?</span>
            </h2>
            <p className="text-lg text-primary-foreground/70 dark:text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of Filipino workers who have found success through
              Legaforce. Your dream job abroad is just a few clicks away.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button
                  size="lg"
                  className="group h-14 px-10 gradient-bg-accent text-accent-foreground font-semibold shadow-lg hover:shadow-xl hover:shadow-accent/30 transition-all duration-300"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary dark:border-border dark:text-foreground dark:hover:bg-muted"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
