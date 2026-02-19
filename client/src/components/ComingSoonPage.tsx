import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Rocket,
  ArrowLeft,
  Bell,
  Sparkles,
  Clock,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ComingSoonPageProps {
  /** Page title shown in the hero */
  title: string;
  /** Short description of what's coming */
  description?: string;
  /** Icon override — any lucide-react icon component */
  icon?: React.ElementType;
  /** Estimated release label, e.g. "Q2 2026" */
  eta?: string;
  /** Bullet-point feature previews */
  features?: string[];
  /** Route to navigate when hitting "Go Back" */
  backTo?: string;
  /** Label for back button */
  backLabel?: string;
}

const floatingAnimation = {
  animate: {
    y: [0, -12, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const pulseRing = {
  animate: {
    scale: [1, 1.15, 1],
    opacity: [0.4, 0.15, 0.4],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export default function ComingSoonPage({
  title,
  description = "We're working hard to bring this feature to life. Stay tuned for updates!",
  icon: Icon = Rocket,
  eta,
  features = [],
  backTo,
  backLabel = "Go Back",
}: ComingSoonPageProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="flex flex-col items-center justify-center min-h-[65vh] px-4 text-center"
    >
      {/* Floating icon with pulse ring */}
      <motion.div variants={fadeInUp} className="relative mb-8">
        {/* Outer pulse */}
        <motion.div
          variants={pulseRing}
          className="absolute inset-0 rounded-3xl bg-accent/20 blur-xl"
          style={{ width: "120%", height: "120%", left: "-10%", top: "-10%" }}
        />

        {/* Icon container */}
        <motion.div
          variants={floatingAnimation}
          animate="animate"
          className="relative z-10 w-24 h-24 rounded-3xl bg-gradient-to-br from-accent/20 via-accent/10 to-purple-500/10 border border-accent/20 flex items-center justify-center shadow-lg shadow-accent/10"
        >
          <Icon className="w-11 h-11 text-accent" strokeWidth={1.5} />
        </motion.div>

        {/* Sparkle accents */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-2 -right-2"
        >
          <Sparkles className="w-5 h-5 text-amber-400" />
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1 -left-3"
        >
          <Star className="w-4 h-4 text-accent/60" />
        </motion.div>
      </motion.div>

      {/* Badge */}
      <motion.div variants={fadeInUp}>
        <Badge
          variant="outline"
          className="mb-4 px-4 py-1.5 text-sm font-medium border-accent/30 bg-accent/5 text-accent"
        >
          <Clock className="w-3.5 h-3.5 mr-1.5" />
          Coming Soon{eta ? ` — ${eta}` : ""}
        </Badge>
      </motion.div>

      {/* Title */}
      <motion.h1
        variants={fadeInUp}
        className="text-3xl sm:text-4xl font-display font-bold mb-3 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text"
      >
        {title}
      </motion.h1>

      {/* Description */}
      <motion.p
        variants={fadeInUp}
        className="text-muted-foreground max-w-lg leading-relaxed mb-6"
      >
        {description}
      </motion.p>

      {/* Feature list */}
      {features.length > 0 && (
        <motion.div
          variants={fadeInUp}
          className="w-full max-w-md mb-8"
        >
          <div className="card-premium p-5 text-left">
            <p className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              What to expect
            </p>
            <ul className="space-y-2.5">
              {features.map((feature, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className="flex items-start gap-2.5 text-sm text-muted-foreground"
                >
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  {feature}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div variants={fadeInUp} className="flex gap-3">
        {backTo && (
          <Button
            variant="outline"
            onClick={() => navigate(backTo)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </Button>
        )}
        <Button
          className="gradient-bg-accent text-accent-foreground gap-2"
          onClick={() => {
            // In the future this could subscribe to notifications
            navigate(backTo || "/");
          }}
        >
          <Bell className="w-4 h-4" />
          Notify Me
        </Button>
      </motion.div>

      {/* Decorative bottom dots */}
      <motion.div
        variants={fadeInUp}
        className="flex gap-1.5 mt-10"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
            className="w-2 h-2 rounded-full bg-accent/40"
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
