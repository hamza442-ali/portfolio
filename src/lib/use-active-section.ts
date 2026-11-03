"use client";

import { useEffect, useState } from "react";
import { navItems, type SectionId } from "./site";

export type ActiveSection = SectionId | "top";

/** Which top-level section is currently in view (shared by the nav and the mascot). */
export function useActiveSection(): ActiveSection {
  const [active, setActive] = useState<ActiveSection>("top");

  useEffect(() => {
    const ids: ActiveSection[] = ["top", ...navItems.map((n) => n.id)];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id as ActiveSection);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.2, 0.5] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return active;
}
