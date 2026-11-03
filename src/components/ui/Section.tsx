import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

interface SectionProps {
  id: string;
  /** "01", "02"… shown with the short title as a small index line. */
  number?: string;
  /** One or two words: About, Experience… */
  title: string;
  /** The real headline, 3–6 words. */
  lead: ReactNode;
  /** Optional one-line subtitle. */
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Alternate band background for rhythm between sections. */
  tone?: "base" | "alt";
  /** Right-aligned slot next to the heading on large screens (e.g. a legend). */
  aside?: ReactNode;
}

export function Section({ id, number, title, lead, description, children, className, tone = "base", aside }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-24 py-20 sm:py-28",
        tone === "alt" && "border-y border-border bg-surface/50",
        className,
      )}
      aria-labelledby={`${id}-title`}
    >
      <div className="container-x">
        <Reveal className="mb-10 flex flex-col gap-6 sm:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 flex items-center gap-3 font-mono text-xs text-muted-2">
              {number && <span className="text-accent">{number}</span>}
              <span className="h-px w-6 bg-border-strong" aria-hidden />
              <span className="uppercase tracking-[0.16em]">{title}</span>
            </p>
            <h2 id={`${id}-title`} className="text-balance text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
              {lead}
            </h2>
            {description && <p className="copy mt-3 text-muted">{description}</p>}
          </div>
          {aside && <div className="shrink-0">{aside}</div>}
        </Reveal>
        {children}
      </div>
    </section>
  );
}
