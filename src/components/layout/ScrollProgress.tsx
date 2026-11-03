"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

/** Thin reading-progress bar along the top edge. */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX: reduce ? scrollYProgress : scaleX, transformOrigin: "0 50%" }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-[2px] bg-gradient-to-r from-accent to-accent-2"
    />
  );
}
