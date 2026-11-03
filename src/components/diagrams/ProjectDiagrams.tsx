import { Boxes, Cloud, Container, Database, GitBranch, Globe, Hammer, LayoutDashboard, Link2, Server } from "lucide-react";
import { FlowDiagram } from "./FlowDiagram";

/** Conceptual sketch of the Folionomics stack. Not a certified deployment diagram. */
export function FolionomicsArchitecture() {
  return (
    <FlowDiagram
      label="Folionomics architecture: Next.js frontend talks to a Go API backed by PostgreSQL, provider adapters and a retrieval-augmented AI path."
      stages={[
        {
          title: "Next.js / React / TypeScript app",
          caption: "My main area",
          tone: "accent",
          icon: <LayoutDashboard className="size-4" />,
          items: [
            "Redux Toolkit state and data hooks",
            "Dashboards, virtualized tables, charts and filters",
            "Wallet connection, public tracking and sharing",
            "API requests and refresh-job polling",
          ],
        },
        {
          title: "Go (Gin) portfolio API",
          caption: "Contributed",
          tone: "violet",
          icon: <Server className="size-4" />,
          items: [
            "Controller / service / repository layers",
            "GORM + PostgreSQL models",
            "Provider adapters and background refresh jobs",
            "Wallets, bundles, positions, history, sharing links",
            "AI path: embeddings → Qdrant → retrieval & reranking → LLM",
          ],
        },
        {
          title: "Providers & infrastructure",
          caption: "Team",
          tone: "neutral",
          icon: <Database className="size-4" />,
          items: ["Portfolio and market-data providers", "Container and cloud infrastructure"],
        },
      ]}
    />
  );
}

/** Simplified one-click deployment pipeline built for DepEase. */
export function DepEasePipeline() {
  return (
    <FlowDiagram
      direction="horizontal"
      label="DepEase deployment pipeline: a repository push triggers a GitHub webhook, Jenkins builds and tests, a Docker image is pushed to AWS ECR, deployed on AWS, and the live URL is shared with reviewers."
      stages={[
        { title: "Repository push", caption: "Student", tone: "neutral", icon: <GitBranch className="size-4" /> },
        { title: "GitHub webhook", tone: "neutral", icon: <Link2 className="size-4" /> },
        { title: "Jenkins build + tests", tone: "accent", icon: <Hammer className="size-4" /> },
        { title: "Docker image → ECR", tone: "accent", icon: <Container className="size-4" /> },
        { title: "Deploy on AWS", caption: "EC2 / ECS", tone: "violet", icon: <Cloud className="size-4" /> },
        { title: "Live URL for reviewers", tone: "violet", icon: <Globe className="size-4" /> },
      ]}
    />
  );
}

/** Keeps the icon import list honest for tree shaking. */
export const diagramIcons = { Boxes };
