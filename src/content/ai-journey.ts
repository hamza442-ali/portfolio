import type { AIJourneyTier } from "./types";

export const aiJourneyHeadline = "Practical AI on solid engineering.";

/** Three proof levels, rendered as distinct tiers. Strongest evidence first. */
export const aiJourney: AIJourneyTier[] = [
  {
    id: "applied",
    level: "professional",
    label: "Applied professionally",
    title: "RAG inside a real product",
    description:
      "Contributed to the Folionomics chat that answers questions from a user's own portfolio data, as part of the Gamma Labs team.",
    points: [
      "Wallet-scoped context embedded and stored in Qdrant",
      "Retrieval, reranking and context assembly before the model call",
      "Scoping, freshness and failure handling in a live app",
    ],
  },
  {
    id: "built",
    level: "project",
    label: "Built hands-on",
    title: "A typed, tested FastAPI backend",
    description: "A Python service on the Gemini API: validated inputs, structured outputs, streaming, retries and tests.",
    points: ["/health, /chat, /chat/stream, /extract", "Pydantic schemas, async calls, backoff retries", "pytest + FastAPI TestClient"],
  },
  {
    id: "learning",
    level: "learning",
    label: "Learning now",
    title: "Vector search and evaluation",
    description: "Semantic search with PostgreSQL + pgvector, and how to measure whether retrieval is actually good.",
    points: ["Chunking, cosine similarity, top-k, HNSW", "Hybrid retrieval and reranking", "Recall@k and MRR"],
  },
];

/** Roadmap only. Rendered dimmed and never as a skill badge. */
export const aiRoadmap = [
  "Production RAG assistant with evaluation",
  "Prompt-injection defence & observability",
  "Agent patterns & guarded tool execution",
  "LangGraph / agentic RAG",
  "Model Context Protocol (MCP)",
];
