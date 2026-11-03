import type { Experience } from "./types";

/**
 * Work history. Dates are month-level on purpose; roles overlap and the
 * Experience section draws an overlap chart from `start`/`end`.
 * Never sum these durations to compute "years of experience".
 */
export const experience: Experience[] = [
  {
    id: "gamma-labs",
    company: "Gamma Labs Inc.",
    role: "Full-Stack Developer",
    employmentType: "Full-time",
    location: "Remote · Canada",
    start: "2024-11",
    end: "2026-04",
    summary: "Folionomics, a multi-chain crypto portfolio analytics product.",
    bullets: [
      "Built most of the Next.js frontend: dashboards, filters, charts and portfolio sharing.",
      "Shipped virtualized, sticky-header tables that keep large wallet datasets fast.",
      "Wired async refresh jobs, Go services and PostgreSQL features; contributed to the RAG chat.",
    ],
    stack: ["Next.js", "React", "TypeScript", "Redux Toolkit", "Go", "PostgreSQL", "Docker", "AWS"],
  },
  {
    id: "ab-matrix",
    company: "AB Matrix",
    role: "Full-Stack Developer",
    employmentType: "Part-time",
    location: "Islamabad, Pakistan",
    start: "2024-06",
    end: "2026-04",
    summary: "Project-based web development alongside full-time roles.",
    bullets: [
      "Built responsive React interfaces for client web apps.",
      "Connected UI flows to Node/Express services and MongoDB.",
      "Worked on projects around smart-contract auditing workflows.",
    ],
    stack: ["React", "Node.js", "Express", "MongoDB"],
  },
  {
    id: "terabit",
    company: "TeraBit IT",
    role: "Full-Stack Developer",
    employmentType: "Full-time",
    location: "Pakistan",
    start: "2023-10",
    end: "2024-11",
    summary: "First full-time engineering role, shipping client features end to end.",
    bullets: [
      "Delivered full-stack features end to end for client projects.",
      "Connected React frontends to REST APIs, SQL and MongoDB.",
      "Owned bug fixes, testing, UX polish and technical docs.",
    ],
    stack: ["React", "Next.js", "Node.js", "Express", "MongoDB", "PostgreSQL", "Docker", "AWS"],
  },
];

/** Earliest start month, used as the origin of the overlap chart. */
export const careerStart = "2023-10";
