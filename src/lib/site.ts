/** Ali's own domain. Production builds use it unless NEXT_PUBLIC_SITE_URL overrides it. */
export const productionDomain = "https://alihamza.lol";

/** Absolute site URL without trailing slash. Falls back to localhost in dev. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NODE_ENV === "production" ? productionDomain : "http://localhost:3000")
).replace(/\/$/, "");

export const navItems = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "ai", label: "AI" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof navItems)[number]["id"];
