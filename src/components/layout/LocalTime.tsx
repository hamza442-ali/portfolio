"use client";

import { useEffect, useState } from "react";
import { profile } from "@/content/profile";

/** Live clock in Ali's time zone. Renders a placeholder until mounted to avoid hydration mismatch. */
export function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: profile.location.timeZone,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="font-mono tabular-nums" suppressHydrationWarning>
      {time ?? "--:--:--"}
    </span>
  );
}
