import type { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "linkshub",
    title: "LinksHub",
    summary:
      "An AI-powered developer portfolio and link-in-bio platform with GitHub project import, click analytics, QR sharing, and a RAG-based assistant.",
    about:
      "LinksHub goes beyond a Linktree alternative: it combines profile links, GitHub integration, project showcasing, analytics, and an AI assistant in one place. Developers get a personalized domain, live repository statistics, and interactive visitor chat.",
    highlights: [
      "TODO: Automated GitHub repository import & sync engine",
      "TODO: Sub-150ms vector-indexed RAG assistant for visitors",
      "TODO: Real-time telemetry dashboard with dynamic QR sharing",
    ],
    image: "/projects/linkshub.jpg",
    imageAlt: "Dashboard interface of LinksHub developer portfolio",
    context:
      "A complete developer identity workspace integrating GitHub repository sync, custom domain routing, visitor telemetry, and an embedded conversational assistant trained on developer profile data.",
    details: [
      "Engineered with Next.js App Router, React, and Tailwind CSS for sub-100ms client navigation.",
      "Implemented GitHub OAuth and automated repository metadata extraction via Octokit.",
      "Embedded a RAG-powered chatbot utilizing vector search for instant visitor question answering.",
      "Integrated real-time click and impression analytics with exportable telemetry dashboards.",
    ],
    stack: [
      { name: "React", icon: "logos:react" },
      { name: "Next.js", icon: "logos:nextjs-icon" },
      { name: "TypeScript", icon: "logos:typescript-icon" },
      { name: "Tailwind CSS", icon: "logos:tailwindcss-icon" },
      { name: "PostgreSQL", icon: "logos:postgresql" },
      { name: "MongoDB", icon: "logos:mongodb-icon" },
      { name: "Docker", icon: "logos:docker-icon" },
    ],
    status: "live",
    category: "web",
    year: "2026",
    featured: true,
    liveUrl: "https://linkshub.example.com",
    repoUrl: "https://github.com/prabhath/linkshub",
    draft: false,
  },
  {
    slug: "bidding-wars",
    title: "Bidding Wars",
    summary:
      "A real-time online auction platform where users create auctions, bid live over WebSockets, chat in auction rooms, and pay securely.",
    about:
      "High-concurrency auction engine engineered with distributed WebSockets, optimistic UI updates, anti-sniping bid extensions, and automated escrow payouts via Stripe.",
    highlights: [
      "TODO: Distributed WebSocket bidding engine over Redis pub/sub",
      "TODO: Atomic anti-sniping protection with auto timer extension",
      "TODO: Instant escrow settlement pipeline via Stripe integration",
    ],
    image: "/projects/bidding-wars.jpg",
    imageAlt: "Live auction room interface of Bidding Wars",
    context:
      "An event-driven real-time auction marketplace featuring synchronized millisecond bidding timers, dynamic room chat, and anti-sniping protection algorithms.",
    details: [
      "Built resilient bidirectional WebSocket event streams using Socket.io and Redis pub/sub.",
      "Implemented atomic bid validation and anti-sniping auto-extension mechanisms.",
      "Integrated secure payment processing with escrow release via Stripe.",
      "Engineered optimistic state updates with zero screen jitter during rapid bidding.",
    ],
    stack: [
      { name: "React", icon: "logos:react" },
      { name: "TypeScript", icon: "logos:typescript-icon" },
      { name: "Node.js", icon: "logos:nodejs-icon" },
      { name: "Tailwind CSS", icon: "logos:tailwindcss-icon" },
      { name: "MongoDB", icon: "logos:mongodb-icon" },
      { name: "Docker", icon: "logos:docker-icon" },
    ],
    status: "live",
    category: "web",
    year: "2026",
    featured: true,
    liveUrl: "https://biddingwars.example.com",
    repoUrl: "https://github.com/prabhath/bidding-wars",
    draft: false,
  },
  {
    slug: "voice-rag",
    title: "Voice RAG",
    summary:
      "Sub-150ms voice conversational assistant with retrieval-augmented generation over private documents and audio streaming.",
    about:
      "An offline-first voice agent pipeline that combines streaming Whisper speech-to-text, local vector similarity search, and high-fidelity speech synthesis for instantaneous domain-specific vocal answers.",
    highlights: [
      "TODO: End-to-end voice latency under 150ms on edge hardware",
      "TODO: Local Whisper & vector search pipeline for private docs",
      "TODO: Server-Sent Events audio streaming with real-time VAD",
    ],
    image: "/projects/voice-rag.jpg",
    imageAlt: "Voice conversational RAG dashboard with real-time waveform",
    context:
      "An ultra-low latency conversational AI engine designed for voice-driven enterprise search, operating locally with complete data privacy.",
    details: [
      "Engineered streaming audio chunking pipeline with sub-100ms VAD response.",
      "Integrated hybrid lexical and vector retrieval across embedded technical documentation.",
      "Developed custom FastAPI streaming endpoints with Server-Sent Events (SSE).",
      "Created an animated real-time waveform canvas visualizing audio frequency spectrums.",
    ],
    stack: [
      { name: "Python", icon: "logos:python" },
      { name: "PyTorch", icon: "logos:pytorch-icon" },
      { name: "FastAPI", icon: "logos:fastapi" },
      { name: "React", icon: "logos:react" },
      { name: "TypeScript", icon: "logos:typescript-icon" },
    ],
    status: "live",
    category: "ml",
    year: "2026",
    featured: true,
    liveUrl: "https://voicerag.example.com",
    repoUrl: "https://github.com/prabhath/voice-rag",
    draft: false,
  },
  {
    slug: "cloud-studio",
    title: "Cloud Studio",
    summary:
      "A browser-native lightweight IDE with WebContainers, multi-language LSP, collaborative multiplayer canvas, and containerized dev environments.",
    about:
      "Built for instant zero-install coding environments directly in the browser. Features language server protocol integration via WebWorkers, terminal emulator, and real-time cursor collaboration via CRDTs.",
    highlights: [
      "TODO: Zero-install browser IDE running in WebAssembly sandbox",
      "TODO: Multi-language LSP web workers with Monaco editor",
      "TODO: Real-time multiplayer peer-to-peer editing via Yjs CRDTs",
    ],
    image: "/projects/cloud-studio.jpg",
    imageAlt: "Cloud Studio browser IDE code editor and terminal",
    context:
      "A high-performance cloud development environment running Node.js and Linux utilities directly inside browser WebAssembly sandboxes.",
    details: [
      "Integrated Monaco editor with client-side Language Server Protocol (LSP) web workers.",
      "Implemented Xterm.js terminal integration with WebContainer POSIX execution.",
      "Added real-time peer-to-peer multiplayer cursor editing via Yjs CRDTs.",
      "Achieved sub-second cold starts with zero cloud compute infrastructure costs.",
    ],
    stack: [
      { name: "TypeScript", icon: "logos:typescript-icon" },
      { name: "React", icon: "logos:react" },
      { name: "Docker", icon: "logos:docker-icon" },
      { name: "Tailwind CSS", icon: "logos:tailwindcss-icon" },
    ],
    status: "in-progress",
    category: "systems",
    year: "2026",
    featured: false,
    liveUrl: "https://cloudstudio.example.com",
    repoUrl: "https://github.com/prabhath/cloud-studio",
    draft: false,
  },
];
