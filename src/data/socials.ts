import type { Social } from "@/types";

export const socials: Social[] = [
  {
    name: "GitHub",
    href: "https://github.com/dawnbreaker88",
    icon: "lucide:github",
    handle: "@dawnbreaker88",
    blurb: "Follow my open-source repositories and experimental projects.",
    profile: {
      name: "dawnbreaker88",
      handle: "@dawnbreaker88",
      bio: "Computer Science student building software, exploring AI, and developing full-stack systems.",
      location: "India",
      avatar: "/gitpfp.jpg",
      // static numbers; update manually
      stats: [
        { label: "Repositories", value: "25" },
        
      ],
    },
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/vankaprabhath",
    icon: "lucide:linkedin",
    handle: "in/vankaprabhath",
    blurb: "Connect for professional collaborations and engineering opportunities.",
    profile: {
      name: "Vanka Prabhath",
      handle: "in/vankaprabhath",
      bio: "UG AIML student & full-stack systems builder interested in distributed systems and AI.",
      location: "India",
      avatar: "/link.jpg",
      // static numbers; update manually
      stats: [
        { label: "Connections", value: "500+" },
      ],
    },
  },
  {
    name: "X",
    href: "https://x.com/dawnbreaker88",
    icon: "simple-icons:x",
    handle: "@dawnbreaker88",
    blurb: "Thoughts on systems engineering, generative models, and software design.",
    profile: {
      name: "Prabs.",
      handle: "@dawnbreaker88",
      bio: "Thoughts on systems engineering, generative models, and software design.",
      location: "India",
      avatar: "/tenma.jpeg",
      // static numbers; update manually
      
    },
  },
  {
    name: "Email",
    href: "mailto:vankaprabhath@gmail.com",
    icon: "lucide:mail",
    handle: "vankaprabhath@gmail.com",
    blurb: "Drop me an email directly for inquiries or quick chats.",
    profile: {
      name: "Prabhath",
      handle: "vankaprabhath@gmail.com",
      bio: "Feel free to reach out directly for engineering collaborations, questions, or technical opportunities.",
      location: "Replies within 24 hours",
      locationIcon: "lucide:clock",
     
      stats: [
        { label: "Response", value: "< 24h" },
        { label: "Status", value: "Open" },
      ],
    },
  },
  {
    name: "Resume",
    href: "/resume/Prabhath_Resume%20(3).pdf",
    icon: "lucide:file-text",
    handle: "Prabhath_Resume.pdf",
    blurb: "View or download my full curriculum vitae and experience overview.",
    profile: {
      name: "Prabhath's Resume",
      handle: "PDF • Updated 2026",
      bio: "AI/ML engineering student focused on building practical machine learning, intelligent agents, and full-stack systems.",
      location: "Click to open & view PDF",
      locationIcon: "lucide:file-down",
      stats: [
        { label: "Format", value: "PDF" },
        { label: "Updated", value: "2026" },
      ],
    },
  },
];
