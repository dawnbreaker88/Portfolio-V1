"use client";

import React, { useEffect, useState } from "react";
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
import { toggleThemeWithTransition } from "@/lib/theme-transition";
import { useSound } from "@/providers/sound-provider";
import { cn, ensureHttps } from "@/lib/utils";

export type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// Top-level site routes (active pages first, then upcoming)
const PAGES = [
  {
    name: "Home",
    path: "/",
    icon: "lucide:home",
    description: "Main portfolio overview",
    keywords: ["home", "main", "overview", "landing"],
  },
  {
    name: "Projects",
    path: "/projects",
    icon: "lucide:folder-git-2",
    description: "All projects, architectures, and systems",
    keywords: ["projects", "apps", "portfolio", "work", "showcase", "systems", "code"],
  },
  {
    name: "Contact",
    path: "/contact",
    icon: "lucide:mail",
    description: "Direct messaging, inquiries, and collaboration",
    keywords: ["contact", "email", "reach out", "message", "hire", "collaborate", "chat"],
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
];

// Meaningful On-Page Sections on the Home Page (excluding duplicates of top-level pages)
const SECTIONS = [
  {
    id: "about",
    name: "About",
    icon: "lucide:user",
    description: "Background, mindset, education, and interests",
    keywords: ["about", "story", "student", "background", "education", "mindset", "bio", "prabhath"],
  },
  {
    id: "experience",
    name: "Experience",
    icon: "lucide:briefcase",
    description: "Work history, internships, and engineering roles",
    keywords: ["experience", "career", "work", "jobs", "internships", "employment", "developer", "loopers"],
  },
  {
    id: "tech-stack",
    name: "Tech Stack",
    icon: "lucide:wrench",
    description: "Languages, frameworks, databases, and tooling",
    keywords: ["tech", "stack", "skills", "tools", "technologies", "languages", "python", "react", "nextjs", "typescript", "mongodb", "ai"],
  },
  {
    id: "github-activity",
    name: "GitHub Activity",
    icon: "lucide:git-commit",
    description: "Commit frequency, contribution calendar, and open source",
    keywords: ["github", "activity", "git", "commits", "contributions", "graph", "stats", "open source"],
  },
  {
    id: "highlights",
    name: "Highlights",
    icon: "lucide:sparkles",
    description: "Research work, honors, and milestones",
    keywords: ["highlights", "research", "recognition", "temporal rag", "ai hack day", "inae conclave", "honors", "awards"],
  },
];

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const lenis = useLenis();
  const { soundEnabled, toggleSound, playSound } = useSound();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const prevOpenRef = React.useRef(open);

  // Play subtle open/close sound cue
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      playSound("toggle", { emphasis: "subtle" });
    } else if (!open && prevOpenRef.current) {
      playSound("toggle", { emphasis: "subtle" });
    }
    prevOpenRef.current = open;
  }, [open, playSound]);

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

  const copyEmail = () => {
    navigator.clipboard.writeText("vankaprabhath@gmail.com");
    setCopiedEmail(true);
    playSound("toggle", { emphasis: "subtle" });
    setTimeout(() => {
      setCopiedEmail(false);
      onOpenChange(false);
    }, 1200);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search pages, projects, sections..." />
      <CommandList>
        <CommandEmpty>No matching results found.</CommandEmpty>

        {/* 1. Primary Pages Navigation */}
        <CommandGroup heading="Navigation">
          {PAGES.map((page) => (
            <CommandItem
              key={page.path}
              value={`page ${page.name} ${page.keywords.join(" ")} ${page.description}`}
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

        {/* 2. Quick Actions */}
        <CommandGroup heading="Quick Actions">
          {/* View Resume PDF */}
          <CommandItem
            value="action resume cv pdf curriculum vitae view download experience"
            onSelect={() => {
              onOpenChange(false);
              window.open("/resume/Prabhath_Resume%20(3).pdf", "_blank", "noopener,noreferrer");
            }}
            className="flex items-center justify-between gap-2.5 px-3 py-2 cursor-pointer rounded-lg"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Icon name="lucide:file-text" size={15} className="text-muted-foreground shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-foreground">Open Resume</span>
              <span className="text-[11px] text-muted-foreground truncate hidden sm:inline">
                — View or download latest PDF
              </span>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border border-border/70 bg-muted/50 text-muted-foreground shrink-0">
              PDF ↗
            </span>
          </CommandItem>

          {/* Send Direct Email */}
          <CommandItem
            value="action email mail message write send vankaprabhath inbox"
            onSelect={() => {
              onOpenChange(false);
              window.location.href = "mailto:vankaprabhath@gmail.com";
            }}
            className="flex items-center justify-between gap-2.5 px-3 py-2 cursor-pointer rounded-lg"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Icon name="lucide:mail" size={15} className="text-muted-foreground shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-foreground">Send Email</span>
              <span className="text-[11px] text-muted-foreground truncate hidden sm:inline">
                — vankaprabhath@gmail.com
              </span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground/70 shrink-0">
              mailto
            </span>
          </CommandItem>

          {/* Copy Email Address */}
          <CommandItem
            value="action copy email address clipboard vankaprabhath"
            onSelect={copyEmail}
            className="flex items-center justify-between gap-2.5 px-3 py-2 cursor-pointer rounded-lg"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Icon
                name={copiedEmail ? "lucide:check" : "lucide:copy"}
                size={15}
                className={cn("shrink-0", copiedEmail ? "text-emerald-400" : "text-muted-foreground")}
              />
              <span className="text-xs sm:text-sm font-medium text-foreground">
                {copiedEmail ? "Email Copied to Clipboard!" : "Copy Email Address"}
              </span>
              <span className="text-[11px] text-muted-foreground truncate hidden sm:inline">
                — vankaprabhath@gmail.com
              </span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground/70 shrink-0">
              {copiedEmail ? "Copied" : "Copy"}
            </span>
          </CommandItem>

          {/* Toggle Sound Effects */}
          <CommandItem
            value="action sound audio volume toggle mute unmute effects cuelume"
            onSelect={() => {
              toggleSound();
              onOpenChange(false);
            }}
            className="flex items-center justify-between gap-2.5 px-3 py-2 cursor-pointer rounded-lg"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Icon
                name={soundEnabled ? "lucide:volume-2" : "lucide:volume-x"}
                size={15}
                className="text-muted-foreground shrink-0"
              />
              <span className="text-xs sm:text-sm font-medium text-foreground">
                {soundEnabled ? "Mute Sound Effects" : "Enable Sound Effects"}
              </span>
              <span className="text-[11px] text-muted-foreground truncate hidden sm:inline">
                — Web Audio interaction feedback
              </span>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border border-border/70 bg-muted/50 text-muted-foreground shrink-0">
              {soundEnabled ? "On" : "Muted"}
            </span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* 3. On-Page Sections */}
        <CommandGroup heading="Jump to Section">
          {SECTIONS.map((item) => (
            <CommandItem
              key={item.id}
              value={`section ${item.name} ${item.keywords.join(" ")} ${item.description}`}
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

        {/* 4. Dedicated Projects */}
        <CommandGroup heading="Projects">
          {projects.map((proj) => (
            <CommandItem
              key={proj.slug}
              value={`project ${proj.title} ${proj.category} ${proj.summary} ${proj.stack.map((s) => s.name).join(" ")}`}
              onSelect={() => {
                onOpenChange(false);
                if (proj.liveUrl) {
                  window.open(ensureHttps(proj.liveUrl), "_blank", "noopener,noreferrer");
                } else if (proj.repoUrl) {
                  window.open(ensureHttps(proj.repoUrl), "_blank", "noopener,noreferrer");
                } else {
                  navigateTo(`/projects/${proj.slug}`);
                }
              }}
              className="flex items-center justify-between gap-2.5 px-3 py-2 cursor-pointer rounded-lg"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon name="lucide:folder-git-2" size={15} className="text-muted-foreground shrink-0" />
                <span className="font-medium text-foreground text-xs sm:text-sm">{proj.title}</span>
                <span className="text-[11px] text-muted-foreground truncate hidden md:inline max-w-xs">
                  — {proj.summary}
                </span>
              </div>
              <span
                className={cn(
                  "text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border shrink-0",
                  proj.liveUrl
                    ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
                    : proj.repoUrl
                    ? "border-border/70 text-muted-foreground"
                    : "border-amber-500/25 bg-amber-500/10 text-amber-400"
                )}
              >
                {proj.liveUrl ? "Live ↗" : proj.repoUrl ? "Code ↗" : "Details"}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* 5. Social & Connect */}
        <CommandGroup heading="Connect & Social">
          {socials.map((social) => (
            <CommandItem
              key={social.name}
              value={`social ${social.name} ${social.handle} ${social.blurb} link connect profile`}
              onSelect={() => {
                onOpenChange(false);
                if (social.href.startsWith("mailto:")) {
                  window.location.href = social.href;
                } else {
                  window.open(social.href, "_blank", "noopener,noreferrer");
                }
              }}
              className="flex items-center justify-between gap-2.5 px-3 py-2 cursor-pointer rounded-lg"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon name={social.icon} size={15} className="text-muted-foreground shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-foreground">{social.name}</span>
                <span className="text-[11px] text-muted-foreground truncate hidden sm:inline">
                  — {social.blurb}
                </span>
              </div>
              <span className="text-xs font-mono text-muted-foreground/80 shrink-0">
                {social.handle}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* 6. Theme Actions */}
        <CommandGroup heading="Theme">
          <CommandItem
            value="theme dark mode switch dark"
            onSelect={() => {
              toggleThemeWithTransition("dark", setTheme);
              onOpenChange(false);
            }}
            className="flex items-center justify-between gap-2.5 px-3 py-2 cursor-pointer rounded-lg"
          >
            <div className="flex items-center gap-2.5">
              <Icon name="lucide:moon" size={15} className="text-muted-foreground shrink-0" />
              <span className="text-xs sm:text-sm">Dark mode</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground/60">Theme</span>
          </CommandItem>
          <CommandItem
            value="theme light mode switch light"
            onSelect={() => {
              toggleThemeWithTransition("light", setTheme);
              onOpenChange(false);
            }}
            className="flex items-center justify-between gap-2.5 px-3 py-2 cursor-pointer rounded-lg"
          >
            <div className="flex items-center gap-2.5">
              <Icon name="lucide:sun" size={15} className="text-muted-foreground shrink-0" />
              <span className="text-xs sm:text-sm">Light mode</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground/60">Theme</span>
          </CommandItem>
          <CommandItem
            value="theme system mode auto system"
            onSelect={() => {
              toggleThemeWithTransition("system", setTheme);
              onOpenChange(false);
            }}
            className="flex items-center justify-between gap-2.5 px-3 py-2 cursor-pointer rounded-lg"
          >
            <div className="flex items-center gap-2.5">
              <Icon name="lucide:monitor" size={15} className="text-muted-foreground shrink-0" />
              <span className="text-xs sm:text-sm">System default</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground/60">Theme</span>
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
