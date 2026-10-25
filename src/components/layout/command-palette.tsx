"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useLenis } from "lenis/react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Icon } from "@/components/shared/icon";
import { projects } from "@/data/projects";
import { socials } from "@/data/socials";

export type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// Top-level site routes
const PAGES = [
  {
    name: "Home",
    path: "/",
    icon: "lucide:home",
    description: "Main portfolio overview and identity",
    keywords: ["home", "main", "overview", "landing", "profile"],
  },
  {
    name: "Projects",
    path: "/projects",
    icon: "lucide:folder-git-2",
    description: "Standalone showcase of systems and apps",
    keywords: ["projects", "apps", "portfolio", "work", "showcase", "systems"],
  },
  {
    name: "Blog",
    path: "/blog",
    icon: "lucide:book-open",
    description: "Articles, technical notes, and essays",
    keywords: ["blog", "writing", "articles", "essays", "posts", "reading"],
    badge: "Soon",
  },
  {
    name: "Favorites",
    path: "/favorites",
    icon: "lucide:bookmark",
    description: "Curated tools, software, books, and gear",
    keywords: ["favorites", "favourites", "tools", "gear", "bookmarks", "inspiration"],
    badge: "Soon",
  },
  {
    name: "Contact",
    path: "/contact",
    icon: "lucide:mail",
    description: "Direct messaging, email, and socials",
    keywords: ["contact", "email", "reach out", "message", "hire", "collaborate"],
  },
];

// Comprehensive On-Page Sections (Home View)
const SECTIONS = [
  {
    id: "home",
    name: "Profile & Identity",
    icon: "lucide:user",
    description: "Avatar, name, tagline, and intro",
    keywords: ["profile", "bio", "intro", "tagline", "avatar", "hero", "identity", "home"],
  },
  {
    id: "about",
    name: "About Prabhath",
    icon: "lucide:info",
    description: "Background, mindset, education, and interests",
    keywords: ["about", "story", "student", "background", "education", "mindset", "bio"],
  },
  {
    id: "projects",
    name: "Featured Projects",
    icon: "lucide:layers",
    description: "Selected software systems and web apps",
    keywords: ["featured", "work", "systems", "showcase", "grid", "projects"],
  },
  {
    id: "experience",
    name: "Work Experience",
    icon: "lucide:briefcase",
    description: "Career history, internships, and engineering roles",
    keywords: ["experience", "career", "work", "jobs", "internships", "employment", "resume", "cv"],
  },
  {
    id: "tech-stack",
    name: "Tech Stack & Tooling",
    icon: "lucide:wrench",
    description: "Languages, frameworks, and developer stack",
    keywords: ["tech", "stack", "skills", "tools", "technologies", "languages", "python", "react", "nextjs", "typescript"],
  },
  {
    id: "github-activity",
    name: "GitHub Activity",
    icon: "lucide:git-commit",
    description: "Commit frequency, contributions, and open source",
    keywords: ["github", "activity", "git", "commits", "contributions", "graph", "stats", "open source"],
  },
  {
    id: "achievements",
    name: "Achievements & Milestones",
    icon: "lucide:trophy",
    description: "Hackathon wins, honors, and milestones",
    keywords: ["achievements", "milestones", "awards", "hackathons", "honors", "wins", "recognition"],
  },
  {
    id: "cta",
    name: "Let's Connect",
    icon: "lucide:sparkles",
    description: "Get in touch or start a collaboration",
    keywords: ["contact", "cta", "connect", "collaborate", "hire", "touch", "message"],
  },
];

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const lenis = useLenis();

  // Keyboard shortcut (⌘K or Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const navigateTo = (path: string) => {
    onOpenChange(false);
    router.push(path);
  };

  const scrollToSection = (id: string) => {
    onOpenChange(false);
    if (pathname === "/") {
      if (lenis) {
        lenis.scrollTo(`#${id}`, { offset: -70, duration: 1.2 });
      } else {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    } else {
      router.push(`/#${id}`);
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search pages, sections, projects, or commands..." />
      <CommandList>
        <CommandEmpty>No matching results found.</CommandEmpty>

        {/* 1. Primary Pages Navigation */}
        <CommandGroup heading="Pages">
          {PAGES.map((page) => (
            <CommandItem
              key={page.path}
              value={`${page.name} ${page.keywords.join(" ")} ${page.description}`}
              onSelect={() => navigateTo(page.path)}
              className="flex items-center justify-between gap-2.5 px-3 py-2 cursor-pointer rounded-lg"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon name={page.icon} size={15} className="text-muted-foreground shrink-0" />
                <span className="font-medium text-foreground text-xs sm:text-sm">{page.name}</span>
                <span className="text-[11px] text-muted-foreground truncate hidden sm:inline">
                  — {page.description}
                </span>
              </div>
              {page.badge && (
                <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border border-border/70 bg-muted/60 text-muted-foreground shrink-0">
                  {page.badge}
                </span>
              )}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* 2. On-Page Sections */}
        <CommandGroup heading="Jump to Section">
          {SECTIONS.map((item) => (
            <CommandItem
              key={item.id}
              value={`${item.name} ${item.keywords.join(" ")} ${item.description}`}
              onSelect={() => scrollToSection(item.id)}
              className="flex items-center justify-between gap-2.5 px-3 py-2 cursor-pointer rounded-lg"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon name={item.icon} size={15} className="text-muted-foreground shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-foreground">{item.name}</span>
                <span className="text-[11px] text-muted-foreground truncate hidden sm:inline">
                  — {item.description}
                </span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground/70 shrink-0">
                #{item.id}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* 3. Dedicated Projects */}
        <CommandGroup heading="Projects Showcase">
          {projects.map((proj) => (
            <CommandItem
              key={proj.slug}
              value={`${proj.title} ${proj.category} ${proj.summary} ${proj.stack.map((s) => s.name).join(" ")}`}
              onSelect={() => navigateTo(`/projects/${proj.slug}`)}
              className="flex items-center justify-between gap-2.5 px-3 py-2 cursor-pointer rounded-lg"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon name="lucide:folder" size={15} className="text-muted-foreground shrink-0" />
                <span className="font-medium text-foreground text-xs sm:text-sm">{proj.title}</span>
                <span className="text-[11px] text-muted-foreground truncate hidden md:inline max-w-xs">
                  — {proj.summary}
                </span>
              </div>
              <span
                className={`text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border shrink-0 ${
                  proj.status === "live"
                    ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
                    : "border-amber-500/25 bg-amber-500/10 text-amber-400"
                }`}
              >
                {proj.status === "live" ? "Live" : "In Progress"}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* 4. Social & Connect */}
        <CommandGroup heading="Connect & Links">
          {socials.map((social) => (
            <CommandItem
              key={social.name}
              value={`social ${social.name} ${social.handle} link connect profile`}
              onSelect={() => {
                onOpenChange(false);
                window.open(social.href, "_blank", "noopener,noreferrer");
              }}
              className="flex items-center justify-between gap-2.5 px-3 py-2 cursor-pointer rounded-lg"
            >
              <div className="flex items-center gap-2.5">
                <Icon name={social.icon} size={15} className="text-muted-foreground shrink-0" />
                <span className="text-xs sm:text-sm">{social.name}</span>
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                {social.handle}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* 5. Theme Actions */}
        <CommandGroup heading="Theme">
          <CommandItem
            value="theme dark mode switch dark"
            onSelect={() => {
              setTheme("dark");
              onOpenChange(false);
            }}
            className="flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-lg"
          >
            <Icon name="lucide:moon" size={15} className="text-muted-foreground shrink-0" />
            <span className="text-xs sm:text-sm">Dark mode</span>
          </CommandItem>
          <CommandItem
            value="theme light mode switch light"
            onSelect={() => {
              setTheme("light");
              onOpenChange(false);
            }}
            className="flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-lg"
          >
            <Icon name="lucide:sun" size={15} className="text-muted-foreground shrink-0" />
            <span className="text-xs sm:text-sm">Light mode</span>
          </CommandItem>
          <CommandItem
            value="theme system mode auto system"
            onSelect={() => {
              setTheme("system");
              onOpenChange(false);
            }}
            className="flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-lg"
          >
            <Icon name="lucide:monitor" size={15} className="text-muted-foreground shrink-0" />
            <span className="text-xs sm:text-sm">System default</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>

      {/* Keyboard Shortcut Hints Footer */}
      <div className="flex items-center justify-between border-t border-border/70 px-4 py-2 text-[11px] font-mono text-muted-foreground bg-muted/20 shrink-0">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded border border-border/70 bg-background text-[10px]">↑</kbd>
            <kbd className="px-1 py-0.5 rounded border border-border/70 bg-background text-[10px]">↓</kbd>
            <span>navigate</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded border border-border/70 bg-background text-[10px]">↵</kbd>
            <span>select</span>
          </span>
        </div>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded border border-border/70 bg-background text-[10px]">ESC</kbd>
          <span>close</span>
        </span>
      </div>
    </CommandDialog>
  );
}
