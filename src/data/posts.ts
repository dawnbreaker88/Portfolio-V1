import type { Post } from "@/types";

export const posts: Post[] = [
  {
    title: "Linear Regression from Scratch",
    date: "2026-02-14",
    summary:
      "Deriving ordinary least squares, understanding the math behind gradient descent, and building a linear model from the ground up without high-level libraries.",
    href: "https://dawnbreaker88.github.io/blog/posts/linear/",
    tags: ["Machine Learning", "Python", "Math"],
    readingTime: "6 min",
    sourceLabel: "old blog",
    pinned: true,
  },
  {
    title: "How GPUs Accidentally Created Modern Intelligence",
    date: "2025-11-28",
    summary:
      "Tracing how fixed-function rasterizers transformed into general-purpose parallel matrix engines that power today's large language models.",
    href: "https://dawnbreaker88.github.io/blog/posts/virtual/",
    tags: ["Hardware", "Deep Learning", "Systems"],
    readingTime: "8 min",
    sourceLabel: "old blog",
  },
  {
    title: "The Best Windows Feature Isn't Made by Microsoft",
    date: "2025-08-15",
    summary:
      "How WSL2 bridges the gap between Windows ergonomics and native Linux performance, making systems development seamless across OS boundaries.",
    href: "https://dawnbreaker88.github.io/blog/posts/wsl/",
    tags: ["Linux", "Windows", "Workflow"],
    readingTime: "5 min",
    sourceLabel: "old blog",
  },
  {
    title: "The Code You Write is a Lie",
    date: "2025-07-03",
    summary:
      "Exploring the layers of abstraction between high-level programming syntax, compiler optimizations, out-of-order CPU execution, and raw silicon.",
    href: "https://dawnbreaker88.github.io/blog/posts/turing/",
    tags: ["Compilers", "Systems", "Abstractions"],
    readingTime: "7 min",
    sourceLabel: "old blog",
  },
];

export const isBlogVisible = posts.length >= 2;

