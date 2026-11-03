"use client";

import dynamic from "next/dynamic";
import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useMotionPaused } from "@/lib/motion-pref";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

function supportsWebGL() {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * The 3D layer is a desktop flourish. Phones and low-end devices get the
 * CSS-only backdrop, which keeps three.js (~240 KB) off their main thread.
 */
function shouldRender3D() {
  if (typeof window === "undefined") return false;
  if (window.innerWidth < 768) return false;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return false;
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return false;
  if (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency < 4) return false;
  return supportsWebGL();
}

/**
 * Static gradient + grid always render (so there is never a blank hero). The
 * WebGL graph layers on top only when motion is allowed and WebGL exists, and
 * it stops rendering while scrolled out of view.
 */
export function HeroBackdrop() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.05 });
  const [canRender3D, setCanRender3D] = useState(false);
  const paused = useMotionPaused();

  useEffect(() => {
    if (reduce) return;
    // Wait for an idle moment after the intro so three.js never competes with first paint.
    let cancelled = false;
    const start = () => {
      if (!cancelled) setCanRender3D(shouldRender3D());
    };
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const timer = window.setTimeout(() => {
      if (w.requestIdleCallback) w.requestIdleCallback(start, { timeout: 2000 });
      else start();
    }, 1200);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [reduce]);

  return (
    <div ref={ref} aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      {/* Static layers */}
      <div className="absolute inset-0 grid-bg opacity-70" />
      <div className="absolute left-1/2 top-[38%] h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.22),transparent_70%)] blur-3xl animate-[drift_16s_ease-in-out_infinite_alternate]" />
      <div className="absolute left-[62%] top-[55%] h-[50vmin] w-[50vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(167,139,250,0.2),transparent_70%)] blur-3xl animate-[drift_20s_ease-in-out_infinite_alternate-reverse]" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-bg" />

      {/* Text protection: keeps the copy legible over the graph */}
      <div className="absolute inset-0 z-[1] hidden bg-[linear-gradient(90deg,var(--bg)_0%,rgba(5,6,10,0.82)_30%,rgba(5,6,10,0.35)_52%,transparent_70%)] lg:block" />
      <div className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(5,6,10,0.2)_0%,rgba(5,6,10,0.72)_45%,rgba(5,6,10,0.85)_100%)] lg:hidden" />

      {/* WebGL layer */}
      {canRender3D && (
        <div className="absolute inset-0 opacity-0 animate-[fade-in_1.4s_ease-out_forwards]">
          <HeroCanvas active={inView && !paused} />
        </div>
      )}
    </div>
  );
}
