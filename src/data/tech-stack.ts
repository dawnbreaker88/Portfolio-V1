import type { TechItem } from "@/types";

export const techStack: TechItem[] = [
  // Languages
// Languages
  { name: "Python", icon: "logos:python", group: "languages" },
  { name: "C", icon: "logos:c", group: "languages" },
  { name: "C++", icon: "logos:c-plusplus", group: "languages" },
  { name: "Java", icon: "logos:java", group: "languages" },
  { name: "JavaScript", icon: "logos:javascript", group: "languages" },
  { name: "TypeScript", icon: "logos:typescript-icon", group: "languages" },

  // Frontend
  { name: "React", icon: "logos:react", group: "frontend" },
  { name: "Next.js", icon: "ri:nextjs-fill", group: "frontend" },
  { name: "Tailwind CSS", icon: "logos:tailwindcss-icon", group: "frontend" },

  // Backend & APIs
  { name: "Node.js", icon: "logos:nodejs-icon", group: "backend" },
  { name: "Express.js", icon: "simple-icons:express", group: "backend" },
  { name: "FastAPI", icon: "logos:fastapi", group: "backend" },
  { name: "GraphQL", icon: "logos:graphql", group: "backend" },
  { name: "gRPC", icon: "logos:grpc", group: "backend" },

  // Data Science & Machine Learning
  { name: "NumPy", icon: "logos:numpy", group: "ai" },
  { name: "Pandas", icon: "logos:pandas", group: "ai" },
  { name: "Matplotlib", icon: "logos:matplotlib-icon", group: "ai" },
  { name: "scikit-learn", icon: "devicon:scikitlearn", group: "ai" },
  { name: "PyTorch", icon: "logos:pytorch-icon", group: "ai" },
  { name: "TensorFlow", icon: "logos:tensorflow", group: "ai" },
  { name: "Keras", icon: "devicon:keras", group: "ai" },
  { name: "Hugging Face", icon: "logos:hugging-face-icon", group: "ai" },

  // Databases & Caching
  { name: "PostgreSQL", icon: "logos:postgresql", group: "databases" },
  { name: "Redis", icon: "logos:redis", group: "databases" },

  // Infrastructure & DevOps
  { name: "Docker", icon: "logos:docker-icon", group: "devops" },
  { name: "Kubernetes", icon: "logos:kubernetes", group: "devops" },
  { name: "AWS", icon: "logos:aws", group: "devops" },
  { name: "Linux", icon: "logos:linux-tux", group: "devops" },
  { name: "Git", icon: "logos:git-icon", group: "devops" },
  { name: "CI/CD", icon: "mdi:infinity", group: "devops" },
];
