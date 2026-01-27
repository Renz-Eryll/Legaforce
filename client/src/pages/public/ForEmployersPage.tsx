import { motion } from "framer-motion";
import { Link } from "react-router-dom";
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

// Why hire Filipino workers
const whyFilipino = [
  {
    icon: Globe,
    title: "English Proficiency",
    description:
      "The Philippines ranks among the top English-speaking countries in Asia.",
  },
  {
    icon: Award,
    title: "Strong Work Ethic",
    description:
      "Filipino workers are known for dedication, loyalty, and attention to detail.",
  },
  {
    icon: Users,
    title: "Cultural Adaptability",
    description:
      "Easily integrates into diverse work environments and multicultural teams.",
  },
  {
    icon: TrendingUp,
    title: "Skilled Workforce",
    description:
      "Access to professionals across healthcare, engineering, IT, and more.",
  },
];

// Services for employers
const services = [
  {
    icon: Search,
    title: "AI-Powered Matching",
    description:
      "Our intelligent algorithms match you with candidates that perfectly fit your requirements.",
    features: [
      "Skills-based matching",
      "Experience verification",
      "Cultural fit assessment",
    ],
  },
  {
    icon: Video,
    title: "Video Interviews",
    description:
      "Conduct interviews remotely with our integrated video platform and evaluation tools.",
    features: [
      "Scheduling automation",
      "Recording & playback",
      "Collaborative scoring",
    ],
  },
  {
    icon: FileCheck,
    title: "Document Processing",
    description:
      "We handle all visa paperwork, certifications, and compliance requirements.",
    features: [
      "Visa processing",
      "Medical clearances",
      "Background checks",
    ],
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description:
      "Your dedicated account manager ensures smooth recruitment and deployment.",
    features: [
      "24/7 assistance",
      "Onboarding support",
      "Issue resolution",
    ],
  },
];

// Industries served
const industries = [
  "Healthcare",
  "Construction",
  "Hospitality",
  "Manufacturing",
  "Oil & Gas",
  "IT & Technology",
  "Education",
  "Retail",
  "Transportation",
  "Agriculture",
  "Food & Beverage",
  "Finance",
];

// Stats
const stats = [
  { value: "500+", label: "Partner Employers" },
  { value: "98%", label: "Retention Rate" },
  { value: "21 Days", label: "Average Deployment" },
  { value: "50,000+", label: "Workers Deployed" },
];

// Process steps
const processSteps = [
  {
    step: "01",
    title: "Share Requirements",
    description: "Tell us about your staffing needs, job requirements, and timeline.",
  },
  {
    step: "02",
    title: "Candidate Matching",
    description: "Our AI matches you with pre-screened, qualified candidates.",
  },
  {
    step: "03",
    title: "Interview & Select",
    description: "Conduct interviews and select your ideal candidates.",
  },
  {
    step: "04",
    title: "We Handle the Rest",
    description: "We process documentation and deploy workers to your location.",
  },
];

export default function ForEmployersPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
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
                <Building2 className="w-4 h-4 mr-2" />
                For Employers
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
            >
              Hire Top{" "}
              <span className="text-accent">Filipino Talent</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            >
              Access a pool of 50,000+ skilled, pre-screened Filipino workers.
              Streamlined recruitment, faster deployment, and comprehensive
              support for employers worldwide.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/register">
                <Button variant="hero" size="xl">
                  Start Hiring
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="hero-secondary" size="xl">
                  View Our Services
                </Button>
              </Link>
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
              Why Filipino Workers?
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              The World's Preferred Workforce
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Over 10 million Filipino workers are employed worldwide, valued
              for their skills and professionalism.
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
                className="p-6 lg:p-8 rounded-2xl border border-border bg-card hover:shadow-xl hover:border-accent/30 hover:-translate-y-1 transition-all duration-300 text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent/10 text-accent mb-4">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              Our Services
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              End-to-End Recruitment Solutions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From sourcing to deployment, we handle every aspect of
              international recruitment.
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
                className="p-6 lg:p-8 rounded-2xl border border-border bg-card"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                    <service.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                </div>
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
              Industries We Serve
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Talent for Every Sector
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide skilled workers across all major industries worldwide.
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

      {/* Process Section */}
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
              How It Works
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Simple Hiring Process
            </h2>
            <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">
              Start hiring world-class Filipino talent in four simple steps.
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
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent text-accent-foreground font-bold text-xl mb-4">
                  {item.step}
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
              Ready to Build Your{" "}
              <span className="text-accent">Dream Team?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join 500+ employers worldwide who trust Legaforce for their
              international hiring needs. Get started today with no commitment.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button variant="premium" size="xl" className="min-w-[200px]">
                  Start Hiring Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="xl" className="min-w-[200px]">
                  Learn About Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
