"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import { easeOut, viewportOnce } from "@/lib/motion";

interface RevealProps extends HTMLMotionProps<"div"> {
  /** Stagger index, multiplied by 80ms. */
  index?: number;
  /** Start offset in px. */
  y?: number;
  delay?: number;
}

/** Fades and lifts children into view once. Respects reduced motion. */
export function Reveal({ index = 0, y = 24, delay = 0, children, ...rest }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.7, ease: easeOut, delay: delay + index * 0.08 }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
