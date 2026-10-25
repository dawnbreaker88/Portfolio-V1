import type { SiteConfig } from "@/types";

export const site: SiteConfig = {
  name: "Prabhath",
  tagline: "Building useful software and exploring AI.",
  taglines: [
    "Building useful software and exploring AI.",
    "Creative technologist & full-stack systems builder.",
    "Deep learning enthusiast & open-source developer.",
  ],
  identities: [
    {
      name: "Prabhath",
      title: "Building useful software and exploring AI.",
    },
    {
      name: "Prabhath",
      title: "Creative technologist & full-stack systems builder.",
    },
    {
      name: "Prabhath",
      title: "Deep learning enthusiast & open-source developer.",
    },
  ],
  url: "https://prabhath.dev",
  description:
    "Personal portfolio of Prabhath — Computer Science student building software, exploring AI, and developing full-stack systems.",
  bio: [
    "I'm Prabhath, a computer science student who enjoys building software, exploring AI, and learning new technologies. I like turning ideas into real products and solving problems that are useful and meaningful.",
    "Right now, I'm focused on full-stack development, deep learning, and building projects that combine both. I'm always open to learning, collaborating, and working on ideas that make a real impact.",
  ],
  // Banner config: swap between ASCII procedural art ("tokyo" | "kyoto" | "aurora" | "black"),
  // animated GIF banners ("/banner.gif"), or static images ("/banner.webp" | "/banner.png")
  banner: {
    type: "ascii",
    variant: "tokyo",
    alt: "Tokyo Rain cyberpunk ASCII simulation",
    // Examples to easily swap:
    // type: "gif", src: "/banner.gif", alt: "Animated GIF banner",
    // type: "image", src: "/banner.webp", alt: "Static banner image",
    // type: "ascii", variant: "kyoto", alt: "Kyoto Dusk ASCII scene",
  },
  avatar: "/boby.jpeg",
  avatars: [
    "/boby.jpeg",
    "/tenma.jpeg",
   
  ],
  githubUser: "prabhath",
  nav: [
    { id: "home", label: "Home", icon: "lucide:home" },
    { id: "projects", label: "Projects", icon: "lucide:folders" },
    { id: "experience", label: "Experience", icon: "lucide:briefcase" },
    { id: "tech-stack", label: "Tech stack", icon: "lucide:wrench" },
    { id: "achievements", label: "Achievements", icon: "lucide:trophy" },
  ],
};
