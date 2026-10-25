import type { TechItem } from "@/types";

export const techStack: TechItem[] = [
  // Languages
  { name: "Python", icon: "logos:python", group: "languages" },
  { name: "TypeScript", icon: "logos:typescript-icon", group: "languages" },
  { name: "JavaScript", icon: "logos:javascript", group: "languages" },

  // Frontend
  { name: "React", icon: "logos:react", group: "frontend" },
  { name: "Next.js", icon: "ri:nextjs-fill", group: "frontend" },
  { name: "Tailwind CSS", icon: "logos:tailwindcss-icon", group: "frontend" },

  // Backend
  { name: "Node.js", icon: "logos:nodejs-icon", group: "backend" },
  { name: "FastAPI", icon: "logos:fastapi", group: "backend" },

  // Databases
  { name: "PostgreSQL", icon: "logos:postgresql", group: "databases" },
  { name: "Redis", icon: "logos:redis", group: "databases" },

  // DevOps & Cloud
  { name: "Docker", icon: "logos:docker-icon", group: "devops" },
  { name: "Git", icon: "logos:git-icon", group: "devops" },

  // AI & Machine Learning
  { name: "PyTorch", icon: "logos:pytorch-icon", group: "ai" },
  { name: "Hugging Face", icon: "logos:hugging-face-icon", group: "ai" },
];
