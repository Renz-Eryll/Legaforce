import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Shield,
  Globe,
  CheckCircle,
  Sparkles,
  FileCheck,
  Video,
  Users,
  Clock,
  Headphones,
  GraduationCap,
  Briefcase,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRef } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const coreServices = [
  {
    icon: Sparkles,
    title: "AI-Powered CV Builder",
    description:
      "Generate professional CVs instantly with our advanced AI technology.",
    features: [
      "Multiple templates",
      "Industry optimization",
      "Multi-language support",
    ],
    image: "/images/services/cv-builder.jpg",
  },
  {
    icon: Users,
    title: "Candidate Matching",
    description:
      "Intelligent matching connects right candidates with right opportunities.",
    features: [
      "Skills-based matching",
      "Experience verification",
      "Real-time updates",
    ],
    image: "/images/services/matching.jpg",
  },
  {
    icon: Video,
    title: "Video Interview Platform",
    description:
      "Conduct seamless remote interviews with our integrated platform.",
    features: [
      "One-click scheduling",
      "HD video quality",
      "Collaborative scoring",
    ],
    image: "/images/services/video-interview.jpg",
  },
  {
    icon: FileCheck,
    title: "Document Processing",
    description:
      "We handle all documentation from visa applications to medical clearances.",
    features: [
      "Visa processing",
      "Medical examinations",
      "Background verification",
    ],
    image: "/images/services/documents.jpg",
  },
  {
    icon: GraduationCap,
    title: "Pre-Departure Training",
    description:
      "Comprehensive training programs prepare workers for their new roles.",
    features: [
      "Language courses",
      "Cultural orientation",
      "Job-specific training",
    ],
    image: "/images/services/training.jpg",
  },
  {
    icon: Headphones,
    title: "24/7 Worker Support",
    description:
      "Round-the-clock assistance including emergency support and advocacy.",
    features: ["Hotline support", "Emergency assistance", "Legal advocacy"],
    image: "/images/services/support.jpg",
  },
];

const valueProps = [
  {
    icon: Clock,
    title: "Faster Deployment",
    stat: "21-30 Days",
    description: "Vs. 90+ days average",
  },
  {
    icon: Shield,
    title: "Ethical Recruitment",
    stat: "Zero Fees",
    description: "For workers",
  },
  {
    icon: CheckCircle,
    title: "Quality Assurance",
    stat: "98%",
    description: "Satisfaction rate",
  },
  {
    icon: Globe,
    title: "Global Reach",
    stat: "30+",
    description: "Countries served",
  },
];

export default function ServicesPage() {
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
          <div className="absolute top-1/3 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              style={{ opacity }}
            >
              <motion.div variants={fadeInUp} className="mb-6">
                <Badge variant="premium" className="px-4 py-1.5 text-sm">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Our Services
                </Badge>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
              >
                Comprehensive{" "}
                <span className="text-accent">Recruitment Solutions</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-8"
              >
                From talent sourcing to deployment and beyond, we provide
                end-to-end recruitment services powered by technology.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row items-center gap-4"
              >
                <Link to="/register">
                  <Button variant="hero" size="xl">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="hero-secondary" size="xl">
                    Learn About Us
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative neon-box rounded-3xl overflow-hidden aspect-[4/3]">
                <img
                  src="legaforce-image.png"
                  alt="Comprehensive recruitment services"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement!.style.background =
                      "linear-gradient(135deg, hsl(201 100% 26%) 0%, hsl(26 74% 55%) 100%)";
                  }}
                />

                {/* Floating Service Icons */}
                {[
                  { icon: Sparkles, position: "top-6 left-6" },
                  { icon: Video, position: "top-6 right-6" },
                  { icon: FileCheck, position: "bottom-6 left-6" },
                  { icon: Headphones, position: "bottom-6 right-6" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className={`absolute ${item.position} glass-card p-3 rounded-xl backdrop-blur-md`}
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 5, 0],
                    }}
                    transition={{
                      duration: 3 + index,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <item.icon className="w-6 h-6 text-accent" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {valueProps.map((prop, index) => (
              <motion.div
                key={prop.title}
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
                  <prop.icon className="h-6 w-6" />
                </motion.div>
                <div className="text-2xl sm:text-3xl font-bold text-accent mb-1">
                  {prop.stat}
                </div>
                <div className="font-medium mb-1">{prop.title}</div>
                <div className="text-sm text-primary-foreground/60">
                  {prop.description}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Services with Images */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              Core Services
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need for Successful Recruitment
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive suite covers every aspect of international
              recruitment.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {coreServices.map((service, index) => (
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

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />

                  {/* Icon Badge */}
                  <motion.div
                    className="absolute top-4 right-4 flex items-center justify-center w-12 h-12 rounded-xl bg-accent/90 text-white backdrop-blur-sm"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <service.icon className="h-6 w-6" />
                  </motion.div>
                </div>

                <div className="p-6 lg:p-8">
                  <h3 className="text-xl font-semibold mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Visualization */}
      <section className="py-20 lg:py-32 bg-muted/30 relative overflow-hidden">
        {/* Animated Background */}
        <motion.div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03z' fill='%23005085' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
          animate={{
            x: [0, 60, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              <Target className="w-4 h-4 mr-2" />
              Our Process
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              From Inquiry to Deployment
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A streamlined, technology-driven process that ensures quality and
              speed.
            </p>
          </motion.div>

          {/* Process Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto mb-16"
          >
            <div className="relative rounded-3xl overflow-hidden neon-box aspect-[21/9]">
              <img
                src="/images/recruitment-process-flow.jpg"
                alt="End-to-end recruitment process visualization"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement!.style.background =
                    "linear-gradient(135deg, hsl(201 100% 26% / 0.1) 0%, hsl(26 74% 55% / 0.1) 100%)";
                }}
              />

              {/* Process Steps Overlay */}
              <div className="absolute inset-0 flex items-center justify-around p-8">
                {[
                  { label: "Inquiry", icon: Briefcase },
                  { label: "Matching", icon: Users },
                  { label: "Interview", icon: Video },
                  { label: "Deploy", icon: Globe },
                ].map((step, index) => (
                  <motion.div
                    key={step.label}
                    className="glass-card p-4 rounded-xl text-center backdrop-blur-md"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mx-auto mb-2">
                      <step.icon className="w-6 h-6 text-accent" />
                    </div>
                    <div className="font-semibold text-sm">{step.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Clock,
                value: "70%",
                label: "Faster than traditional",
              },
              {
                icon: TrendingUp,
                value: "98%",
                label: "Success rate",
              },
              {
                icon: Zap,
                value: "21 Days",
                label: "Average deployment",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="neon-box bg-card p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold text-accent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Animated Background */}
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
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-primary-foreground/70 mb-8">
              Whether you're looking for your next opportunity or seeking top
              talent, we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="premium" size="xl" className="min-w-[200px]">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
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
                    size="xl"
                    className="min-w-[200px] border-primary-foreground/20 text-white hover:bg-primary-foreground hover:text-primary"
                  >
                    About Legaforce
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
