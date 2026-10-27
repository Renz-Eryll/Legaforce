import { motion, type HTMLMotionProps } from "framer-motion";

interface RevealProps extends HTMLMotionProps<"div"> {
  delay?: number;
  /** Animate on mount instead of on scroll (for above-the-fold content) */
  immediate?: boolean;
}

/** Fades content up once as it scrolls into view. */
export function Reveal({ delay = 0, immediate = false, children, ...rest }: RevealProps) {
  const visible = { opacity: 1, y: 0 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      {...(immediate ? { animate: visible } : { whileInView: visible, viewport: { once: true, margin: "-60px" } })}
      transition={{ duration: 0.45, delay, ease: [0.2, 0.7, 0.2, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
