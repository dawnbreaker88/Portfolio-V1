import React from "react";
import type { SiteConfig } from "@/types";
import { HighlightText } from "@/components/highlight/highlight-text";

export const site: SiteConfig = {
  name: "Prabhath",
  tagline: "Building useful software and exploring AI.",
  taglines: [
    "Going deeper than the abstraction",
    "Exploring LLMs and AI agents",
    "Building things, understanding how they work",
  ],
  identities: [
    {
      name: "Prabhath",
      title: "AI, systems, and everything between",
    },
    {
      name: "Prabhath",
      title: "Creative technologist & full-stack systems builder.",
    },
    {
      name: "Prabhath",
      title: "Curious about everything",
    },
  ],
  url: "https://prabhath.dev",
  description:
    "Personal portfolio of Prabhath — Computer Science student building software, exploring AI, and developing full-stack systems.",
 
  bio: [
    <>
      I'm Prabhath, a 19-year-old student interested in AI, engineering, and the endless process of{" "}
      <HighlightText
        className="text-foreground"
        text="figuring things out"
        trigger="view"
      />
      .
    </>,

    <>
      I'm particularly curious about{" "}
      <HighlightText
        className="text-foreground"
        text="LLMs and AI agents"
        trigger="view"
      />{" "}
      how they work, what we can build with them, and where the technology can go. I enjoy going beneath the surface, exploring unfamiliar ideas, and{" "}
      <HighlightText
        className="text-foreground"
        text="turning curiosity into something tangible"
        trigger="view"
      />
      .
    </>,

    <>
      Beyond code, I'm drawn to design, music, and cinema. I like exploring different disciplines,{" "}
      <HighlightText
        className="text-foreground"
        text="connecting ideas that might seem unrelated"
        trigger="view"
      />
      , and seeing how perspectives from one field can inspire another.
    </>,

    "Still learning, still building, still figuring it all out.",
  ],

  // Banner config: swap between ASCII procedural art ("tokyo" | "kyoto" | "aurora" | "black"),
  // animated GIF banners ("/banner.gif"), or static images ("/banner.webp" | "/banner.png")
  banner: {
    type: "ascii",
    variant: "tokyo",
    alt: "Tokyo Rain cyberpunk ASCII simulation",
  },
  avatar: "/boby.jpeg",
  avatars: [
    
    "/tenma.jpeg",
  ],
  githubUser: "prabhath",
  nav: [
    { id: "home", label: "Home", icon: "lucide:home" },
    { id: "about", label: "About", icon: "lucide:user" },
    { id: "projects", label: "Projects", icon: "lucide:folder-git-2" },
    { id: "experience", label: "Experience", icon: "lucide:briefcase" },
    { id: "tech-stack", label: "Tech stack", icon: "lucide:wrench" },
    { id: "github-activity", label: "GitHub", icon: "lucide:git-commit" },
    { id: "highlights", label: "Highlights", icon: "lucide:sparkles" },
    { id: "cta", label: "Contact", icon: "lucide:mail" },
  ],
};
