import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlowFrameProps {
  children: ReactNode;
  className?: string;
}

/** Gradient-bordered frame with a soft glow behind it. Used for the headshot. */
export function GlowFrame({ children, className }: GlowFrameProps) {
  return (
    <div className={cn("relative", className)}>
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[2rem] bg-[radial-gradient(60%_60%_at_30%_20%,var(--glow),transparent_70%),radial-gradient(50%_50%_at_80%_80%,var(--glow-2),transparent_70%)] blur-2xl"
      />
      <div className="border-gradient relative overflow-hidden rounded-[1.75rem] bg-surface">
        {children}
      </div>
    </div>
  );
}
