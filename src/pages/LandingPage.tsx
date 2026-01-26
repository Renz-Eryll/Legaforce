import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Users,
  CheckCircle,
  Star,
  ChevronRight,
  Award,
  Clock,
  TrendingUp,
  Building2,
  FileCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero-workers.jpg";

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

// Stats data
const stats = [
  { value: "50,000+", label: "Workers Deployed" },
  { value: "500+", label: "Partner Employers" },
  { value: "30+", label: "Countries" },
  { value: "98%", label: "Success Rate" },
];

// Features data
const features = [
  {
    icon: Sparkles,
    title: "AI-Powered CV Builder",
    description:
      "Generate professional CVs instantly with our AI technology. Stand out to employers worldwide.",
  },
  {
    icon: Zap,
    title: "Faster Deployment",
    description:
      "Our automated workflows reduce deployment time from 90 days to just 21-30 days.",
  },
  {
    icon: Shield,
    title: "Worker Protection",
    description:
      "Comprehensive support system with anonymous reporting and 24/7 assistance.",
  },
  {
    icon: Globe,
    title: "Global Opportunities",
    description:
      "Connect with verified employers from 30+ countries across all industries.",
  },
  {
    icon: FileCheck,
    title: "End-to-End Tracking",
    description:
      "Real-time status updates from application to deployment. Always know where you stand.",
  },
  {
    icon: Award,
    title: "Rewards Program",
    description:
      "Earn points for completing milestones and redeem them for priority processing.",
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
  },
  {
    quote:
      "The AI CV builder helped me present my skills professionally. I got shortlisted within a week of applying!",
    author: "Jose Reyes",
    role: "Engineer, Qatar",
    rating: 5,
  },
  {
    quote:
      "Unlike other agencies, Legaforce kept me informed throughout the process. No hidden fees, no surprises.",
    author: "Anna Cruz",
    role: "Hotel Staff, UAE",
    rating: 5,
  },
];

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-hero-pattern dark:bg-hero-pattern-dark">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Filipino workers"
            className="w-full h-full object-cover opacity-10 dark:opacity-5"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="mb-6">
              <Badge variant="premium" className="px-4 py-1.5 text-sm">
                <Sparkles className="w-4 h-4 mr-2" />
                Trusted by 50,000+ Workers
              </Badge>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
            >
              Your Gateway to{" "}
              <span className="text-accent">Global Careers</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            >
              The Philippines' most transparent and worker-first recruitment
              platform. AI-powered matching, real-time tracking, and
              comprehensive support from application to deployment.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <Link to="/register">
                <Button variant="hero" size="xl">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/employers">
                <Button variant="hero-secondary" size="xl">
                  Hire Filipino Talent
                </Button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap items-center justify-center gap-4 sm:gap-8"
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
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-accent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-primary-foreground/70">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              Why Choose Legaforce
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Recruitment, Reimagined
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
                className="group relative p-6 lg:p-8 rounded-2xl border border-border bg-card hover:shadow-lg hover:border-accent/20 transition-all duration-300"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 text-accent mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              Simple Process
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From application to deployment in just a few simple steps.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
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
                title: "Interview & Selection",
                description:
                  "Complete video interviews and get matched with the right employers.",
              },
              {
                step: "04",
                title: "Deploy & Succeed",
                description:
                  "Complete documentation and start your international career.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border">
                    <ChevronRight className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                )}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground font-bold text-xl mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-32">
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
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Trusted by Workers Worldwide
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
                className="p-6 lg:p-8 rounded-2xl border border-border bg-card"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-accent text-accent"
                    />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Start Your{" "}
              <span className="text-accent">Global Career?</span>
            </h2>
            <p className="text-lg text-primary-foreground/70 mb-8">
              Join thousands of Filipino workers who have found success through
              Legaforce. Your dream job abroad is just a few clicks away.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button
                  variant="premium"
                  size="xl"
                  className="min-w-[200px]"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="outline"
                  size="xl"
                  className="min-w-[200px] border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
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
