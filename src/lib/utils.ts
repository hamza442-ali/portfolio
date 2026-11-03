import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** "2024-11" → "Nov 2024". */
export function formatMonth(iso: string | null, presentLabel = "Present") {
  if (!iso) return presentLabel;
  const [y, m] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleString("en-GB", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Months between two ISO months (inclusive of start, exclusive of end). */
export function monthsBetween(startIso: string, endIso: string) {
  const [sy, sm] = startIso.split("-").map(Number);
  const [ey, em] = endIso.split("-").map(Number);
  return (ey - sy) * 12 + (em - sm);
}

/** Current ISO month in UTC, e.g. "2026-10". */
export function currentIsoMonth() {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}
