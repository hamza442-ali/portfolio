import type { SkillGroup } from "./types";

/**
 * Skills in four tabs. Each item carries a proof level instead of a percentage:
 *  - professional: used in paid production work
 *  - project: built personal or university projects with it
 *  - learning: actively studying
 * Names must exist in lib/tech-icons to get a logo (others get a generic mark).
 */
export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    title: "Frontend",
    blurb: "Data-heavy interfaces that stay fast.",
    items: [
      { name: "React", level: "professional" },
      { name: "Next.js", level: "professional" },
      { name: "TypeScript", level: "professional" },
      { name: "JavaScript", level: "professional" },
      { name: "Redux Toolkit", level: "professional" },
      { name: "Tailwind CSS", level: "professional" },
      { name: "Material UI", level: "professional" },
      { name: "styled-components", level: "professional" },
      { name: "ECharts", level: "professional" },
      { name: "Zod", level: "project" },
      { name: "wagmi / Reown", level: "professional", note: "Wallet connection in product context" },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    blurb: "APIs, services and the glue between them.",
    items: [
      { name: "Node.js", level: "professional" },
      { name: "Express", level: "professional" },
      { name: "Go", level: "professional" },
      { name: "Gin", level: "professional" },
      { name: "GORM", level: "professional" },
      { name: "REST APIs", level: "professional" },
      { name: "Python", level: "project" },
      { name: "FastAPI", level: "project" },
      { name: "Pydantic", level: "project" },
      { name: "Socket.IO", level: "project" },
      { name: "Stripe", level: "project" },
    ],
  },
  {
    id: "data-cloud",
    title: "Data & Cloud",
    blurb: "Storage, containers, pipelines and deployment.",
    items: [
      { name: "PostgreSQL", level: "professional" },
      { name: "MongoDB", level: "professional" },
      { name: "MySQL", level: "project" },
      { name: "Firebase", level: "project" },
      { name: "Docker", level: "professional" },
      { name: "AWS", level: "professional", note: "EC2, ECR, ECS" },
      { name: "Jenkins", level: "project" },
      { name: "GitHub Actions", level: "project" },
      { name: "Nginx", level: "project" },
      { name: "Vercel", level: "project" },
      { name: "Google Cloud", level: "project", note: "Cloud Run" },
      { name: "Git", level: "professional" },
    ],
  },
  {
    id: "ai",
    title: "AI",
    blurb: "LLM features that behave in production.",
    items: [
      { name: "RAG", level: "professional", note: "Contributed to a production RAG feature" },
      { name: "Qdrant", level: "professional" },
      { name: "Gemini API", level: "project" },
      { name: "Structured outputs", level: "project" },
      { name: "Streaming", level: "project" },
      { name: "Prompt design", level: "project" },
      { name: "pgvector", level: "learning" },
      { name: "Embeddings", level: "learning" },
      { name: "Retrieval evaluation", level: "learning" },
      { name: "Agents / MCP", level: "learning", note: "On the roadmap" },
    ],
  },
];

export const proofLevelMeta = {
  professional: { label: "Used professionally", short: "Pro" },
  project: { label: "Built projects with", short: "Built" },
  learning: { label: "Learning now", short: "Learning" },
} as const;
