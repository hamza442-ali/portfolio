"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowUpRight, Mail, MapPin } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";
import { profile } from "@/content/profile";
import { easeOut } from "@/lib/motion";
import { Button } from "@/components/ui/Button";
import { HeroBackdrop } from "./HeroBackdrop";

const BASE_DELAY = 0.9; // after the preloader curtain lifts

export function Hero() {
  const reduce = useReducedMotion();
  const d = (i: number) => (reduce ? 0 : BASE_DELAY + i * 0.1);
  const [before, highlight] = splitHeadline(profile.hero.headline);

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pb-20 pt-28">
      <HeroBackdrop />

      <div className="container-hero relative lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
        <div>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: d(0), duration: 0.6, ease: easeOut }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.03] py-1.5 pl-2 pr-4 text-sm text-muted backdrop-blur"
          >
            <span className="flex size-6 items-center justify-center rounded-full bg-accent/15 text-accent">
              <MapPin className="size-3.5" />
            </span>
            <span className="font-medium text-fg">{profile.name}</span>
            <span className="text-muted-2">·</span>
            <span>{profile.location.label}</span>
          </motion.div>

          <motion.h1
            initial={reduce ? false : { y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: d(1), duration: 0.8, ease: easeOut }}
            className="max-w-3xl text-balance text-[clamp(2.25rem,4.8vw,4.5rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-fg"
          >
            {before} <span className="text-gradient">{highlight}</span>
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: d(2), duration: 0.7, ease: easeOut }}
            className="copy mt-6 max-w-xl text-lg text-muted"
          >
            {profile.hero.intro}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: d(3), duration: 0.7, ease: easeOut }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button href="#work" size="lg">
              View Work
              <ArrowUpRight className="size-4 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
            </Button>
            <Button href="#contact" variant="secondary" size="lg">
              Get in Touch
            </Button>
            <div className="ml-1 flex items-center gap-1">
              <IconLink href={profile.social.github} label="GitHub">
                <GitHubIcon className="size-5" />
              </IconLink>
              <IconLink href={profile.social.linkedin} label="LinkedIn">
                <LinkedInIcon className="size-5" />
              </IconLink>
              <IconLink href={`mailto:${profile.email}`} label="Email">
                <Mail className="size-5" />
              </IconLink>
            </div>
          </motion.div>

          <motion.dl
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: d(4), duration: 0.7, ease: easeOut }}
            className="mt-12 grid max-w-xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4"
          >
            {profile.hero.stats.map((s) => (
              <div key={s.label} className="flex flex-col bg-bg/80 px-5 py-4 backdrop-blur">
                <dt className="order-2 mt-1 text-xs text-muted-2">{s.label}</dt>
                <dd className="order-1 text-3xl font-semibold tracking-tight text-fg">{s.value}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
        {/* Right column is intentionally empty: the node graph shows through here on large screens. */}
        <div aria-hidden className="hidden lg:block" />
      </div>

      <motion.a
        href="#about"
        aria-label="Scroll to about"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: d(6), duration: 1 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted-2 transition-colors hover:text-fg sm:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.25em]">Scroll</span>
        <motion.span animate={reduce ? undefined : { y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}>
          <ArrowDown className="size-4" />
        </motion.span>
      </motion.a>
    </section>
  );
}

/** Highlights the last clause of the headline (after the last " and "). */
function splitHeadline(text: string): [string, string] {
  const i = text.lastIndexOf(" and ");
  if (i === -1) return [text, ""];
  return [text.slice(0, i + 5).trim(), text.slice(i + 5)];
}

function IconLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      aria-label={label}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="flex size-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-white/[0.05] hover:text-fg"
    >
      {children}
    </a>
  );
}
