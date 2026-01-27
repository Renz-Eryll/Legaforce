import { motion, useScroll, useTransform } from "framer-motion";
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
  Target,
  DollarSign,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRef } from "react";

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
    stat: "#1",
    statLabel: "In Asia",
  },
  {
    icon: Award,
    title: "Strong Work Ethic",
    description:
      "Filipino workers are known for dedication, loyalty, and attention to detail.",
    stat: "98%",
    statLabel: "Retention",
  },
  {
    icon: Users,
    title: "Cultural Adaptability",
    description:
      "Easily integrates into diverse work environments and multicultural teams.",
    stat: "30+",
    statLabel: "Countries",
  },
  {
    icon: TrendingUp,
    title: "Skilled Workforce",
    description:
      "Access to professionals across healthcare, engineering, IT, and more.",
    stat: "10M+",
    statLabel: "Workers",
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
    image: "/images/employers/ai-matching.jpg",
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
    image: "/images/employers/video-interview.jpg",
  },
  {
    icon: FileCheck,
    title: "Document Processing",
    description:
      "We handle all visa paperwork, certifications, and compliance requirements.",
    features: ["Visa processing", "Medical clearances", "Background checks"],
    image: "/images/employers/documents.jpg",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description:
      "Your dedicated account manager ensures smooth recruitment and deployment.",
    features: ["24/7 assistance", "Onboarding support", "Issue resolution"],
    image: "/images/employers/support.jpg",
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
  { value: "500+", label: "Partner Employers", icon: Building2 },
  { value: "98%", label: "Retention Rate", icon: TrendingUp },
  { value: "21 Days", label: "Average Deployment", icon: Clock },
  { value: "50,000+", label: "Workers Deployed", icon: Users },
];

// Process steps
const processSteps = [
  {
    step: "01",
    title: "Share Requirements",
    description:
      "Tell us about your staffing needs, job requirements, and timeline.",
    icon: FileCheck,
  },
  {
    step: "02",
    title: "Candidate Matching",
    description: "Our AI matches you with pre-screened, qualified candidates.",
    icon: Search,
  },
  {
    step: "03",
    title: "Interview & Select",
    description: "Conduct interviews and select your ideal candidates.",
    icon: Video,
  },
  {
    step: "04",
    title: "We Handle the Rest",
    description:
      "We process documentation and deploy workers to your location.",
    icon: Zap,
  },
];

// Client testimonials
const testimonials = [
  {
    company: "Global Healthcare Corp",
    industry: "Healthcare",
    quote:
      "Legaforce delivered 50 qualified nurses in just 3 weeks. Their AI matching saved us months of recruitment time.",
    logo: "GH",
    rating: 5,
  },
  {
    company: "Tech Solutions ME",
    industry: "IT Services",
    quote:
      "The quality of candidates and speed of deployment exceeded our expectations. Best recruitment partner we've worked with.",
    logo: "TS",
    rating: 5,
  },
  {
    company: "Hospitality International",
    industry: "Hotels & Resorts",
    quote:
      "Their 24/7 support and transparent process made scaling our workforce seamless. Highly recommended.",
    logo: "HI",
    rating: 5,
  },
];

export default function ForEmployersPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-[100vh] flex items-center bg-gradient-to-br from-primary/5 via-background to-accent/5"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
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
                <Badge variant="premium" className="px-4 py-1.5 text-sm">
                  <Building2 className="w-4 h-4 mr-2" />
                  For Employers
                </Badge>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
              >
                Hire Top <span className="text-accent">Filipino Talent</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-8"
              >
                Access a pool of 50,000+ skilled, pre-screened Filipino workers.
                Streamlined recruitment, faster deployment, and comprehensive
                support for employers worldwide.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-5 mb-8 items-center justify-center"
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

              {/* Trust Indicators */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-6  items-center justify-center"
              >
                {[
                  { icon: Shield, label: "ISO Certified" },
                  { icon: BadgeCheck, label: "POEA Licensed" },
                  { icon: Award, label: "500+ Clients" },
                ].map((item, index) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-success" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {item.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
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
                className="text-center group cursor-pointer"
              >
                <motion.div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/20 text-accent mb-4 group-hover:scale-110 transition-transform"
                  whileHover={{ rotate: 10 }}
                >
                  <stat.icon className="h-6 w-6" />
                </motion.div>
                <motion.div
                  className="text-2xl sm:text-3xl font-bold mb-1"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm">{stat.label}</div>
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
                className="group relative"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-accent/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />

                <div className="relative p-6 lg:p-8 rounded-2xl border border-border bg-card hover:shadow-xl hover:border-accent/30 transition-all duration-300 text-center">
                  <motion.div
                    className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent/10 text-accent mb-4 group-hover:scale-110 transition-transform"
                    whileHover={{ rotate: 10 }}
                  >
                    <item.icon className="h-7 w-7" />
                  </motion.div>

                  <div className="text-3xl font-bold text-accent mb-1">
                    {item.stat}
                  </div>
                  <div className="text-xs text-muted-foreground mb-3">
                    {item.statLabel}
                  </div>

                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section with Images */}
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
                className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:shadow-xl hover:border-accent/30 transition-all duration-300"
              >
                {/* Service Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />

                  <motion.div
                    className="absolute top-4 right-4 w-12 h-12 rounded-xl bg-accent/90 text-white backdrop-blur-sm flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <service.icon className="h-6 w-6" />
                  </motion.div>
                </div>

                <div className="p-6 lg:p-8">
                  <h3 className="text-xl font-semibold mb-3">
                    {service.title}
                  </h3>
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
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
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
                whileHover={{ scale: 1.05 }}
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

      {/* Testimonials */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              <Star className="w-4 h-4 mr-2 fill-accent text-accent" />
              Client Success
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Trusted by{" "}
              <span className="gradient-text">Leading Companies</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.company}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="neon-box bg-card p-6 rounded-2xl"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl gradient-bg text-white font-bold flex items-center justify-center">
                    {testimonial.logo}
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.company}</h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.industry}
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 lg:py-32 bg-primary text-primary-foreground relative overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
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

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
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
                className="text-center group"
              >
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent text-white font-bold text-xl mb-4 group-hover:scale-110 transition-transform"
                  whileHover={{ rotate: 10 }}
                >
                  {item.step}
                </motion.div>
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-6 h-6 text-accent" />
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
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="premium" size="xl" className="min-w-[200px]">
                    Start Hiring Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/about">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="outline" size="xl" className="min-w-[200px]">
                    Learn About Us
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
