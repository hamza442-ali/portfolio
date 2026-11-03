import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: readonly ReactNode[];
  className?: string;
  /** Seconds per loop. */
  duration?: number;
  reverse?: boolean;
}

/**
 * Infinite horizontal marquee. Items are duplicated once and the track
 * translates by -50%, so the loop is seamless. Pauses on hover. Under
 * `prefers-reduced-motion` the global CSS collapses the animation and the
 * first copy simply sits still.
 */
export function Marquee({ items, className, duration = 40, reverse }: MarqueeProps) {
  return (
    <div
      className={cn(
        "group relative flex w-full overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]",
        className,
      )}
    >
      <ul
        className={cn(
          "flex w-max shrink-0 items-center gap-10 pr-10 animate-marquee group-hover:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]",
        )}
        style={{ animationDuration: `${duration}s` }}
      >
        {[...items, ...items].map((item, i) => (
          <li key={i} className="shrink-0" aria-hidden={i >= items.length}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
