import { motion, useScroll, useTransform } from "framer-motion";
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
  TrendingUp,
  Sparkles,
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

const values = [
  {
    icon: Heart,
    title: "Worker-First",
    description:
      "Every decision we make prioritizes the welfare and success of Filipino workers abroad.",
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    icon: Shield,
    title: "Integrity",
    description:
      "We operate with complete transparency and ethical practices in all our dealings.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We leverage technology to create better experiences for workers and employers.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Handshake,
    title: "Partnership",
    description:
      "We build lasting relationships based on trust, respect, and mutual success.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
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
    name: "Maria dela Cruz",
    role: "CEO & Founder",
    bio: "20+ years in international recruitment and labor advocacy.",
    initials: "MC",
  },
  {
    name: "Roberto Santos",
    role: "Chief Operations Officer",
    bio: "Former POEA official with expertise in deployment processes.",
    initials: "RS",
  },
  {
    name: "Jennifer Tan",
    role: "Chief Technology Officer",
    bio: "Tech leader driving innovation in recruitment technology.",
    initials: "JT",
  },
];

export default function AboutPage() {
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
        className="relative min-h-[100vh] flex items-center bg-gradient-to-br from-accent/5 via-background to-primary/5"
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
                className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-8"
              >
                We're on a mission to transform overseas employment by putting
                workers first, leveraging technology, and building a more
                transparent recruitment industry.
              </motion.p>
            </motion.div>

            {/* Hero Image - Company Story */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative neon-box rounded-3xl overflow-hidden aspect-[4/3]">
                <img
                  src="/images/about/legaforce-team.jpg"
                  alt="Legaforce team empowering Filipino workers"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement!.style.background =
                      "linear-gradient(135deg, hsl(201 100% 26%) 0%, hsl(26 74% 55%) 100%)";
                  }}
                />

                {/* Floating Achievement Badges */}
                <motion.div
                  className="absolute top-6 right-6 glass-card p-4 rounded-xl backdrop-blur-md"
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
                      <Award className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <div className="text-xl font-bold">ISO 9001</div>
                      <div className="text-xs text-muted-foreground">
                        Certified
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Decorative Globe Animation */}
              <motion.div
                className="absolute -bottom-6 -right-6 w-32 h-32"
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 50,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <div className="w-full h-full rounded-full bg-gradient-to-br from-accent/20 to-primary/20 backdrop-blur-sm flex items-center justify-center">
                  <Globe className="w-16 h-16 text-accent" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision with Images */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative group"
            >
              {/* Mission Image */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-10 group-hover:opacity-20 transition-opacity">
                <img
                  src="/images/about/mission.jpg"
                  alt="Our mission"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="relative p-8 rounded-2xl border border-border bg-card min-h-[300px] flex flex-col justify-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent/10 text-accent mb-6">
                  <Target className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To be the most trusted and worker-centric overseas recruitment
                  agency in the Philippines, connecting skilled Filipino workers
                  with global opportunities while ensuring their rights,
                  welfare, and dignity are protected at every step.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative group"
            >
              {/* Vision Image */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-10 group-hover:opacity-20 transition-opacity">
                <img
                  src="/images/about/vision.jpg"
                  alt="Our vision"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="relative p-8 rounded-2xl border border-border bg-card min-h-[300px] flex flex-col justify-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-6">
                  <Globe className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To revolutionize the overseas employment industry through
                  technology and ethical practices, making international careers
                  accessible, transparent, and rewarding for every Filipino
                  worker who dreams of working abroad.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values with Modern Design */}
      <section className="py-20 lg:py-32 bg-muted/50 relative overflow-hidden">
        {/* Animated Background */}
        <motion.div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--accent)) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
          animate={{
            backgroundPosition: ["0px 0px", "40px 40px"],
          }}
          transition={{
            duration: 20,
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
                className="group relative"
              >
                {/* Glow Effect */}
                <div
                  className={`absolute inset-0 ${value.bg} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity`}
                />

                <div className="relative p-6 rounded-2xl border border-border bg-card text-center hover:border-accent/30 transition-all">
                  <motion.div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${value.bg} ${value.color} mb-4 group-hover:scale-110 transition-transform`}
                    whileHover={{ rotate: 10 }}
                  >
                    <value.icon className="h-6 w-6" />
                  </motion.div>
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline with Enhanced Design */}
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
                className="flex gap-6 mb-8 last:mb-0 group"
              >
                <div className="flex-shrink-0 w-20 text-right">
                  <motion.span
                    className="font-bold text-accent"
                    whileHover={{ scale: 1.1 }}
                  >
                    {milestone.year}
                  </motion.span>
                </div>
                <div className="flex-shrink-0 relative">
                  <motion.div
                    className="w-4 h-4 rounded-full bg-accent mt-1 group-hover:scale-125 transition-transform"
                    whileHover={{ boxShadow: "0 0 20px hsl(var(--accent))" }}
                  />
                  {index < milestones.length - 1 && (
                    <div className="absolute top-5 left-1.5 w-0.5 h-16 bg-border group-hover:bg-accent/50 transition-colors" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="font-semibold mb-1 group-hover:text-accent transition-colors">
                    {milestone.title}
                  </h3>
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
      <section className="py-20 lg:py-32 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Animated Background */}
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
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

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
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
                whileHover={{ scale: 1.05 }}
              >
                <Badge
                  variant="outline"
                  className="px-4 py-2 text-sm border-primary-foreground/20 text-primary-foreground hover:bg-accent/20 transition-colors cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {item}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership with Images */}
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
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Led by experienced professionals committed to transforming
              recruitment.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {leadership.map((person, index) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="relative p-6 rounded-2xl border border-border bg-card text-center hover:border-accent/30 transition-all hover:shadow-xl">
                  {/* Profile Image Placeholder */}
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-accent/20 group-hover:border-accent/40 transition-colors">
                      <img
                        src={`/images/team/${person.name.toLowerCase().replace(/\s+/g, "-")}.jpg`}
                        alt={person.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const parent = e.currentTarget.parentElement!;
                          parent.className +=
                            " bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold text-2xl";
                          parent.textContent = person.initials;
                        }}
                      />
                    </div>

                    {/* Online Status Indicator */}
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-success rounded-full border-4 border-card" />
                  </div>

                  <h3 className="font-semibold mb-1">{person.name}</h3>
                  <p className="text-sm text-accent mb-2">{person.role}</p>
                  <p className="text-sm text-muted-foreground">{person.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Showcase */}
      <section className="py-20 lg:py-32 bg-muted/30 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              <TrendingUp className="w-4 h-4 mr-2" />
              Our Impact
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Making a Difference
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "50,000+", label: "Workers Deployed", icon: Users },
              { value: "500+", label: "Partner Companies", icon: Handshake },
              { value: "30+", label: "Countries", icon: Globe },
              { value: "98%", label: "Success Rate", icon: TrendingUp },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="neon-box bg-card p-6 text-center group cursor-pointer"
              >
                <motion.div
                  className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
                  whileHover={{ rotate: 10 }}
                >
                  <stat.icon className="w-6 h-6" />
                </motion.div>
                <motion.div
                  className="text-3xl font-bold mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact with Modern Layout */}
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
              <motion.div
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl border border-border bg-card hover:border-accent/30 transition-all"
              >
                <MapPin className="h-6 w-6 text-accent mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Address</h3>
                <p className="text-sm text-muted-foreground">Philippines</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl border border-border bg-card hover:border-accent/30 transition-all"
              >
                <Mail className="h-6 w-6 text-accent mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Email</h3>
                <p className="text-sm text-muted-foreground">
                  info@legaforce.com
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl border border-border bg-card hover:border-accent/30 transition-all"
              >
                <Phone className="h-6 w-6 text-accent mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Phone</h3>
                <p className="text-sm text-muted-foreground">+63 2 1234 5678</p>
              </motion.div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="premium" size="xl">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/services">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="outline" size="xl">
                    View Services
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
