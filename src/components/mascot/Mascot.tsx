"use client";

import { AnimatePresence, animate, motion, useAnimationFrame, useMotionValue, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMotionPaused } from "@/lib/motion-pref";
import { useActiveSection, type ActiveSection } from "@/lib/use-active-section";
import { cn } from "@/lib/utils";
import { Rider } from "./Rider";
import { CatSvg } from "./CatSvg";
import { VEHICLES, type VehicleSpec } from "./vehicles";

/**
 * Pixel, the mascot cat.
 *
 * Locomotion is distance-driven: every joint angle is a function of how far
 * Pixel has travelled since the step began, so his feet always stay planted no
 * matter how the horizontal motion eases. A `blend` value fades the walking
 * pose in and out so he settles into a neutral stance instead of snapping.
 *
 * A director loop mixes three kinds of outings: short walks, peeks (he leaves
 * through an edge and peers back in from the side or from below), and rides
 * (he leaves, crosses the whole screen on a vehicle, and walks back in from the
 * other side). Between outings he idles, blinks, glances around, follows the
 * cursor with his eyes, ducks on fast scrolling, perks up on new sections,
 * sleeps after a minute of inactivity and reacts happily to clicks. Speech
 * bubbles have no close control and he cannot be dismissed (by request).
 * Everything stops under `prefers-reduced-motion` and the site pause switch.
 */

const LEG_UNITS = 22; // hip-to-floor in SVG units
const STEP_ANGLE = 30; // degrees either side of vertical at foot contact
const CYCLE_SECONDS = 0.72; // one full stride (two steps) at cruising speed: a relaxed stroll
const SLEEP_AFTER_MS = 60_000;
const EDGE = 16;

type Mode = "idle" | "walking" | "sleeping" | "ducking" | "peeking" | "away" | "riding";
type Key = [phase: number, value: number];

const sectionLines: Record<ActiveSection, string> = {
  top: "Hi! I'm Pixel. Press Ctrl + K to jump anywhere.",
  about: "Engineer first, product mindset. Keep scrolling!",
  experience: "Three years, three teams, lots of shipped features.",
  work: "Folionomics and DepEase are the big ones. Have a look.",
  skills: "No fake percentage bars here. Just honest labels.",
  ai: "RAG in production, FastAPI by hand, pgvector in progress.",
  education: "Ali is studying robotics now. I approve. Purr.",
  contact: "Say hello! Ali reads every message.",
};

const clickLines = [
  "Meow. Hello!",
  "I run on React and naps.",
  "Ali builds the big stuff. I supervise.",
  "Scroll down, the projects are worth it.",
  "I'm learning German too. Miau!",
  "Careful, I scratch. Just kidding.",
];

const wakeLines = ["I wasn't napping.", "Mrrp? You're back!", "Zzz… huh? Hi!"];
const peekLines = ["Boo!", "Psst. Still there?", "Just checking on you.", "Did you miss me?"];
const backLines = ["I'm back!", "That was fun.", "Phew. Where were we?"];

// Gait keyframes (degrees). Local +x is "forward"; negative rotation swings a
// hanging limb forward (SVG rotation is clockwise-positive).
const THIGH: Key[] = [
  [0, -STEP_ANGLE],
  [0.25, -8],
  [0.5, STEP_ANGLE],
  [0.72, 4],
  [1, -STEP_ANGLE],
];
const SHIN: Key[] = [
  [0, 0],
  [0.25, 10],
  [0.5, 18],
  [0.62, 62],
  [0.85, 34],
  [1, 0],
];
const ARM: Key[] = [
  [0, 26],
  [0.5, -26],
  [1, 26],
];

function interp(keys: Key[], p: number) {
  for (let i = 1; i < keys.length; i++) {
    const [p0, v0] = keys[i - 1];
    const [p1, v1] = keys[i];
    if (p <= p1) {
      const t = (p - p0) / (p1 - p0);
      const s = 0.5 - 0.5 * Math.cos(Math.PI * t);
      return v0 + (v1 - v0) * s;
    }
  }
  return keys[keys.length - 1][1];
}

const mod1 = (v: number) => ((v % 1) + 1) % 1;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];
const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

function mascotSize() {
  return typeof window !== "undefined" && window.innerWidth < 640 ? 56 : 84; // smaller on phones so he never dominates the screen
}

export function Mascot() {
  const reduce = useReducedMotion();
  const paused = useMotionPaused();
  const active = useActiveSection();

  const [mounted, setMounted] = useState(false);
  const [size, setSize] = useState(84);
  const [mode, setMode] = useState<Mode>("idle");
  const [facing, setFacing] = useState<1 | -1>(1);
  const [happy, setHappy] = useState(false);
  const [excited, setExcited] = useState(false);
  const [waving, setWaving] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const [xPos, setXPos] = useState(96);
  const [touch, setTouch] = useState(false);
  const [ride, setRide] = useState<{ vehicle: VehicleSpec; dir: 1 | -1 } | null>(null);
  /** While peeking from a side edge: which edge and how far the sprite hangs past it. */
  const [peek, setPeek] = useState<{ edge: 1 | -1; overflow: number } | null>(null);

  const x = useMotionValue(96);
  const y = useMotionValue(0);
  const rot = useMotionValue(0);
  const blend = useMotionValue(0); // 0 = neutral stance, 1 = full walking pose

  const rootRef = useRef<HTMLDivElement>(null); // CSS vars live here
  const facingRef = useRef<1 | -1>(1);
  const walkStart = useRef(96);
  const lastBlend = useRef(0);
  const eyeTarget = useRef({ x: 0, y: 0 });
  const eyeCurrent = useRef({ x: 0, y: 0 });
  const lastPointerMove = useRef(0);
  const modeRef = useRef<Mode>("idle");
  const sleepTimer = useRef<number | null>(null);
  const firstSection = useRef(true);
  const bubbleTimer = useRef<number | null>(null);
  const rideDone = useRef<(() => void) | null>(null);
  const outings = useRef(0);

  const stridePx = 2 * LEG_UNITS * (size / 80) * Math.sin((STEP_ANGLE * Math.PI) / 180) * 2; // two steps
  const speedPx = stridePx / CYCLE_SECONDS;
  const live = mounted && !reduce && !paused;
  const onStage = mode === "idle" || mode === "walking" || mode === "ducking" || mode === "peeking";

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);
  useEffect(() => {
    facingRef.current = facing;
  }, [facing]);

  // Appear after the intro.
  useEffect(() => {
    const t = window.setTimeout(() => {
      const sz = mascotSize();
      const w = window.innerWidth;
      // Home spot: under the hero graph on desktop (clear of the copy and CTAs), centred on phones.
      const home = Math.round(w < 640 ? w / 2 - sz / 2 : Math.min(w * 0.62, w - sz - EDGE));
      x.set(home);
      walkStart.current = home;
      setXPos(home);
      setSize(sz);
      setTouch(window.matchMedia("(pointer: coarse)").matches);
      setMounted(true);
    }, 2600);
    return () => window.clearTimeout(t);
  }, [x]);

  const say = useCallback((text: string, ms = 4500) => {
    setBubble(text);
    if (bubbleTimer.current) window.clearTimeout(bubbleTimer.current);
    bubbleTimer.current = window.setTimeout(() => setBubble(null), ms);
  }, []);

  // Greeting once he appears.
  useEffect(() => {
    if (!mounted) return;
    const t = window.setTimeout(() => say(touch ? "Hi! I'm Pixel. Tap me any time." : sectionLines.top, 5500), 500);
    return () => window.clearTimeout(t);
  }, [mounted, touch, say]);

  const hop = useCallback(
    (height = 12) => {
      if (!live) return;
      animate(y, [0, -height, 0], { duration: 0.45, ease: "easeOut" });
    },
    [live, y],
  );

  const wave = useCallback(() => {
    setWaving(true);
    window.setTimeout(() => setWaving(false), 1600);
  }, []);

  /* ---------------------------------------------------------------- sleep */
  useEffect(() => {
    if (!live) return;
    const arm = () => {
      if (sleepTimer.current) window.clearTimeout(sleepTimer.current);
      sleepTimer.current = window.setTimeout(() => setMode((m) => (m === "idle" ? "sleeping" : m)), SLEEP_AFTER_MS);
    };
    const onActivity = () => {
      if (modeRef.current === "sleeping") {
        setMode("idle");
        setExcited(true);
        window.setTimeout(() => setExcited(false), 900);
        hop(8);
        say(pick(wakeLines), 3000);
      }
      arm();
    };
    arm();
    const opts = { passive: true } as const;
    window.addEventListener("pointermove", onActivity, opts);
    window.addEventListener("pointerdown", onActivity, opts);
    window.addEventListener("keydown", onActivity, opts);
    window.addEventListener("scroll", onActivity, opts);
    window.addEventListener("touchstart", onActivity, opts);
    return () => {
      if (sleepTimer.current) window.clearTimeout(sleepTimer.current);
      window.removeEventListener("pointermove", onActivity);
      window.removeEventListener("pointerdown", onActivity);
      window.removeEventListener("keydown", onActivity);
      window.removeEventListener("scroll", onActivity);
      window.removeEventListener("touchstart", onActivity);
    };
  }, [live, hop, say]);

  /* ----------------------------------------------------- scroll reactions */
  useEffect(() => {
    if (!live) return;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let release: number | null = null;
    const onScroll = () => {
      const now = performance.now();
      const dt = Math.max(16, now - lastT);
      const v = Math.abs(window.scrollY - lastY) / dt; // px per ms
      lastY = window.scrollY;
      lastT = now;
      if (v > 1.6 && modeRef.current === "idle") {
        setMode("ducking");
        if (release) window.clearTimeout(release);
        release = window.setTimeout(() => setMode((m) => (m === "ducking" ? "idle" : m)), 420);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (release) window.clearTimeout(release);
    };
  }, [live]);

  /* ---------------------------------------------------- section reactions */
  useEffect(() => {
    if (!live) return;
    if (firstSection.current) {
      firstSection.current = false;
      return;
    }
    const start = window.setTimeout(() => {
      const m = modeRef.current;
      if (m === "away" || m === "riding" || m === "sleeping") return;
      setExcited(true);
      hop(10);
      if (active === "contact") wave();
      say(sectionLines[active]);
    }, 0);
    const end = window.setTimeout(() => setExcited(false), 900);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(end);
    };
  }, [active, live, hop, wave, say]);

  /* ------------------------------------------------------- eye tracking */
  useEffect(() => {
    if (!live) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      lastPointerMove.current = performance.now();
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const el = rootRef.current;
        if (!el || modeRef.current === "peeking") return;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height * 0.35;
        eyeTarget.current = {
          x: clamp((e.clientX - cx) / 260, -1, 1) * 2.4,
          y: clamp((e.clientY - cy) / 200, -1, 1) * 1.8,
        };
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    const glance = window.setInterval(() => {
      if (performance.now() - lastPointerMove.current < 4000) return;
      if (modeRef.current !== "idle") return;
      eyeTarget.current = { x: rand(-2, 2), y: rand(-1.2, 1) };
      window.setTimeout(() => {
        if (performance.now() - lastPointerMove.current >= 4000) eyeTarget.current = { x: 0, y: 0 };
      }, rand(700, 1400));
    }, 3500);
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) window.cancelAnimationFrame(raf);
      window.clearInterval(glance);
    };
  }, [live]);

  /* ------------------------------------------------------------ director */
  useEffect(() => {
    if (!live) return;
    let alive = true;
    let ctrl: ReturnType<typeof animate> | null = null;
    const vw = () => window.innerWidth;
    const minX = () => EDGE;
    const maxX = () => Math.max(EDGE, vw() - size - EDGE);

    async function turn(dir: 1 | -1) {
      if (dir !== facingRef.current) {
        setFacing(dir);
        facingRef.current = dir;
        await sleep(380);
      }
    }

    /** Walk to an absolute x. Feet stay planted thanks to the distance-driven gait. */
    async function walkTo(target: number) {
      const cur = x.get();
      const dist = Math.abs(target - cur);
      if (dist < 4) return;
      await turn(target > cur ? 1 : -1);
      if (!alive) return;
      walkStart.current = cur;
      setMode("walking");
      animate(blend, 1, { duration: 0.3 });
      ctrl = animate(x, target, { duration: dist / speedPx + 0.35, ease: [0.4, 0, 0.6, 1] });
      await ctrl;
      if (!alive) return;
      animate(blend, 0, { duration: 0.35 });
      setXPos(target);
      setMode((m) => (m === "walking" ? "idle" : m));
    }

    async function shortWalk() {
      const cur = x.get();
      let dir: 1 | -1 = Math.random() < 0.5 ? -1 : 1;
      let dist = rand(1.5, 5) * stridePx;
      if (cur + dir * dist > maxX() || cur + dir * dist < minX()) dir = dir === 1 ? -1 : 1;
      dist = Math.round(dist / stridePx) * stridePx;
      await walkTo(clamp(cur + dir * dist, minX(), maxX()));
    }

    function nearestEdge(): 1 | -1 {
      return x.get() + size / 2 > vw() / 2 ? 1 : -1; // 1 = right edge
    }

    /** Walk out through an edge. */
    async function leave(edge: 1 | -1) {
      await walkTo(edge === 1 ? vw() + 24 : -size - 24);
      if (!alive) return;
      blend.set(0);
      setMode("away");
    }

    /** Walk back in from an edge to a random spot nearby. */
    async function comeBack(edge: 1 | -1) {
      x.set(edge === 1 ? vw() + 24 : -size - 24);
      setFacing(edge === 1 ? -1 : 1);
      facingRef.current = edge === 1 ? -1 : 1;
      setMode("walking");
      const target = edge === 1 ? vw() - size - rand(60, 220) : rand(60, 220);
      await walkTo(clamp(target, minX(), maxX()));
      if (!alive) return;
      say(pick(backLines), 2600);
    }

    async function peekSide(edge: 1 | -1) {
      setMode("peeking");
      // lean out from behind the edge, head and shoulder first
      const hidden = edge === 1 ? vw() + 10 : -size - 10;
      const shown = edge === 1 ? vw() - size * 0.48 : -size * 0.52;
      x.set(hidden);
      setFacing(edge === 1 ? -1 : 1);
      facingRef.current = edge === 1 ? -1 : 1;
      rot.set(0);
      eyeTarget.current = { x: 2.2, y: -0.6 };
      setPeek({ edge, overflow: edge === 1 ? shown + size - vw() : -shown });
      animate(rot, edge === 1 ? -14 : 14, { duration: 0.5, ease: "easeOut" }); // head leans toward the screen
      ctrl = animate(x, shown, { duration: 0.55, ease: [0.34, 1.56, 0.64, 1] });
      await ctrl;
      if (!alive) return;
      say(pick(peekLines), 3000);
      await sleep(1300);
      eyeTarget.current = { x: 2.2, y: 0.8 };
      await sleep(1200);
      eyeTarget.current = { x: 0.5, y: -0.4 };
      await sleep(900);
      if (!alive) return;
      animate(rot, 0, { duration: 0.35 });
      ctrl = animate(x, hidden, { duration: 0.35, ease: "easeIn" });
      await ctrl;
      eyeTarget.current = { x: 0, y: 0 };
      setPeek(null);
      setMode("away");
    }

    async function peekBottom() {
      setMode("peeking");
      const h = size * (92 / 80);
      const px = rand(minX() + size, maxX() - size);
      x.set(px);
      setXPos(px);
      setFacing(1);
      facingRef.current = 1;
      y.set(h * 1.15);
      eyeTarget.current = { x: -2, y: -1 };
      ctrl = animate(y, h * 0.52, { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }); // head + chest visible
      await ctrl;
      if (!alive) return;
      say(pick(peekLines), 3000);
      await sleep(1100);
      eyeTarget.current = { x: 2.2, y: -1 };
      await sleep(1100);
      eyeTarget.current = { x: -2.2, y: -0.6 };
      await sleep(1000);
      if (!alive) return;
      ctrl = animate(y, h * 1.15, { duration: 0.3, ease: "easeIn" });
      await ctrl;
      y.set(0);
      eyeTarget.current = { x: 0, y: 0 };
      setMode("away");
    }

    async function outingPeek() {
      const edge = nearestEdge();
      await leave(edge);
      if (!alive) return;
      await sleep(rand(2500, 4000));
      if (!alive) return;
      if (Math.random() < 0.5) await peekSide(edge);
      else await peekBottom();
      if (!alive) return;
      await sleep(rand(1800, 3000));
      if (!alive) return;
      await comeBack(edge);
    }

    async function outingRide(vehicle: VehicleSpec) {
      const edge = nearestEdge();
      say(vehicle.line, 2800);
      await sleep(1600);
      if (!alive) return;
      await leave(edge);
      if (!alive) return;
      await sleep(rand(1800, 3000));
      if (!alive) return;
      setMode("riding");
      const dir: 1 | -1 = edge === 1 ? -1 : 1; // enters from the edge he left through
      await new Promise<void>((resolve) => {
        rideDone.current = resolve;
        setRide({ vehicle, dir });
      });
      rideDone.current = null;
      setRide(null);
      if (!alive) return;
      setMode("away");
      await sleep(rand(2000, 3500));
      if (!alive) return;
      await comeBack(dir === 1 ? 1 : -1); // comes back from the side he exited
    }

    // Development-only hook so outings can be triggered from the console:
    // __pixel.walk(), __pixel.peek(), __pixel.ride("plane" | "jetpack" | "scooter" | "bicycle" | "skateboard")
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as { __pixel?: unknown }).__pixel = {
        walk: shortWalk,
        peek: outingPeek,
        ride: (id?: string) => outingRide(VEHICLES.find((v) => v.id === id) ?? pick(VEHICLES)),
      };
    }

    (async () => {
      await sleep(rand(9000, 13000));
      while (alive) {
        if (modeRef.current === "idle") {
          const n = outings.current++;
          if (n === 0) await shortWalk();
          else if (n === 1) await outingRide(pick(VEHICLES));
          else {
            const r = Math.random();
            if (r < 0.5) await shortWalk();
            else if (r < 0.78) await outingPeek();
            else await outingRide(pick(VEHICLES));
          }
        }
        if (!alive) return;
        await sleep(rand(22000, 45000)); // long calm stretches between outings
      }
    })();

    return () => {
      alive = false;
      ctrl?.stop();
      blend.set(0);
      rot.set(0);
      y.set(0);
      rideDone.current?.();
      rideDone.current = null;
      setRide(null);
      setPeek(null);
      setMode((m) => (m === "sleeping" ? m : "idle"));
      // Make sure he is on screen again after an interrupted outing.
      const w = window.innerWidth;
      if (x.get() < EDGE || x.get() > w - size - EDGE) x.set(clamp(x.get(), EDGE, Math.max(EDGE, w - size - EDGE)));
    };
  }, [live, size, stridePx, speedPx, x, y, rot, blend, say]);

  /* --------------------------------------------- per-frame joint update */
  useAnimationFrame(() => {
    const el = rootRef.current;
    if (!el || !live) return;
    const set = (k: string, v: string) => el.style.setProperty(k, v);

    const b = blend.get();
    if (b > 0.001) {
      const p = mod1(((x.get() - walkStart.current) * facingRef.current) / stridePx);
      const pr = mod1(p + 0.5);
      const vel = Math.abs(x.getVelocity());
      set("--thigh-l", `${interp(THIGH, p) * b}deg`);
      set("--shin-l", `${interp(SHIN, p) * b}deg`);
      set("--thigh-r", `${interp(THIGH, pr) * b}deg`);
      set("--shin-r", `${interp(SHIN, pr) * b}deg`);
      set("--arm-l", `${interp(ARM, p) * b}deg`);
      set("--arm-r", `${interp(ARM, pr) * b}deg`);
      set("--body-y", `${-1.7 * (0.5 - 0.5 * Math.cos(4 * Math.PI * p)) * b}px`);
      set("--lean", `${clamp(vel / speedPx, 0, 1) * 5 * b}deg`);
    } else if (lastBlend.current > 0.001) {
      ["--thigh-l", "--shin-l", "--thigh-r", "--shin-r", "--arm-l", "--arm-r"].forEach((k) => set(k, "0deg"));
      set("--body-y", "0px");
      set("--lean", "0deg");
    }
    lastBlend.current = b;

    const t = eyeTarget.current;
    const c = eyeCurrent.current;
    c.x += (t.x - c.x) * 0.12;
    c.y += (t.y - c.y) * 0.12;
    set("--px", `${c.x * facingRef.current}px`);
    set("--py", `${c.y}px`);
  });

  /* ------------------------------------------------------------ actions */
  function onClick() {
    if (!live) return;
    if (modeRef.current === "sleeping") setMode("idle");
    setHappy(true);
    window.setTimeout(() => setHappy(false), 1300);
    hop(14);
    wave();
    say(pick(clickLines), 3200);
  }

  if (!mounted) return null;

  const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
  const bubbleSide: "left" | "right" | "center" = xPos < 280 ? "left" : xPos > vw - 280 ? "right" : "center";
  // On phones the bubble spans the viewport (minus margins) so it can never clip at an edge.
  const phoneBubble = vw < 640 && !peek ? { left: 16 - xPos, width: vw - 32 } : null;
  const spriteMode: Mode = live ? mode : "idle";

  return (
    <>
      {ride && (
        <Rider
          vehicle={ride.vehicle}
          dir={ride.dir}
          size={size}
          onDone={() => {
            rideDone.current?.();
          }}
        />
      )}

      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] h-0"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <motion.div
          ref={rootRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{ x, y, rotate: rot, width: size, transformOrigin: "50% 100%" }}
          className="absolute bottom-0 left-0"
        >
          <AnimatePresence>
            {bubble && onStage && (
              <motion.div
                key={bubble}
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                role="status"
                aria-live="polite"
                className={cn(
                  "pointer-events-none absolute bottom-[calc(100%+12px)] w-max max-w-[min(17rem,calc(100vw-2rem))] rounded-2xl border border-border-strong bg-surface/95 px-4 py-2.5 text-sm leading-relaxed text-fg shadow-xl shadow-black/50 backdrop-blur",
                  phoneBubble && "max-w-none text-center",
                  !peek && !phoneBubble && bubbleSide === "left" && "left-0 rounded-bl-md",
                  !peek && !phoneBubble && bubbleSide === "right" && "right-0 rounded-br-md",
                  !peek && !phoneBubble && bubbleSide === "center" && "left-1/2 -translate-x-1/2",
                  peek?.edge === 1 && "rounded-br-md",
                  peek?.edge === -1 && "rounded-bl-md",
                )}
                style={
                  peek
                    ? peek.edge === 1
                      ? { right: peek.overflow + 12 }
                      : { left: peek.overflow + 12 }
                    : (phoneBubble ?? undefined)
                }
              >
                {bubble}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={onClick}
            aria-label="Pixel, the mascot cat. Click to say hi"
            className={cn(
              "mascot pointer-events-auto block cursor-pointer rounded-[40%] transition-[filter] duration-300 hover:[filter:drop-shadow(0_0_12px_var(--glow))] focus-visible:outline-offset-[6px]",
              spriteMode,
              happy && "happy",
              excited && "excited",
              waving && "waving",
            )}
            style={{ width: size, height: size * (92 / 80) }}
          >
            {/* facing flip is on an inner wrapper so turning around animates through scaleX(0) */}
            <span
              className="block h-full w-full transition-transform duration-[260ms] ease-in-out"
              style={{ transform: `scaleX(${facing})` }}
            >
              <CatSvg className="h-full w-full" />
            </span>
          </button>
        </motion.div>
      </div>
    </>
  );
}
