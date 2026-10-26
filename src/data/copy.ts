export const copy = {
  topBar: {
    searchPlaceholder: "Search...",
    searchKbd: "⌘K",
    themeToggleAria: "Toggle theme",
  },
  sections: {
    about: {
      index: "01",
      title: "About",
    },
    projects: {
      index: "02",
      title: "Projects",
    },
    experience: {
      index: "03",
      title: "Experience",
    },
    techStack: {
      index: "04",
      title: "Tech stack",
    },
    githubActivity: {
      index: "05",
      title: "GitHub Activity",
    },
    highlights: {
      index: "06",
      title: "Highlights",
    },
  },
  cta: {
    headline: "Got something worth figuring out?",
    headlinePrefix: "Got something worth ",
    headlineSuffix: "?",
    subline: "I’m interested in ideas that sit between product, systems, and learning.",
    buttonDefault: "Let's talk",
    buttonHover: "Okay, let's talk",
    words: [
      {
        word: "figuring out",
        tip: "A hard problem? Send it over.",
        topic: "problem",
        starter: "Hey Prabhath, I've got a problem worth figuring out: ",
      },
      {
        word: "building",
        tip: "An idea that needs a builder?",
        topic: "build",
        starter: "Hey Prabhath, I'm working on building: ",
      },
      {
        word: "breaking",
        tip: "Something broken I could help fix?",
        topic: "fix",
        starter: "Hey Prabhath, I have something broken that could use your help: ",
      },
      {
        word: "reading",
        tip: "A paper or post I should read?",
        topic: "reading",
        starter: "Hey Prabhath, here's something you might enjoy reading: ",
      },
    ],
    // Optional availability pill (off by default; enable with copy.cta.availability = { label, tip })
    availability: undefined as { label: string; tip: string } | undefined,
  },
  projectDialog: {
    contextHeading: "Context & Overview",
    techStackHeading: "Tech Stack",
    liveDemo: "Live Demo",
    github: "GitHub",
    viewFullPage: "View full page",
  },
  contact: {
    title: "Get in touch",
    subtitle: "Feel free to reach out directly or send an email.",
    emailLabel: "Email directly",
  },
  status: {
    live: "Live",
    inProgress: "In Progress",
  },
  tabs: {
    all: "All",
    languages: "Languages",
    frontend: "Frontend",
    backend: "Backend",
    databases: "Databases",
    devops: "DevOps & Cloud",
    ai: "AI",
  },
} as const;
