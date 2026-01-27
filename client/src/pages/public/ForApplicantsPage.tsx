import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Award,
  CheckCircle,
  Briefcase,
  FileText,
  Users,
  Clock,
  TrendingUp,
  Sparkles,
  Heart,
  MapPin,
  DollarSign,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

// Job categories
const jobCategories = [
  {
    icon: Heart,
    title: "Healthcare",
    description: "Nurses, Caregivers, Medical Technicians",
    jobs: "2,500+ openings",
  },
  {
    icon: Briefcase,
    title: "Engineering",
    description: "Civil, Mechanical, Electrical Engineers",
    jobs: "1,200+ openings",
  },
  {
    icon: Users,
    title: "Hospitality",
    description: "Hotel Staff, Chefs, Restaurant Crew",
    jobs: "3,000+ openings",
  },
  {
    icon: GraduationCap,
    title: "Education",
    description: "Teachers, Tutors, Trainers",
    jobs: "800+ openings",
  },
  {
    icon: Globe,
    title: "IT & Technology",
    description: "Developers, Support, Technicians",
    jobs: "1,500+ openings",
  },
  {
    icon: TrendingUp,
    title: "Skilled Trades",
    description: "Welders, Electricians, Plumbers",
    jobs: "2,000+ openings",
  },
];

// Benefits for applicants
const benefits = [
  {
    icon: DollarSign,
    title: "Zero Placement Fees",
    description:
      "We follow ethical recruitment practices. You'll never pay excessive fees to find work abroad.",
  },
  {
    icon: Shield,
    title: "Worker Protection",
    description:
      "24/7 support hotline, anonymous reporting system, and advocacy for your rights.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered CV Builder",
    description:
      "Create a professional, internationally-formatted CV in minutes with our smart AI tool.",
  },
  {
    icon: Clock,
    title: "Fast Deployment",
    description:
      "Our streamlined process gets you deployed in 21-30 days, not the usual 90+ days.",
  },
  {
    icon: FileText,
    title: "Real-Time Tracking",
    description:
      "Track every step of your application from submission to deployment online.",
  },
  {
    icon: Award,
    title: "Rewards Program",
    description:
      "Earn points for completing milestones and redeem them for priority processing.",
  },
];

// Destination countries
const destinations = [
  { name: "Saudi Arabia", flag: "🇸🇦", jobs: "5,000+" },
  { name: "UAE", flag: "🇦🇪", jobs: "3,500+" },
  { name: "Qatar", flag: "🇶🇦", jobs: "2,000+" },
  { name: "Singapore", flag: "🇸🇬", jobs: "1,800+" },
  { name: "Japan", flag: "🇯🇵", jobs: "1,500+" },
  { name: "Canada", flag: "🇨🇦", jobs: "1,200+" },
  { name: "Germany", flag: "🇩🇪", jobs: "900+" },
  { name: "Australia", flag: "🇦🇺", jobs: "800+" },
];

// Steps to get started
const steps = [
  {
    number: "01",
    title: "Create Your Account",
    description:
      "Sign up for free and complete your profile with personal and professional information.",
  },
  {
    number: "02",
    title: "Build Your CV",
    description:
      "Use our AI-powered CV builder to create a professional, internationally-formatted resume.",
  },
  {
    number: "03",
    title: "Browse Opportunities",
    description:
      "Explore thousands of verified job openings from employers around the world.",
  },
  {
    number: "04",
    title: "Apply & Interview",
    description:
      "Submit applications with one click and complete video interviews from home.",
  },
  {
    number: "05",
    title: "Get Deployed",
    description:
      "Complete documentation with our guidance and start your international career.",
  },
];

export default function ForApplicantsPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center bg-gradient-to-br from-accent/5 via-background to-primary/5">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <Badge variant="premium" className="px-4 py-1.5 text-sm">
                <Users className="w-4 h-4 mr-2" />
                For Job Seekers
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
            >
              Your Dream Job Abroad{" "}
              <span className="text-accent">Starts Here</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            >
              Join 50,000+ Filipino workers who have found success through
              Legaforce. Zero placement fees, transparent process, and
              comprehensive support at every step.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/register">
                <Button variant="hero" size="xl">
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="hero-secondary" size="xl">
                  Sign In to Dashboard
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Job Categories Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              Job Categories
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Find Your Perfect Role
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We connect skilled Filipino workers with opportunities across all
              major industries worldwide.
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
                className="group relative p-6 lg:p-8 rounded-2xl border border-border bg-card hover:shadow-xl hover:border-accent/30 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-accent/10 text-accent mb-4 group-hover:scale-110 transition-transform">
                  <category.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {category.description}
                </p>
                <Badge
                  variant="outline"
                  className="text-accent border-accent/30"
                >
                  {category.jobs}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              Why Choose Us
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Benefits for Applicants
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We put workers first with comprehensive support and transparent
              practices.
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
                className="flex gap-4 p-6 rounded-2xl bg-card border border-border"
              >
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              <MapPin className="w-4 h-4 mr-2" />
              Destinations
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Work in 30+ Countries
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with verified employers from around the world.
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
                className="p-6 rounded-2xl border border-border bg-card hover:border-accent/30 hover:shadow-lg transition-all text-center"
              >
                <span className="text-4xl mb-3 block">{destination.flag}</span>
                <h3 className="font-semibold mb-1">{destination.name}</h3>
                <p className="text-sm text-accent">{destination.jobs} jobs</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Get Started Section */}
      <section className="py-20 lg:py-32 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
              Getting Started
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              5 Simple Steps to Your Dream Job
            </h2>
            <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">
              Our streamlined process makes finding work abroad easier than
              ever.
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
                className="flex gap-6 mb-8 last:mb-0"
              >
                <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-accent text-accent-foreground font-bold text-xl">
                  {step.number}
                </div>
                <div className="flex-1 pt-3">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-primary-foreground/70">
                    {step.description}
                  </p>
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
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Start Your{" "}
              <span className="text-accent">Global Career?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Create your free account today and take the first step towards
              your dream job abroad. No fees, no hidden costs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button variant="premium" size="xl" className="min-w-[200px]">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="xl" className="min-w-[200px]">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
