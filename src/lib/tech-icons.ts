import {
  siApacheecharts,
  siDocker,
  siExpress,
  siFastapi,
  siFirebase,
  siGin,
  siGit,
  siGithubactions,
  siGo,
  siGooglecloud,
  siGooglegemini,
  siJavascript,
  siJenkins,
  siMongodb,
  siMui,
  siMysql,
  siNextdotjs,
  siNginx,
  siNodedotjs,
  siPostgresql,
  siPydantic,
  siPytest,
  siPython,
  siQdrant,
  siReact,
  siRedux,
  siSocketdotio,
  siStripe,
  siStyledcomponents,
  siTailwindcss,
  siTypescript,
  siVercel,
  siZod,
  type SimpleIcon,
} from "simple-icons";

export interface TechIconData {
  path: string;
  /** Hex colour without '#', already adjusted for a dark background. */
  hex: string;
  title: string;
}

/** Brands whose official mark is black; lifted so they show on dark. */
const DARK_MARKS = new Set(["Next.js", "Express", "Vercel", "Socket.IO", "GitHub"]);

function from(icon: SimpleIcon, name: string): TechIconData {
  return { path: icon.path, hex: DARK_MARKS.has(name) ? "ffffff" : icon.hex, title: icon.title };
}

const map: Record<string, TechIconData> = {
  React: from(siReact, "React"),
  "Next.js": from(siNextdotjs, "Next.js"),
  TypeScript: from(siTypescript, "TypeScript"),
  JavaScript: from(siJavascript, "JavaScript"),
  "Node.js": from(siNodedotjs, "Node.js"),
  Go: from(siGo, "Go"),
  Gin: from(siGin, "Gin"),
  GORM: from(siGo, "GORM"),
  PostgreSQL: from(siPostgresql, "PostgreSQL"),
  pgvector: from(siPostgresql, "pgvector"),
  Docker: from(siDocker, "Docker"),
  Python: from(siPython, "Python"),
  FastAPI: from(siFastapi, "FastAPI"),
  Pydantic: from(siPydantic, "Pydantic"),
  pytest: from(siPytest, "pytest"),
  "Redux Toolkit": from(siRedux, "Redux Toolkit"),
  "Tailwind CSS": from(siTailwindcss, "Tailwind CSS"),
  "Material UI": from(siMui, "Material UI"),
  "styled-components": from(siStyledcomponents, "styled-components"),
  ECharts: from(siApacheecharts, "ECharts"),
  Zod: from(siZod, "Zod"),
  MongoDB: from(siMongodb, "MongoDB"),
  MySQL: from(siMysql, "MySQL"),
  Firebase: from(siFirebase, "Firebase"),
  Jenkins: from(siJenkins, "Jenkins"),
  "GitHub Actions": from(siGithubactions, "GitHub Actions"),
  Nginx: from(siNginx, "Nginx"),
  Vercel: from(siVercel, "Vercel"),
  "Google Cloud": from(siGooglecloud, "Google Cloud"),
  Git: from(siGit, "Git"),
  Express: from(siExpress, "Express"),
  "Socket.IO": from(siSocketdotio, "Socket.IO"),
  Stripe: from(siStripe, "Stripe"),
  Qdrant: from(siQdrant, "Qdrant"),
  "Gemini API": from(siGooglegemini, "Gemini API"),
};

/** Returns logo data or null when the brand has no mark (e.g. AWS) or is a concept. */
export function techIcon(name: string): TechIconData | null {
  return map[name] ?? null;
}
