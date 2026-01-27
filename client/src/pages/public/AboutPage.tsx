import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Shield,
  Heart,
  Globe,
  Award,
  CheckCircle,
  Users,
  Target,
  Lightbulb,
  Handshake,
  MapPin,
  Mail,
  Phone,
  FileText,
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

const values = [
  {
    icon: Heart,
    title: "Worker-First",
    description:
      "Every decision we make prioritizes the welfare and success of Filipino workers abroad.",
  },
  {
    icon: Shield,
    title: "Integrity",
    description:
      "We operate with complete transparency and ethical practices in all our dealings.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We leverage technology to create better experiences for workers and employers.",
  },
  {
    icon: Handshake,
    title: "Partnership",
    description:
      "We build lasting relationships based on trust, respect, and mutual success.",
  },
];

const milestones = [
  {
    year: "2018",
    title: "Founded",
    description:
      "Legaforce was established with a mission to transform overseas recruitment.",
  },
  {
    year: "2019",
    title: "POEA License",
    description:
      "Received official license from the Philippine Overseas Employment Administration.",
  },
  {
    year: "2020",
    title: "Digital Platform",
    description:
      "Launched our AI-powered recruitment platform during the pandemic.",
  },
  {
    year: "2021",
    title: "10,000 Workers",
    description: "Deployed our 10,000th worker to employers worldwide.",
  },
  {
    year: "2022",
    title: "ISO Certified",
    description:
      "Achieved ISO 9001 certification for quality management systems.",
  },
  {
    year: "2023",
    title: "50,000 Workers",
    description: "Reached milestone of 50,000+ successfully deployed workers.",
  },
];

const accreditations = [
  "POEA Licensed Agency",
  "ISO 9001:2015 Certified",
  "DMW Accredited",
  "OWWA Partner Agency",
  "IOM Member",
  "PJSFA Member",
];

const leadership = [
  {
    name: "Name",
    role: "CEO & Founder",
    bio: "20+ years in international recruitment and labor advocacy.",
  },
  {
    name: "Name",
    role: "Chief Operations Officer",
    bio: "Former POEA official with expertise in deployment processes.",
  },
  {
    name: "Name",
    role: "Chief Technology Officer",
    bio: "Tech leader driving innovation in recruitment technology.",
  },
];

export default function AboutPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center bg-gradient-to-br from-accent/5 via-background to-primary/5">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
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
                <FileText className="w-4 h-4 mr-2" />
                About Us
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
            >
              Empowering Filipino Workers{" "}
              <span className="text-accent">Globally</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            >
              We're on a mission to transform overseas employment by putting
              workers first, leveraging technology, and building a more
              transparent recruitment industry.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl border border-border bg-card"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent/10 text-accent mb-6">
                <Target className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To be the most trusted and worker-centric overseas recruitment
                agency in the Philippines, connecting skilled Filipino workers
                with global opportunities while ensuring their rights, welfare,
                and dignity are protected at every step.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl border border-border bg-card"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-6">
                <Globe className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                To revolutionize the overseas employment industry through
                technology and ethical practices, making international careers
                accessible, transparent, and rewarding for every Filipino worker
                who dreams of working abroad.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              Our Values
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What We Stand For
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl border border-border bg-card text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 text-accent mb-4">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              Our Journey
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Milestones</h2>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6 mb-8 last:mb-0"
              >
                <div className="flex-shrink-0 w-20 text-right">
                  <span className="font-bold text-accent">
                    {milestone.year}
                  </span>
                </div>
                <div className="flex-shrink-0 relative">
                  <div className="w-4 h-4 rounded-full bg-accent mt-1" />
                  {index < milestones.length - 1 && (
                    <div className="absolute top-5 left-1.5 w-0.5 h-16 bg-border" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="font-semibold mb-1">{milestone.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {milestone.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Accreditations */}
      <section className="py-20 lg:py-32 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge
              variant="secondary"
              className="mb-4 bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20"
            >
              <Award className="w-4 h-4 mr-2" />
              Accreditations
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Trusted & Certified
            </h2>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {accreditations.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Badge
                  variant="outline"
                  className="px-4 py-2 text-sm border-primary-foreground/20 text-primary-foreground"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {item}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              Leadership
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Team</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {leadership.map((person, index) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl border border-border bg-card text-center"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-primary mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white">
                  {person.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h3 className="font-semibold">{person.name}</h3>
                <p className="text-sm text-accent mb-2">{person.role}</p>
                <p className="text-sm text-muted-foreground">{person.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <Badge variant="secondary" className="mb-4">
              Contact Us
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-8">
              Get in Touch
            </h2>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 rounded-2xl border border-border bg-card">
                <MapPin className="h-6 w-6 text-accent mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Address</h3>
                <p className="text-sm text-muted-foreground">Philippines</p>
              </div>
              <div className="p-6 rounded-2xl border border-border bg-card">
                <Mail className="h-6 w-6 text-accent mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Email</h3>
                <p className="text-sm text-muted-foreground">
                  info@legaforce.com
                </p>
              </div>
              <div className="p-6 rounded-2xl border border-border bg-card">
                <Phone className="h-6 w-6 text-accent mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Phone</h3>
                <p className="text-sm text-muted-foreground">+63 2 1234 5678</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button variant="premium" size="xl">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="xl">
                  View Services
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
