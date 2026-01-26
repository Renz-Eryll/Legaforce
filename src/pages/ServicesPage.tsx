import { motion } from "framer-motion";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    description: "Generate professional CVs instantly with our advanced AI technology.",
    features: ["Multiple templates", "Industry optimization", "Multi-language support"],
  },
  {
    icon: Users,
    title: "Candidate Matching",
    description: "Intelligent matching connects right candidates with right opportunities.",
    features: ["Skills-based matching", "Experience verification", "Real-time updates"],
  },
  {
    icon: Video,
    title: "Video Interview Platform",
    description: "Conduct seamless remote interviews with our integrated platform.",
    features: ["One-click scheduling", "HD video quality", "Collaborative scoring"],
  },
  {
    icon: FileCheck,
    title: "Document Processing",
    description: "We handle all documentation from visa applications to medical clearances.",
    features: ["Visa processing", "Medical examinations", "Background verification"],
  },
  {
    icon: GraduationCap,
    title: "Pre-Departure Training",
    description: "Comprehensive training programs prepare workers for their new roles.",
    features: ["Language courses", "Cultural orientation", "Job-specific training"],
  },
  {
    icon: Headphones,
    title: "24/7 Worker Support",
    description: "Round-the-clock assistance including emergency support and advocacy.",
    features: ["Hotline support", "Emergency assistance", "Legal advocacy"],
  },
];

const valueProps = [
  { icon: Clock, title: "Faster Deployment", stat: "21-30 Days", description: "Vs. 90+ days average" },
  { icon: Shield, title: "Ethical Recruitment", stat: "Zero Fees", description: "For workers" },
  { icon: CheckCircle, title: "Quality Assurance", stat: "98%", description: "Satisfaction rate" },
  { icon: Globe, title: "Global Reach", stat: "30+", description: "Countries served" },
];

export default function ServicesPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <motion.div initial="initial" animate="animate" variants={staggerContainer} className="max-w-4xl mx-auto text-center">
            <motion.div variants={fadeInUp} className="mb-6">
              <Badge variant="premium" className="px-4 py-1.5 text-sm">
                <Briefcase className="w-4 h-4 mr-2" />
                Our Services
              </Badge>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Comprehensive <span className="text-accent">Recruitment Solutions</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              From talent sourcing to deployment and beyond, we provide end-to-end recruitment services powered by technology.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button variant="hero" size="xl">Get Started<ArrowRight className="ml-2 h-5 w-5" /></Button>
              </Link>
              <Link to="/about">
                <Button variant="hero-secondary" size="xl">Learn About Us</Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {valueProps.map((prop, index) => (
              <motion.div key={prop.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/20 text-accent mb-4">
                  <prop.icon className="h-6 w-6" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-accent mb-1">{prop.stat}</div>
                <div className="font-medium mb-1">{prop.title}</div>
                <div className="text-sm text-primary-foreground/60">{prop.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Services */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Core Services</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything You Need for Successful Recruitment</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Our comprehensive suite covers every aspect of international recruitment.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {coreServices.map((service, index) => (
              <motion.div key={service.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="group p-6 lg:p-8 rounded-2xl border border-border bg-card hover:shadow-xl hover:border-accent/30 transition-all duration-300">
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-accent/10 text-accent mb-4 group-hover:scale-110 transition-transform">
                  <service.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />{feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-primary-foreground/70 mb-8">Whether you're looking for your next opportunity or seeking top talent, we're here to help.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button variant="premium" size="xl" className="min-w-[200px]">Get Started<ArrowRight className="ml-2 h-5 w-5" /></Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="xl" className="min-w-[200px] border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary">About Legaforce</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
