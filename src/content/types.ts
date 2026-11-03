/**
 * Shared content types.
 *
 * Every piece of copy on the site lives in `src/content/*` and is typed here.
 * The shape is deliberately flat and descriptive so a future "ask my portfolio"
 * assistant can index the same objects without a separate data source.
 */

/** How strongly a claim is backed. Rendered as a visible label, never hidden. */
export type ProofLevel =
  | "professional" // used in paid, production work
  | "project" // built in a personal or university project
  | "learning"; // actively studying, not yet shipped

export type EvidenceLabel =
  | "Professional · team product"
  | "University team project"
  | "Team product"
  | "Personal project"
  | "Learning build"
  | "In progress";

export interface Link {
  label: string;
  href: string;
  kind?: "live" | "repo" | "doc" | "product";
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  employmentType: "Full-time" | "Part-time";
  location: string;
  /** ISO month, e.g. "2024-11". Used for the overlap chart and display. */
  start: string;
  end: string | null;
  /** One line, shown under the role. */
  summary: string;
  /** Max three short bullets. */
  bullets: string[];
  stack: string[];
}

export interface Highlight {
  /** lucide icon name key, see components/ui/icons */
  icon: "layout" | "refresh" | "share" | "server" | "rocket" | "workflow" | "users" | "check" | "shield" | "map" | "zap" | "test" | "search" | "gauge";
  title: string;
  text: string;
}

/** A screenshot under /public. Width, height and blur placeholder come from `images.generated.ts`. */
export interface ProjectImage {
  src: string;
  /** What the screenshot shows, for screen readers. */
  alt: string;
  /** Short caption shown under the gallery and in the lightbox. */
  caption?: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  evidence: EvidenceLabel;
  /** Accent used for the designed thumbnail; CSS colour pair. */
  accent: [string, string];
  /** 1–2 sentences. */
  summary: string;
  problem?: string;
  /** What Ali personally did, as scannable tiles. */
  highlights: Highlight[];
  /** Product/team capabilities, shown collapsed. Not attributed to Ali individually. */
  productCapabilities?: string[];
  outcome?: string;
  tags: string[];
  links: Link[];
  /** Screenshots, first one is the cover. Only files that exist (and were indexed by `npm run images`) render. */
  images?: ProjectImage[];
  featured?: boolean;
  inProgress?: boolean;
  period: string;
}

export interface SkillItem {
  name: string;
  level: ProofLevel;
  note?: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  blurb: string;
  items: SkillItem[];
}

export interface AIJourneyTier {
  id: string;
  level: ProofLevel;
  label: string;
  title: string;
  description: string;
  points: string[];
}

export interface Education {
  id: string;
  institution: string;
  program: string;
  location: string;
  period: string;
  details: string[];
  note?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  year?: string;
  link?: Link;
}
