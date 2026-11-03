"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface FlowStage {
  title: string;
  caption?: string;
  items?: string[];
  tone?: "accent" | "violet" | "neutral";
  icon?: ReactNode;
}

interface FlowDiagramProps {
  stages: FlowStage[];
  /**
   * `vertical`: stacked cards joined by a connector with a travelling pulse.
   * `horizontal`: numbered steps in a responsive grid (1 → 2 → 3 columns) with
   * arrows, which never overflows a narrow column.
   */
  direction?: "vertical" | "horizontal";
  className?: string;
  label: string;
}

const toneRing: Record<NonNullable<FlowStage["tone"]>, string> = {
  accent: "border-accent/30 shadow-[0_0_30px_-12px_var(--glow)]",
  violet: "border-accent-2/30 shadow-[0_0_30px_-12px_var(--glow-2)]",
  neutral: "border-border",
};

const toneText: Record<NonNullable<FlowStage["tone"]>, string> = {
  accent: "text-accent",
  violet: "text-accent-2",
  neutral: "text-muted",
};

export function FlowDiagram({ stages, direction = "vertical", className, label }: FlowDiagramProps) {
  const reduce = useReducedMotion();

  if (direction === "horizontal") {
    return (
      <ol aria-label={label} className={cn("grid gap-3 sm:grid-cols-2 md:grid-cols-3", className)}>
        {stages.map((stage, i) => {
          const tone = stage.tone ?? "neutral";
          const last = i === stages.length - 1;
          return (
            <motion.li
              key={stage.title}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={cn("relative overflow-hidden rounded-2xl border bg-surface/80 p-4 backdrop-blur", toneRing[tone])}
            >
              {/* travelling pulse along the top edge */}
              {!reduce && (
                <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden">
                  <span
                    style={{ animationDelay: `${i * 0.4}s` }}
                    className="absolute left-0 top-0 h-px w-1/4 bg-gradient-to-r from-transparent via-accent to-transparent animate-[flow-x_2.4s_ease-in-out_infinite]"
                  />
                </span>
              )}
              <div className="flex items-start justify-between gap-2">
                <span className={cn("font-mono text-[10px] tracking-[0.18em]", toneText[tone])}>
                  STEP {String(i + 1).padStart(2, "0")}
                </span>
                {!last && <ArrowRight className="size-3.5 text-muted-2" aria-hidden />}
              </div>
              <div className="mt-3 flex items-center gap-2">
                {stage.icon && <span className={cn("shrink-0", toneText[tone])}>{stage.icon}</span>}
                <p className="text-sm font-semibold text-fg">{stage.title}</p>
              </div>
              {stage.caption && (
                <p className={cn("mt-1 font-mono text-[10px] uppercase tracking-[0.16em]", toneText[tone])}>{stage.caption}</p>
              )}
            </motion.li>
          );
        })}
      </ol>
    );
  }

  return (
    <div role="img" aria-label={label} className={cn("flex flex-col", className)}>
      {stages.map((stage, i) => {
        const tone = stage.tone ?? "neutral";
        const last = i === stages.length - 1;
        return (
          <div key={stage.title} className="flex flex-col">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className={cn("relative rounded-2xl border bg-surface/80 p-4 backdrop-blur", toneRing[tone])}
            >
              <div className="flex items-center gap-2">
                {stage.icon && <span className={cn("shrink-0", toneText[tone])}>{stage.icon}</span>}
                <p className="text-sm font-semibold text-fg">{stage.title}</p>
              </div>
              {stage.caption && (
                <p className={cn("mt-1 font-mono text-[10px] uppercase tracking-[0.16em]", toneText[tone])}>{stage.caption}</p>
              )}
              {stage.items && (
                <ul className="mt-3 space-y-1.5">
                  {stage.items.map((it) => (
                    <li key={it} className="flex gap-2 text-xs leading-relaxed text-muted">
                      <span aria-hidden className="mt-[0.45rem] size-1 shrink-0 rounded-full bg-muted-2" />
                      {it}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>

            {!last && (
              <div aria-hidden className="relative h-8 w-px self-center overflow-hidden">
                <span className="absolute inset-y-0 left-0 w-px bg-border" />
                {!reduce && (
                  <span
                    style={{ animationDelay: `${i * 0.5}s` }}
                    className="absolute left-1/2 top-0 h-3 w-[3px] -translate-x-1/2 rounded-full bg-accent shadow-[0_0_10px_var(--glow)] animate-[flow-y_2.4s_ease-in-out_infinite]"
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
