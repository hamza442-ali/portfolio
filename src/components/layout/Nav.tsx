"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Command, Menu, Pause, Play, X } from "lucide-react";
import { useEffect, useState } from "react";
import { profile } from "@/content/profile";
import { setMotionPaused, useMotionPaused } from "@/lib/motion-pref";
import { navItems } from "@/lib/site";
import { useActiveSection } from "@/lib/use-active-section";
import { cn } from "@/lib/utils";
import { CommandPalette } from "./CommandPalette";
import { ScrollProgress } from "./ScrollProgress";

export function Nav() {
  const reduce = useReducedMotion();
  const paused = useMotionPaused();
  const active = useActiveSection();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Shrink the pill once the hero is scrolled past.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock scroll while the mobile menu is open.
  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <ScrollProgress />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-bg"
      >
        Skip to content
      </a>

      <motion.header
        initial={reduce ? false : { y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-4 z-[80] flex justify-center px-[clamp(1rem,4vw,3rem)]"
      >
        <nav
          aria-label="Primary"
          className={cn(
            "flex w-full max-w-[82rem] items-center justify-between gap-2 rounded-full border px-2 py-2 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500",
            scrolled
              ? "glass border-border-strong shadow-[0_8px_40px_-16px_rgba(0,0,0,0.8)]"
              : "border-transparent bg-transparent",
          )}
        >
          <a
            href="#top"
            className="group flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-sm tracking-tight text-fg"
            aria-label={`${profile.name}, back to top`}
            translate="no"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            <span>
              ali<span className="text-muted">.hamza</span>
            </span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={cn(
                    "relative rounded-full px-3.5 py-1.5 text-sm text-muted transition-colors hover:text-fg",
                    active === item.id && "text-fg",
                  )}
                  aria-current={active === item.id ? "true" : undefined}
                >
                  {active === item.id && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-white/[0.07]"
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setMotionPaused(!paused)}
              aria-pressed={paused}
              aria-label={paused ? "Resume animations" : "Pause animations"}
              title={paused ? "Resume animations" : "Pause animations"}
              className="flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-white/[0.05] hover:text-fg"
            >
              {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
            </button>
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="hidden items-center gap-2 rounded-full border border-border px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-border-strong hover:text-fg sm:flex"
              aria-label="Open command palette (Ctrl or Cmd + K)"
            >
              <Command className="size-3.5" />
              <span>K</span>
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex size-9 items-center justify-center rounded-full text-fg md:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[70] flex flex-col overflow-y-auto overscroll-contain bg-bg/95 px-6 pb-10 pt-28 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col gap-2">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.04 }}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between border-b border-border py-4 text-2xl font-medium tracking-tight text-fg"
                  >
                    {item.label}
                    <span className="font-mono text-xs text-muted-2">0{i + 1}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="mt-auto flex flex-col gap-3 pt-8 text-sm text-muted">
              <a href={`mailto:${profile.email}`} className="hover:text-fg">
                {profile.email}
              </a>
              <div className="flex gap-4">
                <a href={profile.social.github} target="_blank" rel="noopener noreferrer" className="hover:text-fg">
                  GitHub
                </a>
                <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-fg">
                  LinkedIn
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </>
  );
}
