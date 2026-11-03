import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { EvidenceLabel, ProofLevel } from "@/content/types";

type Tone = "neutral" | "accent" | "violet" | "pink" | "success" | "warning";

const tones: Record<Tone, string> = {
  neutral: "border-border bg-white/[0.03] text-muted",
  accent: "border-accent/30 bg-accent/10 text-accent",
  violet: "border-accent-2/30 bg-accent-2/10 text-accent-2",
  pink: "border-accent-3/30 bg-accent-3/10 text-accent-3",
  success: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  warning: "border-amber-400/30 bg-amber-400/10 text-amber-300",
};

interface BadgeProps {
  tone?: Tone;
  className?: string;
  children: ReactNode;
  mono?: boolean;
}

export function Badge({ tone = "neutral", className, children, mono }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium leading-none",
        mono && "font-mono tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export const proofTone: Record<ProofLevel, Tone> = {
  professional: "accent",
  project: "violet",
  learning: "warning",
};

export const evidenceTone: Record<EvidenceLabel, Tone> = {
  "Professional · team product": "accent",
  "University team project": "violet",
  "Team product": "success",
  "Personal project": "neutral",
  "Learning build": "pink",
  "In progress": "warning",
};

/** Small dot used before proof-level labels. */
export function Dot({ tone = "neutral", className }: { tone?: Tone; className?: string }) {
  const color: Record<Tone, string> = {
    neutral: "bg-muted",
    accent: "bg-accent",
    violet: "bg-accent-2",
    pink: "bg-accent-3",
    success: "bg-emerald-400",
    warning: "bg-amber-400",
  };
  return <span aria-hidden className={cn("inline-block size-1.5 rounded-full", color[tone], className)} />;
}
