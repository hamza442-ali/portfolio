"use client";

import { motion, useReducedMotion } from "motion/react";
import { MapPin } from "lucide-react";
import { useState } from "react";
import { careerStart, experience } from "@/content/experience";
import { viewportOnce } from "@/lib/motion";
import { cn, currentIsoMonth, formatMonth, monthsBetween } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { TechIcon } from "@/components/ui/TechIcon";

/**
 * Overlap chart + role cards that highlight each other on hover/focus, so the
 * overlapping roles are visually honest and easy to read.
 */
export function ExperienceTimeline() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);

  const now = currentIsoMonth();
  const end = experience.reduce((max, e) => {
    const v = e.end ?? now;
    return v > max ? v : max;
  }, careerStart);
  const total = monthsBetween(careerStart, end) + 1;
  const firstYear = Number(careerStart.slice(0, 4)) + 1;
  const lastYear = Number(end.slice(0, 4));
  const ticks: { year: number; pct: number }[] = [];
  for (let y = firstYear; y <= lastYear; y++) ticks.push({ year: y, pct: (monthsBetween(careerStart, `${y}-01`) / total) * 100 });

  const roles = [...experience].sort((a, b) => (a.start < b.start ? 1 : -1));

  return (
    <div onMouseLeave={() => setActive(null)}>
      {/* Chart */}
      <Reveal>
        <figure className="tile">
          <figcaption className="mb-5 flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
            <span>Role overlap, {formatMonth(careerStart)} → {formatMonth(end)}</span>
            <span className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-4 rounded-full bg-accent" /> Full-time
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-4 rounded-full bg-accent-2" /> Part-time
              </span>
            </span>
          </figcaption>
          <div className="grid grid-cols-[6.5rem_1fr] gap-x-4 sm:grid-cols-[8rem_1fr]">
            {experience.map((e, i) => {
              const left = (monthsBetween(careerStart, e.start) / total) * 100;
              const width = (monthsBetween(e.start, e.end ?? now) / total) * 100;
              const full = e.employmentType === "Full-time";
              const dim = active !== null && active !== e.id;
              return (
                <div key={e.id} className={cn("contents", dim && "opacity-40")}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(e.id)}
                    onFocus={() => setActive(e.id)}
                    onClick={() => document.getElementById(`role-${e.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" })}
                    className={cn("truncate py-2 text-left text-sm transition-opacity", dim ? "text-muted" : "text-fg")}
                  >
                    {e.company}
                  </button>
                  <div className="relative py-2" onMouseEnter={() => setActive(e.id)}>
                    <div className="h-2.5 rounded-full bg-white/[0.04]" />
                    <motion.div
                      initial={reduce ? false : { scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={viewportOnce}
                      transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                      style={{ left: `${left}%`, width: `${width}%`, transformOrigin: "left" }}
                      className={cn(
                        "absolute top-2 h-2.5 rounded-full transition-opacity",
                        full ? "bg-gradient-to-r from-accent to-cyan-300" : "bg-gradient-to-r from-accent-2 to-violet-300",
                        dim ? "opacity-40" : "opacity-100",
                      )}
                    />
                  </div>
                </div>
              );
            })}
            <div />
            <div className="relative mt-2 h-5 border-t border-border">
              {ticks.map((t) => (
                <span key={t.year} style={{ left: `${t.pct}%` }} className="absolute top-1 -translate-x-1/2 font-mono text-[10px] text-muted-2">
                  {t.year}
                </span>
              ))}
            </div>
          </div>
        </figure>
      </Reveal>

      {/* Roles */}
      <ol className="mt-6 grid gap-4 lg:grid-cols-3">
        {roles.map((role, i) => {
          const dim = active !== null && active !== role.id;
          return (
            <li key={role.id} id={`role-${role.id}`} className="scroll-mt-28">
              <Reveal
                index={i}
                onMouseEnter={() => setActive(role.id)}
                className={cn(
                  "tile flex h-full flex-col transition-[opacity,border-color] duration-300",
                  dim && "opacity-50",
                  active === role.id && "border-border-strong",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs text-muted-2">
                      {formatMonth(role.start)} – {formatMonth(role.end)}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold tracking-tight text-fg">{role.company}</h3>
                    <p className="text-sm text-muted">{role.role}</p>
                  </div>
                  <Badge tone={role.employmentType === "Full-time" ? "accent" : "violet"}>{role.employmentType}</Badge>
                </div>
                <p className="mt-4 text-[15px] leading-relaxed text-fg/85">{role.summary}</p>
                <ul className="mt-4 space-y-2">
                  {role.bullets.map((b) => (
                    <li key={b} className="flex gap-2.5 text-[15px] leading-relaxed text-muted">
                      <span aria-hidden className="mt-[9px] size-1.5 shrink-0 rounded-full bg-accent/70" />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-5 text-xs text-muted-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" /> {role.location}
                  </span>
                </div>
                <ul className="mt-3 flex flex-wrap gap-2" aria-label="Technologies">
                  {role.stack.map((s) => (
                    <li key={s} title={s} className="flex size-7 items-center justify-center rounded-md border border-border bg-white/[0.02]">
                      <TechIcon name={s} className="size-3.5" />
                      <span className="sr-only">{s}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
