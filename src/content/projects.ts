import type { Project } from "./types";

/**
 * Projects.
 *
 * Rules:
 * - `highlights` are what Ali personally did. `productCapabilities` describe the
 *   product or team build and are shown collapsed, never as individual authorship.
 * - No metrics without a source. No invented links.
 * - `images` are screenshots produced by `npm run images` from assets/source/.
 *   Only files that exist render; without any, a designed frame using `accent`
 *   is shown. The first image is the cover.
 */
export const projects: Project[] = [
  {
    id: "folionomics",
    title: "Folionomics",
    subtitle: "Multi-chain portfolio analytics",
    evidence: "Professional · team product",
    accent: ["#22d3ee", "#8b5cf6"],
    period: "2024 – 2026",
    featured: true,
    summary:
      "A product that pulls wallets, DeFi positions and charts from many chains into one view. I owned most of the Next.js frontend and contributed to the Go backend and the AI chat.",
    problem:
      "Crypto holdings are spread across wallets, chains and protocols, each with a different data format. Users want one clear picture of value, history and exposure.",
    highlights: [
      { icon: "layout", title: "Data-heavy UI", text: "Virtualized tables with sticky headers for thousands of positions." },
      { icon: "refresh", title: "Async refresh", text: "Job polling with loading, partial-update and retry states." },
      { icon: "share", title: "Sharing", text: "Public and private portfolio views with share links." },
      { icon: "server", title: "Go + RAG", text: "Gin/GORM service tasks and the Qdrant-backed AI chat." },
    ],
    productCapabilities: [
      "Tracks wallets across EVM networks, Solana and Bitcoin.",
      "Go (Gin) API with GORM and PostgreSQL normalises several providers.",
      "Background refresh jobs with persisted progress.",
      "Share links with expiry and revocation.",
      "AI chat grounded in the user's own portfolio via Qdrant embeddings.",
    ],
    tags: ["Next.js", "React", "TypeScript", "Redux Toolkit", "Go", "PostgreSQL", "Docker", "AWS", "Qdrant"],
    links: [{ label: "folionomics.com", href: "https://folionomics.com/", kind: "product" }],
    images: [
      {
        src: "/images/projects/folionomics/portfolio.webp",
        alt: "Folionomics portfolio page with a 30-day net-worth chart, wallet totals, allocation bar and the position book",
        caption: "Portfolio view: net worth over 30 days, allocation and the full position book across wallets.",
      },
      {
        src: "/images/projects/folionomics/allocation.webp",
        alt: "Allocation bar split by majors, stables and exchanges above a book table grouped by category with sparklines",
        caption: "Allocation and book, grouped by category and thesis, with 30-day sparklines.",
      },
      {
        src: "/images/projects/folionomics/trade.webp",
        alt: "Trade page with a TradingView ETH chart beside a swap panel showing the connected wallet balance",
        caption: "Trade page: TradingView chart next to a wallet-aware swap panel.",
      },
      {
        src: "/images/projects/folionomics/dashboard.webp",
        alt: "Interactive demo dashboard with a net-worth chart, time-range toggles and refresh, find positions and share actions",
        caption: "Interactive demo on the landing page with sample data.",
      },
      {
        src: "/images/projects/folionomics/landing.webp",
        alt: "Folionomics landing page headline: Your portfolio, organized",
        caption: "Landing page.",
      },
    ],
  },
  {
    id: "depease",
    title: "DepEase",
    subtitle: "Project management + one-click deployment for universities",
    evidence: "University team project",
    accent: ["#34d399", "#22d3ee"],
    period: "2023 – 2024",
    featured: true,
    summary:
      "Final-year project at FAST-NUCES. One platform for proposals, supervisors, sprints and evaluations, plus a pipeline that deploys any student project to a live URL.",
    problem:
      "Final-year projects meant scattered paperwork and evaluators installing student code locally just to review it.",
    highlights: [
      { icon: "rocket", title: "One-click deploy", text: "Webhook → Jenkins → Docker → AWS, ending in a live URL." },
      { icon: "workflow", title: "Academic workflow", text: "Proposals, supervisors, sprints and evaluations in one place." },
      { icon: "users", title: "Role-based access", text: "Students, panels, evaluators and admins each get their own view." },
      { icon: "check", title: "Outcome", text: "Reviewers open projects from a link instead of installing them." },
    ],
    productCapabilities: [
      "Proposal submission, supervisor assignment and approvals.",
      "Sprint and backlog tracking, calendars, announcements, feedback.",
      "Scheduling and rescheduling of evaluation panels.",
    ],
    tags: ["React", "Node.js", "Express", "MongoDB", "Docker", "Jenkins", "AWS EC2", "AWS ECR", "AWS ECS", "Nginx"],
    // TODO(ali): the project report on Google Drive returned 404 without login.
    links: [],
    images: [
      {
        src: "/images/projects/depease/deployments.webp",
        alt: "DepEase administrator deployments page with a Jenkins connection card and frontend and backend pipeline tabs",
        caption: "Deployments: connect Jenkins, then run the frontend or backend pipeline.",
      },
      {
        src: "/images/projects/depease/pipeline.webp",
        alt: "Pipeline details listing repository, branch, Jenkinsfile, build tool and a link to the last published application, with build history below",
        caption: "Pipeline details with repository, branch, Jenkinsfile and the last published app.",
      },
      {
        src: "/images/projects/depease/overview.webp",
        alt: "Administrator overview with project pulse showing 3 of 9 tasks complete and counts for projects, tasks and requirements",
        caption: "Administrator overview with project pulse and workspace counts.",
      },
      {
        src: "/images/projects/depease/tasks.webp",
        alt: "Student task board with pending, in-progress and completed columns, priorities and assignees",
        caption: "Student task board with priorities and assignees.",
      },
      {
        src: "/images/projects/depease/sign-in.webp",
        alt: "DepEase sign-in page with student, teacher and administrator tabs",
        caption: "Sign-in with separate student, teacher and administrator roles.",
      },
    ],
  },
  {
    id: "auditai",
    title: "AuditAI",
    subtitle: "Smart-contract audit workflow",
    evidence: "Personal project",
    accent: ["#f59e0b", "#f472b6"],
    period: "2024",
    summary: "Submit smart-contract audit requests, track them on a dashboard and read structured reports.",
    highlights: [
      { icon: "workflow", title: "Request → report", text: "Submission, status tracking and structured report views." },
      { icon: "server", title: "Full stack", text: "Next.js frontend, Node/Express API, MongoDB, deployed on AWS." },
    ],
    tags: ["Next.js", "Node.js", "Express", "MongoDB", "AWS"],
    links: [{ label: "Live demo", href: "https://auditai-rho.vercel.app/", kind: "live" }],
    images: [
      {
        src: "/images/projects/auditai/landing.webp",
        alt: "AuditAI landing page: smart contract auditing elevated with AI integration",
        caption: "Landing page.",
      },
      {
        src: "/images/projects/auditai/ai-audit.webp",
        alt: "AI Audit form where a contract can be pasted, uploaded or referenced by Etherscan link",
        caption: "AI audit form: paste a contract, upload a file or enter an Etherscan link.",
      },
      {
        src: "/images/projects/auditai/tokenomics.webp",
        alt: "Tokenomics section with a donut chart of the token distribution",
        caption: "Tokenomics section.",
      },
    ],
  },
  {
    id: "wyndham-heritage",
    title: "Wyndham Heritage",
    subtitle: "Hotel management & booking",
    evidence: "Personal project",
    accent: ["#fb7185", "#f59e0b"],
    period: "2024",
    summary: "Admin and guest areas, room availability, customer management, maps and a Stripe payment flow.",
    highlights: [
      { icon: "map", title: "Maps + payments", text: "Google Maps for location, Stripe for the booking checkout." },
      { icon: "users", title: "Two audiences", text: "Separate admin dashboard and guest booking experience." },
    ],
    tags: ["Next.js", "Node.js", "MySQL", "Tailwind CSS", "Stripe"],
    links: [{ label: "Live demo", href: "https://wyndham-heritage-frontend.vercel.app/", kind: "live" }],
    images: [
      {
        src: "/images/projects/wyndham-heritage/landing.webp",
        alt: "Wyndham Heritage landing page with a Book your stay button over a night-time campsite photo",
        caption: "Landing page with the booking call to action.",
      },
      {
        src: "/images/projects/wyndham-heritage/map.webp",
        alt: "About page with hotel description next to an embedded Google Map of the location",
        caption: "About page with the embedded Google Maps location.",
      },
      {
        src: "/images/projects/wyndham-heritage/restaurant.webp",
        alt: "Restaurant section with four dining option cards",
        caption: "Restaurant section.",
      },
    ],
  },
  {
    id: "momspreneur-match",
    title: "Momspreneur Match",
    subtitle: "Execution platform for a founder community",
    // TODO(ali): confirm the company this was built for, the period, and which parts you built personally.
    evidence: "Team product",
    accent: ["#f472b6", "#f59e0b"],
    period: "2026",
    summary:
      "Turns members' business goals into tracked, sequenced work, with collaboration pods for accountability and a live dashboard across the member base.",
    problem: "Members had goals but no structure to execute them, no accountability loop, and no visibility into who was progressing or stalling.",
    highlights: [
      { icon: "workflow", title: "Mission engine", text: "Converts a goal into tracked, sequenced tasks on a mission board." },
      { icon: "users", title: "Pods + AI assistant", text: "Peer accountability pods with chat, deliverables and an AI assistant for guidance and content." },
    ],
    productCapabilities: [
      "Mission engine converting goals into tracked, sequenced work.",
      "AI assistant for guidance and content refinement.",
      "Collaboration pods for peer accountability.",
      "Real-time progress and engagement dashboard.",
    ],
    tags: ["React", "Node.js", "AI assistant"],
    links: [],
    images: [
      {
        src: "/images/projects/momspreneur-match/dashboard.webp",
        alt: "Dashboard overview with mission, pod and discovery stat cards, recent activity and quick insights",
        caption: "Dashboard overview: missions, pods and discovery at a glance.",
      },
      {
        src: "/images/projects/momspreneur-match/pods.webp",
        alt: "Pod workspace with members, invite code, task tabs, pod chat, uploads, deliverables and a collaboration heatmap",
        caption: "Pod workspace: tasks, chat, deliverables and a collaboration heatmap.",
      },
      {
        src: "/images/projects/momspreneur-match/ai-tools.webp",
        alt: "AI tools page with the Niche Opportunity Finder assistant returning a structured business idea",
        caption: "AI tools: assistants for niche research, brand voice, scripts and grant writing.",
      },
      {
        src: "/images/projects/momspreneur-match/landing.webp",
        alt: "Momspreneur Match landing page: Find your business match, build your team",
        caption: "Landing page.",
      },
      {
        src: "/images/projects/momspreneur-match/features.webp",
        alt: "Features grid: AI-powered matching, pods for collaboration, business tools and funding assistance",
        caption: "Features section.",
      },
    ],
  },
  {
    id: "fastapi-llm-backend",
    title: "FastAPI LLM Backend",
    subtitle: "Typed, tested LLM API with streaming",
    evidence: "Learning build",
    accent: ["#2dd4bf", "#22d3ee"],
    period: "2026",
    summary: "A Python service on the Gemini API that treats the model like any unreliable dependency: validation, streaming, retries, tests.",
    highlights: [
      { icon: "zap", title: "Endpoints", text: "/health, /chat, /chat/stream and /extract for structured output." },
      { icon: "test", title: "Reliability", text: "Timeouts, backoff retries, bad-input handling, pytest coverage." },
    ],
    tags: ["Python", "FastAPI", "Pydantic", "Gemini API", "pytest"],
    links: [],
  },
  {
    id: "load-balancer",
    title: "Load Balancer",
    subtitle: "Node.js traffic distribution prototype",
    evidence: "Personal project",
    accent: ["#60a5fa", "#a78bfa"],
    period: "2023",
    summary: "Distributes requests across backend servers with health checks and session persistence.",
    highlights: [
      { icon: "gauge", title: "Health checks", text: "Unhealthy upstreams drop out of rotation automatically." },
      { icon: "shield", title: "Sticky sessions", text: "Session persistence keeps a client on the same backend." },
    ],
    tags: ["Node.js", "Express", "MySQL", "AWS"],
    links: [],
  },
  {
    id: "semantic-search-pgvector",
    title: "Semantic Search",
    subtitle: "Embeddings + pgvector, with evaluation",
    evidence: "In progress",
    accent: ["#a78bfa", "#f472b6"],
    period: "2026",
    inProgress: true,
    summary: "Local sentence-transformer embeddings in PostgreSQL with pgvector: chunking, filters, top-k retrieval, measured with Recall@k and MRR.",
    highlights: [
      { icon: "search", title: "Retrieval", text: "Cosine similarity, metadata filters, HNSW indexing." },
      { icon: "gauge", title: "Evaluation", text: "Recall@k and MRR to know whether retrieval is actually good." },
    ],
    tags: ["Python", "PostgreSQL", "pgvector", "Sentence Transformers"],
    links: [],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const otherProjects = projects.filter((p) => !p.featured);
