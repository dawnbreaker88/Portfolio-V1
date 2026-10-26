import type { Project } from "@/types";

export const projects: Project[] = [

  {
    slug: "cardiotwin",
    title: "CardioTwin",
    summary:
      "A cardiovascular risk prediction platform that evaluates cardiac risk across chemotherapy treatment cycles using clinical parameters and longitudinal patient records.",
    about:
      "CardioTwin explores the use of machine learning for cardiovascular risk assessment during chemotherapy. It combines clinical indicators such as QTc, QRS, LVEF, and blood pressure with chemotherapy dosage and longitudinal patient records to estimate cardiac risk across treatment cycles.",
    highlights: [
      "Achieved 89% ROC-AUC on validation data for treatment-cycle risk prediction.",
      "Trained and evaluated XGBoost and LightGBM gradient boosting models.",
      "Built a longitudinal dashboard to compare cardiac biomarkers and predicted risk across chemotherapy cycles.",
    ],
    image: "/projects/cardio.png",
    imageAlt: "CardioTwin cardiovascular risk assessment dashboard",
    context:
      "A machine learning project focused on evaluating cardiovascular risk throughout chemotherapy treatment using clinical parameters, patient records, and longitudinal biomarker trends.",
    details: [
      "Developed cardiovascular risk prediction models using XGBoost and LightGBM.",
      "Used ECG parameters, LVEF, blood pressure, chemotherapy dosage, and longitudinal clinical records as model inputs.",
      "Evaluated model performance using ROC-AUC, achieving 89% on validation data.",
      "Built a Streamlit dashboard to compare cardiac biomarkers and predicted risk across multiple treatment cycles.",
    ],
    stack: [
      { name: "Python", icon: "logos:python" },
      { name: "XGBoost", icon: "carbon:decision-tree" },
      { name: "LightGBM", icon: "carbon:machine-learning-model" },
      { name: "Streamlit", icon: "logos:streamlit" },
    ],
    status: "live",
    category: "ml",
    year: "2026",
    featured: true,
    liveUrl: "",
    repoUrl: "",
    draft: false,
  },

  {
    slug: "loopers",
    title: "Loopers",
    summary:
      "A campus-focused quick-commerce platform bringing everyday essentials and on-demand document printing to college students.",
    about:
      "Loopers tackles a familiar campus problem: getting everyday essentials and printed documents without unnecessary hassle or expense. Inspired by quick-commerce platforms, it brings product ordering, checkout, document-printing requests, and order management into a single experience built around student needs.",
    highlights: [
      "Launched a student-focused platform used by 200+ students.",
      "Implemented 20+ features spanning authentication, ordering, printing, checkout, and analytics.",
      "Built a responsive React Progressive Web App with a Node.js backend and automated deployments.",
    ],
    image: "/projects/loopers.png",
    imageAlt: "Loopers campus quick-commerce platform",
    context:
      "A student-oriented quick-commerce platform designed around hyperlocal delivery and document printing, with customer-facing features and administrative workflows.",
    details: [
      "Developed a responsive React Progressive Web App for browsing products and placing orders.",
      "Built backend APIs using Express.js and MongoDB Atlas.",
      "Implemented JWT authentication and role-based access control.",
      "Developed product catalog, cart, checkout, order management, and document-printing workflows.",
      "Used Zustand for frontend state management.",
      "Integrated Cloudinary for media management and deployed through Render and Vercel.",
    ],
    stack: [
      { name: "React", icon: "logos:react" },
      { name: "Express.js", icon: "simple-icons:express" },
      { name: "MongoDB", icon: "logos:mongodb-icon" },
      { name: "Zustand", icon: "devicon:zustand" },
      { name: "Cloudinary", icon: "logos:cloudinary-icon" },
      { name: "Vercel", icon: "logos:vercel-icon" },
    ],
    status: "live",
    category: "web",
    year: "2026",
    featured: true,
    liveUrl: "https://loopersstore.vercel.app",
    repoUrl: "",
    draft: false,
  },

  {
    slug: "lenora",
    title: "Lenora",
    summary:
      "An agentic learning companion that helps students plan their studies, understand difficult concepts, and adapt through assessment.",
    about:
      "Lenora grew out of an interest in the challenges students face when managing coursework and understanding difficult concepts. Inspired by the Feynman technique, it connects study planning, interactive learning, and assessment into a unified workflow designed to make learning more structured and adaptive.",
    highlights: [
      "Designed an agentic workflow connecting study planning, concept learning, and assessment.",
      "Implemented retrieval-augmented generation to ground responses in uploaded learning resources.",
      "Structured student goals, tasks, topics, documents, and assessment results to support contextual learning.",
    ],
    image: "/projects/lenora.png",
    imageAlt: "Lenora AI-powered student learning platform",
    context:
      "An AI-powered student platform built around a connected learning loop: plan what to study, explore concepts, assess understanding, and use the results to guide subsequent learning.",
    details: [
      "Designed a Planner Agent to organize study tasks around student goals and available time.",
      "Developed a Feynman-inspired learning experience for explaining and exploring difficult concepts.",
      "Designed a Learner Agent to assess understanding and inform subsequent learning activities.",
      "Implemented a retrieval-augmented generation pipeline using uploaded learning resources.",
      "Structured student state across goals, tasks, topics, documents, and assessments.",
      "Built the application with Next.js, TypeScript, and a Node.js/Express backend backed by MongoDB.",
      "Used Google's Gen AI SDK for AI-powered functionality.",
    ],
    stack: [
      { name: "Next.js", icon: "logos:nextjs-icon" },
      { name: "TypeScript", icon: "logos:typescript-icon" },
      { name: "Node.js", icon: "logos:nodejs-icon" },
      { name: "Express.js", icon: "simple-icons:express" },
      { name: "MongoDB", icon: "logos:mongodb-icon" },
      { name: "Google Gemini", icon: "logos:google-gemini" },
    ],
    status: "in-progress",
    category: "ml",
    year: "2026",
    featured: true,
    liveUrl: "https://lenora-rho.vercel.app/",
    repoUrl: "https://github.com/dawnbreaker88/Lenora",
    draft: false,
  },

  {
    slug: "civicpulse",
    title: "CivicPulse",
    summary:
      "An AI-assisted civic issue platform that classifies citizen complaints and organizes local problems into structured categories.",
    about:
      "CivicPulse explores how AI can help make civic complaints easier to organize and understand. Inspired by the idea of bringing different signals into a shared view, the platform uses Gemini to classify free-text complaints into predefined categories, helping turn unstructured reports into more organized information.",
    highlights: [
      "Won second prize in a department-level hackathon.",
      "Presented the project at the INAE Conclave.",
      "Integrated Gemini API for AI-assisted civic complaint classification.",
    ],
    image: "/projects/civicpulse.png",
    imageAlt: "CivicPulse AI-assisted civic issue platform",
    context:
      "A civic issue aggregation platform that uses AI-assisted classification to organize free-text complaints into predefined categories.",
    details: [
      "Developed a responsive frontend using React.",
      "Used Firebase for application infrastructure.",
      "Integrated the Gemini API to classify free-text civic complaints into predefined issue categories.",
      "Presented the project at the INAE Conclave.",
      "Won second prize in a department-level hackathon.",
    ],
    stack: [
      { name: "React", icon: "logos:react" },
      { name: "Firebase", icon: "logos:firebase" },
      { name: "Google Gemini", icon: "logos:google-gemini" },
    ],
    status: "live",
    category: "ml",
    year: "2026",
    featured: true,
    liveUrl: "https://civicpulse-eight.vercel.app/",
    repoUrl: "",
    draft: false,
  },

  {
    slug: "heyy-dheeraj",
    title: "HeyyDheeraj",
    summary:
      "A personal website designed and built for a friend—and my first real step into designing web experiences from the ground up.",
    about:
      "HeyyDheeraj started as a personal website for a friend and became an opportunity to explore a side of development I hadn't focused on as much: design. Built with Next.js, TypeScript, and Tailwind CSS, it challenged me to think beyond functionality and pay attention to visual identity, layout, and the details that make a website feel personal.",
    highlights: [
      "Designed and developed my first personally designed website for a friend.",
      "Built the experience using Next.js, TypeScript, and Tailwind CSS.",
      "Explored the intersection of visual design, personal identity, and frontend development.",
    ],
    image: "/projects/heyydheeraj.png",
    imageAlt: "HeyyDheeraj personal website design",
    context:
      "A personal website project that gave me an opportunity to explore visual design and frontend craftsmanship while creating a distinct online presence for a friend.",
    details: [
      "Designed and developed a personal website using Next.js and TypeScript.",
      "Used Tailwind CSS to build and style the interface.",
      "Explored visual hierarchy, layout, and design choices to give the website its own identity.",
    ],
    stack: [
      { name: "Next.js", icon: "logos:nextjs-icon" },
      { name: "TypeScript", icon: "logos:typescript-icon" },
      { name: "Tailwind CSS", icon: "logos:tailwindcss-icon" },
    ],
    status: "live",
    category: "web",
    year: "2026",
    featured: false,
    liveUrl: "https://heyydheeraj.vercel.app",
    repoUrl: "",
    draft: false,
  },
  {
  slug: "servicedesk",
  title: "ServiceDesk",
  summary:
    "An AI-assisted IT service desk that brings ticket management, intelligent troubleshooting, and real-time support workflows together for small IT teams.",
  about:
    "ServiceDesk simplifies IT support for smaller teams that need practical service management without the complexity of heavyweight enterprise platforms. It brings ticket handling, incident tracking, and support workflows into one workspace, with AI-assisted diagnostics helping technicians investigate issues and move toward resolution.",
  highlights: [
    "Integrated Groq-powered AI assistance for analyzing technical issues and supporting troubleshooting.",
    "Combined ticket management and IT support workflows in a unified workspace.",
    "Used Socket.IO to support real-time communication and updates.",
  ],
  image: "/projects/servicedesk.png",
  imageAlt: "ServiceDesk IT support and ticket management dashboard",
  context:
    "A lightweight IT service management platform designed for small IT teams, combining conventional ticketing workflows with AI assistance and real-time updates.",
  details: [
    "Developed the application using React and TypeScript.",
    "Used MongoDB to manage application data.",
    "Integrated Groq for AI-assisted IT support functionality.",
    "Implemented Socket.IO for real-time communication and updates.",
    "Used Tailwind CSS to build a streamlined, responsive interface.",
  ],
  stack: [
    { name: "React", icon: "logos:react" },
    { name: "TypeScript", icon: "logos:typescript-icon" },
    { name: "MongoDB", icon: "logos:mongodb-icon" },
    { name: "Groq", icon: "logos:groq" },
    { name: "Socket.IO", icon: "logos:socket-io" },
    { name: "Tailwind CSS", icon: "logos:tailwindcss-icon" },
  ],
  status: "live",
  category: "ml",
  year: "2026",
  featured: true,
  liveUrl: "https://theservicedesk.vercel.app",
  repoUrl: "https://github.com/dawnbreaker88/ServiceDesk",
  draft: false,
},
];

