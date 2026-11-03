"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { profile } from "@/content/profile";

/**
 * Short intro curtain: the name resolves letter by letter, then the curtain
 * lifts. Total time well under a second so it never feels like a loading screen.
 * Skipped for reduced-motion users.
 */
export function Preloader() {
  const reduce = useReducedMotion();
  const [timedOut, setTimedOut] = useState(false);
  const done = reduce || timedOut;

  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 850);
    return () => clearTimeout(t);
  }, []);

  const letters = profile.name.split("");

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg"
          exit={{ y: "-100%", transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }}
          aria-hidden
        >
          <div className="flex items-center gap-[0.04em] font-mono text-2xl tracking-[0.3em] text-fg sm:text-3xl">
            {letters.map((ch, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.08 + i * 0.035, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={ch === " " ? "w-[0.5em]" : undefined}
              >
                {ch === " " ? " " : ch.toUpperCase()}
              </motion.span>
            ))}
            <motion.span
              className="ml-1 inline-block h-[1em] w-[0.08em] bg-accent"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
