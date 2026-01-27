import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Shield,
  Sparkles,
  Globe,
  Award,
  CheckCircle,
  Briefcase,
  FileText,
  Users,
  Clock,
  TrendingUp,
  Heart,
  MapPin,
  DollarSign,
  GraduationCap,
  Zap,
  Target,
  Star,
  Search,
  Video,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRef } from "react";

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

// Job categories with brand-themed gradients
const jobCategories = [
  {
    icon: Heart,
    title: "Healthcare",
    description: "Nurses, Caregivers, Medical Technicians",
    jobs: "2,500+ openings",
    gradient: "from-red-500/10 to-pink-500/10",
    iconBg: "bg-red-500/10",
    iconColor: "text-red-600 dark:text-red-400",
    image: "/images/applicants/healthcare-jobs.jpg",
  },
  {
    icon: Briefcase,
    title: "Engineering",
    description: "Civil, Mechanical, Electrical Engineers",
    jobs: "1,200+ openings",
    gradient: "from-primary/10 to-blue-500/10",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    image: "/images/applicants/engineering-jobs.jpg",
  },
  {
    icon: Users,
    title: "Hospitality",
    description: "Hotel Staff, Chefs, Restaurant Crew",
    jobs: "3,000+ openings",
    gradient: "from-accent/10 to-orange-500/10",
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
    image: "/images/applicants/hospitality-jobs.jpg",
  },
  {
    icon: GraduationCap,
    title: "Education",
    description: "Teachers, Tutors, Trainers",
    jobs: "800+ openings",
    gradient: "from-purple-500/10 to-indigo-500/10",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-600 dark:text-purple-400",
    image: "/images/applicants/education-jobs.jpg",
  },
  {
    icon: Globe,
    title: "IT & Technology",
    description: "Developers, Support, Technicians",
    jobs: "1,500+ openings",
    gradient: "from-cyan-500/10 to-blue-500/10",
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    image: "/images/applicants/tech-jobs.jpg",
  },
  {
    icon: TrendingUp,
    title: "Skilled Trades",
    description: "Welders, Electricians, Plumbers",
    jobs: "2,000+ openings",
    gradient: "from-green-500/10 to-emerald-500/10",
    iconBg: "bg-green-500/10",
    iconColor: "text-green-600 dark:text-green-400",
    image: "/images/applicants/trades-jobs.jpg",
  },
];

// Benefits with modern styling
const benefits = [
  {
    icon: DollarSign,
    title: "Zero Placement Fees",
    description:
      "We follow ethical recruitment practices. You'll never pay excessive fees to find work abroad.",
    gradient: "from-green-500/5 to-emerald-500/5",
  },
  {
    icon: Shield,
    title: "Worker Protection",
    description:
      "24/7 support hotline, anonymous reporting system, and advocacy for your rights.",
    gradient: "from-primary/5 to-blue-500/5",
  },
  {
    icon: Sparkles,
    title: "AI-Powered CV Builder",
    description:
      "Create a professional, internationally-formatted CV in minutes with our smart AI tool.",
    gradient: "from-accent/5 to-yellow-500/5",
  },
  {
    icon: Clock,
    title: "Fast Deployment",
    description:
      "Our streamlined process gets you deployed in 21-30 days, not the usual 90+ days.",
    gradient: "from-orange-500/5 to-red-500/5",
  },
  {
    icon: FileText,
    title: "Real-Time Tracking",
    description:
      "Track every step of your application from submission to deployment online.",
    gradient: "from-purple-500/5 to-pink-500/5",
  },
  {
    icon: Award,
    title: "Rewards Program",
    description:
      "Earn points for completing milestones and redeem them for priority processing.",
    gradient: "from-accent/5 to-orange-500/5",
  },
];

// Destination countries
const destinations = [
  {
    name: "Saudi Arabia",
    flag: "🇸🇦",
    jobs: "5,000+",
    color: "from-green-500/10 to-emerald-500/10",
  },
  {
    name: "UAE",
    flag: "🇦🇪",
    jobs: "3,500+",
    color: "from-red-500/10 to-green-500/10",
  },
  {
    name: "Qatar",
    flag: "🇶🇦",
    jobs: "2,000+",
    color: "from-red-500/10 to-purple-500/10",
  },
  {
    name: "Singapore",
    flag: "🇸🇬",
    jobs: "1,800+",
    color: "from-red-500/10 to-white/5",
  },
  {
    name: "Japan",
    flag: "🇯🇵",
    jobs: "1,500+",
    color: "from-red-500/10 to-white/5",
  },
  {
    name: "Canada",
    flag: "🇨🇦",
    jobs: "1,200+",
    color: "from-red-500/10 to-white/5",
  },
  {
    name: "Germany",
    flag: "🇩🇪",
    jobs: "900+",
    color: "from-black/5 to-red-500/10",
  },
  {
    name: "Australia",
    flag: "🇦🇺",
    jobs: "800+",
    color: "from-blue-500/10 to-white/5",
  },
];

// Steps to get started
const steps = [
  {
    number: "01",
    title: "Create Your Account",
    description:
      "Sign up for free and complete your profile with personal and professional information.",
    icon: Users,
  },
  {
    number: "02",
    title: "Build Your CV",
    description:
      "Use our AI-powered CV builder to create a professional, internationally-formatted resume.",
    icon: FileText,
  },
  {
    number: "03",
    title: "Browse Opportunities",
    description:
      "Explore thousands of verified job openings from employers around the world.",
    icon: Search,
  },
  {
    number: "04",
    title: "Apply & Interview",
    description:
      "Submit applications with one click and complete video interviews from home.",
    icon: Video,
  },
  {
    number: "05",
    title: "Get Deployed",
    description:
      "Complete documentation with our guidance and start your international career.",
    icon: Rocket,
  },
];

// Success stories
const successStories = [
  {
    name: "Maria Santos",
    role: "Nurse in Saudi Arabia",
    quote:
      "From application to deployment in just 25 days! The AI CV builder helped me stand out.",
    avatar: "MS",
    flag: "🇸🇦",
  },
  {
    name: "Jose Cruz",
    role: "Engineer in UAE",
    quote:
      "Zero fees and full transparency. Legaforce truly puts workers first.",
    avatar: "JC",
    flag: "🇦🇪",
  },
  {
    name: "Anna Reyes",
    role: "Hotel Manager in Qatar",
    quote:
      "The support team was available 24/7. I always felt supported throughout the process.",
    avatar: "AR",
    flag: "🇶🇦",
  },
];

export default function ForApplicantsPage() {
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
        className="relative min-h-[100vh] flex items-center justify-center hero-pattern particle-bg"
      >
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
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
          <motion.div
            className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
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
                <Badge className="px-4 py-2 bg-gradient-to-r from-accent/10 to-primary/10 text-foreground border-accent/20 font-medium">
                  <Users className="w-4 h-4 mr-2 text-accent" />
                  For Job Seekers
                </Badge>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6"
              >
                Find Your Dream Job{" "}
                <span className="gradient-text">Abroad</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed"
              >
                Access 10,000+ verified job openings worldwide. Get deployed in{" "}
                <span className="font-semibold text-accent">21-30 days</span>{" "}
                with zero placement fees.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 mb-8 justify-center"
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
                      Start Free
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
                      Browse Jobs
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-6 items-center justify-center"
              >
                {[
                  { icon: Users, value: "50K+", label: "Workers Deployed" },
                  { icon: Globe, value: "30+", label: "Countries" },
                  { icon: TrendingUp, value: "98%", label: "Success Rate" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-lg font-bold">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Job Categories with Images */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-muted/50 via-background to-muted/30" />

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              <Briefcase className="w-4 h-4 mr-2" />
              Job Categories
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              Explore <span className="gradient-text">10,000+ Jobs</span> Across
              Industries
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find opportunities in your field with verified employers
              worldwide.
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
                className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:shadow-2xl hover:border-accent/30 transition-all duration-300"
              >
                {/* Category Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.parentElement!.style.background = `linear-gradient(135deg, ${category.gradient})`;
                    }}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />

                  {/* Icon Badge */}
                  <motion.div
                    className={`absolute top-4 right-4 w-12 h-12 rounded-xl ${category.iconBg} ${category.iconColor} backdrop-blur-sm flex items-center justify-center`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <category.icon className="h-6 w-6" />
                  </motion.div>

                  {/* Job Count Badge */}
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-accent/90 text-white backdrop-blur-sm">
                      {category.jobs}
                    </Badge>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-display font-semibold mb-2">
                    {category.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {category.description}
                  </p>

                  <Link to="/register">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="group/btn text-accent hover:text-accent hover:bg-accent/5 w-full"
                    >
                      Browse Jobs
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/3 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 20,
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
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              <Award className="w-4 h-4 mr-2" />
              Why Choose Us
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              Benefits for <span className="gradient-text">Applicants</span>
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
                className="group relative"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-accent/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />

                <div className="relative neon-box bg-card p-6 rounded-2xl hover:shadow-xl transition-all duration-300">
                  <div className="flex gap-4">
                    <motion.div
                      className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform"
                      whileHover={{ rotate: 5 }}
                    >
                      <benefit.icon className="h-6 w-6" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="py-20 lg:py-32 bg-muted/30">
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
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              Work in <span className="gradient-text">30+ Countries</span>
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
                whileHover={{
                  y: -8,
                  transition: { duration: 0.2 },
                }}
                className="neon-box bg-card p-6 rounded-2xl text-center group cursor-pointer"
              >
                <motion.span
                  className="text-5xl mb-4 block"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {destination.flag}
                </motion.span>
                <h3 className="font-semibold mb-1">{destination.name}</h3>
                <p className="text-sm text-accent font-medium">
                  {destination.jobs} jobs
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 lg:py-32">
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
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              Real Stories from{" "}
              <span className="gradient-text">Real People</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {successStories.map((story, index) => (
              <motion.div
                key={story.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="neon-box bg-card p-6 rounded-2xl"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full gradient-bg text-white font-semibold flex items-center justify-center">
                    {story.avatar}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{story.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {story.role}
                    </p>
                  </div>
                  <span className="text-2xl">{story.flag}</span>
                </div>
                <p className="text-muted-foreground italic">"{story.quote}"</p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Get Started Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg" />

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-white/10 text-white border-white/20">
              <Clock className="w-4 h-4 mr-2" />
              Getting Started
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              5 Simple Steps to Your Dream Job
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
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
                className="flex gap-6 mb-8 last:mb-0 group"
              >
                <motion.div
                  className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-accent text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform"
                  whileHover={{ rotate: 5 }}
                >
                  {step.number}
                </motion.div>
                <div className="flex-1 pt-3">
                  <div className="flex items-center gap-3 mb-2">
                    <step.icon className="h-6 w-6 text-accent" />
                    <h3 className="text-xl font-display font-semibold text-white">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-white/70">{step.description}</p>
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
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
              Ready to Start Your{" "}
              <span className="gradient-text">Global Career?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Create your free account today and take the first step towards
              your dream job abroad. No fees, no hidden costs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="h-14 px-10 gradient-bg-accent text-white font-semibold shadow-lg glow-accent"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/services">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="outline" size="lg" className="h-14 px-10">
                    Learn More
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
