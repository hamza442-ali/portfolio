"use client";

import { useAnimationFrame } from "motion/react";
import { useEffect, useRef } from "react";
import { useMotionPaused } from "@/lib/motion-pref";
import { cn } from "@/lib/utils";
import { CatSvg } from "./CatSvg";
import type { VehicleSpec } from "./vehicles";

interface RiderProps {
  vehicle: VehicleSpec;
  /** +1 travels left → right, -1 right → left. */
  dir: 1 | -1;
  /** Pixel's standing size in px; the vehicle scales from it. */
  size: number;
  onDone: () => void;
}

/**
 * One crossing of the screen on a vehicle. Position, tilt and wheel rotation
 * are computed per frame from elapsed time so the motion stays smooth and
 * pauses cleanly with the site-wide switch.
 */
export function Rider({ vehicle, dir, size, onDone }: RiderProps) {
  const paused = useMotionPaused();
  const ref = useRef<HTMLDivElement>(null);
  const elapsed = useRef(0);
  const last = useRef<number | null>(null);
  const done = useRef(false);
  const travelled = useRef(0);

  const boxW = size * vehicle.boxScale;
  const boxH = (boxW * vehicle.viewBox.h) / vehicle.viewBox.w;
  const riderW = size * vehicle.riderScale;
  const riderH = riderW * (92 / 80);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    Object.entries(vehicle.pose).forEach(([k, v]) => el.style.setProperty(k, v));
  }, [vehicle]);

  useAnimationFrame((t) => {
    const el = ref.current;
    if (!el || done.current) return;
    if (last.current === null) last.current = t;
    const dt = paused ? 0 : (t - last.current) / 1000;
    last.current = t;
    elapsed.current += dt;

    const p = Math.min(1, elapsed.current / vehicle.seconds);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const span = vw + boxW * 2;
    const xLocal = -boxW + p * span; // left → right in travel space
    const x = dir === 1 ? xLocal : vw - xLocal - boxW;
    travelled.current += dt * (span / vehicle.seconds);

    let y = 0;
    let tilt = 0;
    if (vehicle.path === "sky-sine") {
      const base = vh * 0.42;
      const amp = Math.min(60, vh * 0.08);
      const k = 2 * Math.PI * 1.5;
      y = base + amp * Math.sin(k * p);
      const dy = amp * k * Math.cos(k * p); // per unit p
      tilt = -(Math.atan2(dy, span) * 180) / Math.PI;
    } else if (vehicle.path === "arc") {
      const h = vh * 0.62;
      y = 24 + h * Math.sin(Math.PI * p);
      const dy = h * Math.PI * Math.cos(Math.PI * p);
      tilt = -(Math.atan2(dy, span) * 180) / Math.PI * 0.6;
    } else {
      // ground: gentle bounce; skateboard does a jump mid-way
      y = 1.2 * Math.abs(Math.sin(p * 40));
      if (vehicle.id === "skateboard" && p > 0.42 && p < 0.6) {
        const j = Math.sin((Math.PI * (p - 0.42)) / 0.18);
        y += 44 * j;
        tilt = -14 * j;
      }
    }

    el.style.transform = `translate3d(${x}px, ${-y}px, 0) scaleX(${dir}) rotate(${tilt}deg)`;

    if (vehicle.wheelRadius) {
      const rPx = vehicle.wheelRadius * (boxW / vehicle.viewBox.w);
      const deg = (travelled.current / (2 * Math.PI * rPx)) * 360;
      el.style.setProperty("--wheel", `${deg}deg`);
      el.style.setProperty("--crank", `${deg * 0.5}deg`);
      if (vehicle.pedals) {
        const a = (deg * 0.5 * Math.PI) / 180;
        el.style.setProperty("--thigh-l", `${-60 + 18 * Math.sin(a)}deg`);
        el.style.setProperty("--shin-l", `${72 - 20 * Math.sin(a)}deg`);
        el.style.setProperty("--thigh-r", `${-60 - 18 * Math.sin(a)}deg`);
        el.style.setProperty("--shin-r", `${72 + 20 * Math.sin(a)}deg`);
      }
    }

    if (p >= 1) {
      done.current = true;
      onDone();
    }
  });

  return (
    <div className="pointer-events-none fixed inset-0 z-[61] overflow-hidden" aria-hidden>
      <div
        ref={ref}
        className={cn("mascot riding absolute bottom-0 left-0 will-change-transform", `ride-${vehicle.id}`)}
        style={{ width: boxW, height: boxH, transformOrigin: "50% 100%" }}
      >
        <div className="relative h-full w-full">
          {vehicle.back}
          <div
            className="absolute"
            style={{
              width: riderW,
              height: riderH,
              left: (vehicle.rider.cx / vehicle.viewBox.w) * boxW - riderW / 2,
              bottom: boxH - (vehicle.rider.bottom / vehicle.viewBox.h) * boxH,
            }}
          >
            <CatSvg className="h-full w-full" />
          </div>
          {vehicle.front}
        </div>
      </div>
    </div>
  );
}
