import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ProjectFrameProps {
  title: string;
  subtitle?: string;
  accent: [string, string];
  className?: string;
  /** Larger type for featured cards. */
  size?: "sm" | "lg";
  /** Something to show in the window instead of the designed cover (e.g. a screenshot gallery). */
  children?: ReactNode;
  /** Extra content on the right side of the window chrome, e.g. a screenshot counter. */
  chrome?: ReactNode;
}

/**
 * Browser-window frame around a project visual. With `children` it just draws the
 * chrome around them; without, it renders a designed cover (accent gradient,
 * wordmark, abstract UI blocks) so a project without screenshots never looks
 * like a placeholder.
 */
export function ProjectFrame({ title, subtitle, accent, className, size = "sm", children, chrome }: ProjectFrameProps) {
  const [a, b] = accent;
  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-surface-2 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)]", className)}>
      {/* window chrome */}
      <div className="flex items-center gap-1.5 border-b border-border bg-surface px-3 py-2">
        <span className="size-2 rounded-full bg-white/15" />
        <span className="size-2 rounded-full bg-white/15" />
        <span className="size-2 rounded-full bg-white/15" />
        <span className="ml-3 h-4 flex-1 rounded-md bg-white/[0.04]" />
        {chrome}
      </div>

      {children ?? (
        <div className="relative aspect-[16/10]">
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(120% 90% at 0% 0%, ${a}33, transparent 55%), radial-gradient(110% 90% at 100% 100%, ${b}33, transparent 55%), var(--surface-2)`,
            }}
          >
            {/* abstract UI blocks */}
            <div className="absolute inset-x-5 top-5 flex gap-3 sm:inset-x-7 sm:top-7">
              <div className="hidden w-[22%] flex-col gap-2 sm:flex">
                {[0.9, 0.6, 0.75, 0.5, 0.7].map((w, i) => (
                  <span key={i} className="h-2 rounded bg-white/[0.07]" style={{ width: `${w * 100}%` }} />
                ))}
              </div>
              <div className="flex flex-1 flex-col gap-3">
                <div className="flex gap-3">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="h-10 flex-1 rounded-md border border-white/[0.06] bg-white/[0.035]" />
                  ))}
                </div>
                <div className="relative h-20 overflow-hidden rounded-md border border-white/[0.06] bg-white/[0.03]">
                  <svg viewBox="0 0 300 80" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                    <defs>
                      <linearGradient id={`pf-${title}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor={a} stopOpacity="0.5" />
                        <stop offset="1" stopColor={a} stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0 62 L30 50 L60 56 L90 36 L120 42 L150 24 L180 30 L210 14 L240 22 L270 10 L300 16 L300 80 L0 80 Z" fill={`url(#pf-${title})`} />
                    <path d="M0 62 L30 50 L60 56 L90 36 L120 42 L150 24 L180 30 L210 14 L240 22 L270 10 L300 16" stroke={a} strokeWidth="2" fill="none" />
                  </svg>
                </div>
                <div className="flex flex-col gap-2">
                  {[0.95, 0.8, 0.88].map((w, i) => (
                    <span key={i} className="h-2 rounded bg-white/[0.06]" style={{ width: `${w * 100}%` }} />
                  ))}
                </div>
              </div>
            </div>

            {/* wordmark */}
            <div className="absolute bottom-5 left-5 sm:bottom-7 sm:left-7">
              <p
                className={cn("font-semibold tracking-tight text-fg", size === "lg" ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl")}
                style={{ textShadow: `0 0 40px ${a}66` }}
              >
                {title}
              </p>
              {subtitle && <p className="mt-1 text-xs text-muted sm:text-sm">{subtitle}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
