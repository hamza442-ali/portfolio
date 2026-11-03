import type { ReactNode } from "react";
import { Arrow, Box, Chip, Cylinder, Diagram, Group, Note } from "./svg";

/**
 * Architecture drawings for projects that have no screenshots. Every box and
 * label is backed by the project description in `src/content/projects.ts`;
 * nothing here claims a feature the project does not have.
 */

export function FastApiLlmArchitecture() {
  return (
    <Diagram
      title="FastAPI LLM Backend · request path"
      subtitle="Learning build · Python · FastAPI · Pydantic · Gemini API · pytest"
      label="FastAPI LLM backend architecture. A client sends HTTP requests to a FastAPI app with four routes: GET /health, POST /chat, POST /chat/stream and POST /extract. Pydantic schemas validate requests and type responses, returning 422 on bad input. A typed LLM service makes async calls to the Gemini API with a per-request timeout and retry with exponential backoff, streams tokens for /chat/stream and parses structured output for /extract. Responses and streams go back to the client. A pytest suite drives the app through FastAPI TestClient with the LLM calls mocked."
    >
      {/* Clients */}
      <Box x={40} y={150} w={220} h={110} tone="neutral" title="Client" subtitle="curl, frontend or script" lines={["JSON over HTTP"]} />
      <Box
        x={40}
        y={440}
        w={220} h={150}
        tone="emerald"
        title="pytest suite"
        lines={["FastAPI TestClient", "LLM calls mocked", "bad-input and error cases"]}
      />

      {/* FastAPI app */}
      <Group x={320} y={110} w={500} h={510} label="FastAPI app · async" tone="accent" />
      <Box
        x={340}
        y={150}
        w={220}
        h={160}
        tone="accent"
        title="Routes"
        mono
        lines={["GET   /health", "POST  /chat", "POST  /chat/stream", "POST  /extract"]}
      />
      <Box
        x={590}
        y={150}
        w={210}
        h={160}
        tone="accent"
        title="Pydantic schemas"
        lines={["request validation", "typed responses", "422 on bad input"]}
      />
      <Box
        x={340}
        y={380}
        w={460}
        h={200}
        tone="violet"
        title="LLM service"
        subtitle="treats the model like any unreliable dependency"
        lines={[
          "async call with a per-request timeout",
          "retry with exponential backoff",
          "token streaming → server-sent events for /chat/stream",
          "structured output parsing for /extract",
        ]}
      />

      {/* External */}
      <Box
        x={900}
        y={400}
        w={260}
        h={150}
        tone="pink"
        tag="external"
        title="Gemini API"
        lines={["Google's hosted LLM", "errors and timeouts", "mapped to clean HTTP replies"]}
      />

      {/* Flows */}
      <Arrow points={[[260, 205], [340, 205]]} label="HTTP" tone="accent" />
      <Arrow points={[[560, 230], [590, 230]]} tone="accent" />
      <Arrow points={[[695, 310], [695, 380]]} label="typed request" tone="accent" dx={60} />
      <Arrow points={[[800, 450], [900, 450]]} label="request" tone="pink" dy={-18} />
      <Arrow points={[[900, 500], [800, 500]]} label="tokens / JSON" tone="pink" dashed dy={18} />
      <Arrow points={[[340, 420], [200, 420], [200, 260]]} label="response or stream" tone="violet" dashed at={0.35} dy={-18} />
      <Arrow points={[[260, 515], [340, 515]]} label="TestClient" tone="emerald" dy={-18} />

      <Note x={1160} y={640} text="Learning build: the goal was reliability around the model, not the model itself." anchor="end" />
    </Diagram>
  );
}

export function LoadBalancerArchitecture() {
  return (
    <Diagram
      title="Load Balancer · request distribution"
      subtitle="Personal project · Node.js · Express · MySQL · AWS"
      label="Load balancer architecture. Three clients send HTTP requests to a Node.js and Express load balancer. Its request router picks a backend from the healthy pool. A session persistence module keeps each client on the same backend (sticky sessions). A health checker runs periodic checks against the backend servers and removes unhealthy upstreams from rotation. Requests are forwarded to backend servers 1 and 2; backend 3 is marked unhealthy and out of rotation. The backend servers share a MySQL data store. Everything runs on AWS."
    >
      {/* Clients */}
      <Box x={40} y={170} w={170} h={80} tone="neutral" title="Client A" subtitle="session a1" />
      <Box x={40} y={300} w={170} h={80} tone="neutral" title="Client B" subtitle="session b7" />
      <Box x={40} y={430} w={170} h={80} tone="neutral" title="Client C" subtitle="new session" />

      {/* Balancer */}
      <Group x={270} y={110} w={480} h={510} label="Node.js / Express load balancer" tone="accent" />
      <Box
        x={290}
        y={150}
        w={440}
        h={110}
        tone="accent"
        title="Request router"
        lines={["accepts incoming HTTP requests", "picks a backend from the healthy pool"]}
      />
      <Box
        x={290}
        y={300}
        w={228}
        h={150}
        tone="violet"
        title="Session persistence"
        lines={["sticky sessions", "same client → same backend", "session ↔ backend map"]}
      />
      <Box
        x={533}
        y={300}
        w={207}
        h={150}
        tone="emerald"
        title="Health checker"
        lines={["periodic checks", "unhealthy upstream", "drops out of rotation"]}
      />
      <Box x={290} y={490} w={450} h={100} tone="accent" title="Healthy pool" />
      <Chip x={385} y={560} text="backend 1 ● up" tone="emerald" align="middle" />
      <Chip x={515} y={560} text="backend 2 ● up" tone="emerald" align="middle" />
      <Chip x={648} y={560} text="backend 3 ○ out" tone="amber" align="middle" />

      {/* Backends */}
      <Group x={800} y={110} w={360} h={510} label="Backend servers · AWS" tone="violet" />
      <Box x={820} y={160} w={300} h={90} tone="violet" title="Backend 1" subtitle="application server" />
      <Box x={820} y={290} w={300} h={90} tone="violet" title="Backend 2" subtitle="application server" />
      <Box x={820} y={420} w={300} h={90} tone="amber" tag="unhealthy" title="Backend 3" subtitle="failing health checks" />
      <Cylinder x={930} y={530} w={190} h={80} tone="neutral" title="MySQL" lines={["shared data store"]} />
      {/* data bus from backends to MySQL */}
      <path d="M1120 205 H1140 V570 M1120 335 H1140 M1120 465 H1140" fill="none" stroke="#8a90a5" strokeOpacity="0.6" strokeWidth="1.5" />
      <Arrow points={[[1140, 570], [1122, 570]]} tone="neutral" />

      {/* Flows */}
      <Arrow points={[[210, 210], [290, 190]]} tone="accent" label="HTTP" dy={-16} />
      <Arrow points={[[210, 340], [290, 210]]} tone="accent" />
      <Arrow points={[[210, 470], [290, 232]]} tone="accent" />
      <Arrow points={[[515, 260], [515, 300]]} tone="violet" />
      <Arrow points={[[632, 450], [632, 490]]} tone="emerald" />
      <Arrow points={[[397, 450], [397, 490]]} tone="violet" />
      <Arrow points={[[730, 205], [820, 205]]} label="A, C → forward" tone="accent" dy={-18} />
      <Arrow points={[[730, 235], [780, 235], [780, 335], [820, 335]]} label="B → forward" tone="accent" at={0.1} dx={15} dy={18} />
      <Arrow points={[[740, 380], [775, 380], [775, 465], [820, 465]]} label="health checks" tone="emerald" dashed at={0.4} dx={-8} />

      <Note x={1160} y={650} text="Prototype of traffic distribution; backend count is illustrative." anchor="end" />
    </Diagram>
  );
}

export function SemanticSearchArchitecture() {
  return (
    <Diagram
      title="Semantic Search · indexing, retrieval and evaluation"
      subtitle="In progress · Python · PostgreSQL · pgvector · Sentence Transformers"
      label="Semantic search architecture in three lanes. Indexing: documents are split into chunks with their metadata, embedded locally with a sentence-transformers model, and stored in a PostgreSQL chunks table with a pgvector embedding column and an HNSW index using cosine distance. Retrieval: a query is combined with metadata filters and a top-k limit, embedded with the same model, and PostgreSQL returns the nearest chunks ordered by cosine distance. Evaluation: a labelled query set is compared with the ranked results to compute Recall at k and MRR, answering whether retrieval is actually good."
    >
      {/* Lanes */}
      <Group x={40} y={100} w={1120} h={165} label="1 · Indexing" tone="accent" />
      <Group x={40} y={280} w={1120} h={165} label="2 · Retrieval" tone="violet" />
      <Group x={40} y={460} w={1120} h={185} label="3 · Evaluation" tone="emerald" />

      {/* Indexing */}
      <Box x={60} y={135} w={160} h={110} tone="accent" title="Documents" subtitle="text sources" />
      <Box x={270} y={135} w={190} h={110} tone="accent" title="Chunker" lines={["split into chunks", "keep source metadata"]} />
      {/* Embedding model spans lanes 1 and 2 */}
      <Box
        x={540}
        y={135}
        w={220}
        h={290}
        tone="pink"
        title="Embedding model"
        subtitle="sentence-transformers, local"
        lines={["one vector per chunk", "same model for queries", "no external API"]}
      />
      <Cylinder x={840} y={135} w={300} h={290} tone="amber" title="PostgreSQL + pgvector" lines={["chunks(id, doc_id, text,", "metadata, embedding)", "HNSW index · cosine"]} />

      {/* Retrieval */}
      <Box x={60} y={315} w={160} h={110} tone="violet" title="Query" subtitle="natural language" />
      <Box x={270} y={315} w={190} h={110} tone="violet" title="Query builder" lines={["metadata filters", "top-k limit"]} />

      {/* Evaluation */}
      <Box x={60} y={495} w={220} h={120} tone="emerald" title="Labelled query set" lines={["query → relevant chunks", "held-out for scoring"]} />
      <Box x={330} y={495} w={300} h={130} tone="emerald" title="Metrics" lines={["Recall@k", "MRR · mean reciprocal rank", "answers: is retrieval good?"]} />
      <Box x={840} y={495} w={300} h={100} tone="violet" title="Top-k chunks" subtitle="ranked by cosine distance" />

      {/* Flows */}
      <Arrow points={[[220, 190], [270, 190]]} tone="accent" />
      <Arrow points={[[460, 190], [540, 190]]} tone="accent" label="chunks" dy={-18} />
      <Arrow points={[[760, 190], [840, 190]]} tone="accent" label="vectors" dy={-18} />
      <Arrow points={[[220, 370], [270, 370]]} tone="violet" />
      <Arrow points={[[460, 370], [540, 370]]} tone="violet" label="filters" dy={-18} />
      <Arrow points={[[760, 370], [840, 370]]} tone="violet" label="k nearest" dy={-18} />
      <Arrow points={[[990, 425], [990, 495]]} tone="violet" label="ORDER BY distance LIMIT k" dx={-115} dy={-7} />
      <Arrow points={[[840, 545], [630, 545]]} tone="emerald" label="ranked results" dy={-18} />
      <Arrow points={[[280, 555], [330, 555]]} tone="emerald" />
      <Arrow points={[[215, 495], [215, 425]]} tone="emerald" dashed label="queries" dx={45} dy={-7} />

      <Note x={1160} y={660} text="In progress: evaluation harness is the current focus." anchor="end" />
    </Diagram>
  );
}

export interface ProjectDiagram {
  node: ReactNode;
  alt: string;
  caption: string;
}

/** Diagram per project id, used by the project cards. */
export const projectDiagrams: Record<string, ProjectDiagram> = {
  "fastapi-llm-backend": {
    node: <FastApiLlmArchitecture />,
    alt: "Architecture diagram of the FastAPI LLM backend",
    caption: "Request path: routes → Pydantic validation → LLM service with timeouts, retries and streaming → Gemini API.",
  },
  "load-balancer": {
    node: <LoadBalancerArchitecture />,
    alt: "Architecture diagram of the Node.js load balancer",
    caption: "Clients → request router with sticky sessions and health checks → healthy backend servers on AWS.",
  },
  "semantic-search-pgvector": {
    node: <SemanticSearchArchitecture />,
    alt: "Architecture diagram of the semantic search project",
    caption: "Indexing, retrieval and evaluation lanes around a local embedding model and PostgreSQL + pgvector.",
  },
};
