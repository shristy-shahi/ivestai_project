"use client";
import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  direction?: "up" | "left" | "right" | "scale";
  delay?: number;
  style?: React.CSSProperties;
  className?: string;
}

export default function RevealOnScroll({ children, direction = "up", delay = 0, style, className }: Props) {
  const getVariants = () => {
    switch (direction) {
      case "up": return { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };
      case "left": return { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } };
      case "right": return { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } };
      case "scale": return { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1 } };
      default: return { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay, type: "spring", bounce: 0.2 }}
      variants={getVariants()}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  );
}
