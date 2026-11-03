"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState, type KeyboardEvent } from "react";
import { proofLevelMeta, skillGroups } from "@/content/skills";
import { cn } from "@/lib/utils";
import { Dot, proofTone } from "@/components/ui/Badge";
import { TechIcon } from "@/components/ui/TechIcon";

export function SkillTabs() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const baseId = useId();
  const group = skillGroups[index];

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (index + (e.key === "ArrowRight" ? 1 : -1) + skillGroups.length) % skillGroups.length;
    setIndex(next);
    document.getElementById(`${baseId}-tab-${next}`)?.focus();
  }

  return (
    <div>
      <div role="tablist" aria-label="Skill areas" onKeyDown={onKeyDown} className="flex flex-wrap gap-2">
        {skillGroups.map((g, i) => (
          <button
            key={g.id}
            id={`${baseId}-tab-${i}`}
            role="tab"
            type="button"
            aria-selected={i === index}
            aria-controls={`${baseId}-panel`}
            tabIndex={i === index ? 0 : -1}
            onClick={() => setIndex(i)}
            className={cn(
              "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
              i === index ? "text-bg" : "text-muted hover:text-fg",
            )}
          >
            {i === index && (
              <motion.span layoutId="skill-tab" className="absolute inset-0 -z-10 rounded-full bg-fg" transition={{ type: "spring", stiffness: 400, damping: 35 }} />
            )}
            {g.title}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={group.id}
          id={`${baseId}-panel`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${index}`}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="tile mt-5"
        >
          <p className="text-sm text-muted">{group.blurb}</p>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((item) => (
              <li
                key={item.name}
                title={item.note ? `${proofLevelMeta[item.level].label} · ${item.note}` : proofLevelMeta[item.level].label}
                className="flex items-center gap-3 rounded-xl border border-border bg-white/[0.02] px-3 py-2.5 transition-colors hover:border-border-strong"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                  <TechIcon name={item.name} className="size-4" />
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-fg">{item.name}</span>
                <span className="flex items-center gap-1.5 text-[11px] text-muted-2">
                  <Dot tone={proofTone[item.level]} />
                  {proofLevelMeta[item.level].short}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
