"use client";

import { useSyncExternalStore } from "react";

/**
 * Site-wide "pause animations" switch.
 *
 * The Web Interface Guidelines ask for a pause control on any motion that
 * autoplays for more than a few seconds (marquee, 3D hero, mascot). This is a
 * tiny external store so any client component can read it without a provider.
 * CSS animations are paused via `html.motion-paused` in globals.css; JS-driven
 * loops read `useMotionPaused()`.
 */

const STORAGE_KEY = "ah:motion-paused";
const listeners = new Set<() => void>();
let paused = false;
let initialised = false;

function apply(value: boolean) {
  paused = value;
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("motion-paused", value);
  }
  listeners.forEach((l) => l());
}

function init() {
  if (initialised || typeof window === "undefined") return;
  initialised = true;
  try {
    apply(window.localStorage.getItem(STORAGE_KEY) === "1");
  } catch {
    /* storage unavailable */
  }
}

export function setMotionPaused(value: boolean) {
  apply(value);
  try {
    window.localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
  } catch {
    /* storage unavailable */
  }
}

function subscribe(listener: () => void) {
  init();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useMotionPaused() {
  return useSyncExternalStore(
    subscribe,
    () => paused,
    () => false,
  );
}
