"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
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
import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { socials } from "@/data/socials";

export type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const { setTheme } = useTheme();

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

  const scrollToSection = (id: string) => {
    onOpenChange(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#${id}`);
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search sections, projects, or actions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Sections">
          {site.nav.map((item) => (
            <CommandItem
              key={item.id}
              value={item.label}
              onSelect={() => scrollToSection(item.id)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Icon name={item.icon} size={15} />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Projects">
          {projects.map((proj) => (
            <CommandItem
              key={proj.slug}
              value={proj.title}
              onSelect={() => {
                onOpenChange(false);
                scrollToSection("projects");
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Icon name="lucide:folder" size={15} />
              <span>{proj.title}</span>
              <span className="text-xs text-muted-foreground ml-auto">
                {proj.status === "live" ? "Live" : "In Progress"}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Connect">
          {socials.map((social) => (
            <CommandItem
              key={social.name}
              value={social.name}
              onSelect={() => {
                onOpenChange(false);
                window.open(social.href, "_blank", "noopener,noreferrer");
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Icon name={social.icon} size={15} />
              <span>{social.name}</span>
              <span className="text-xs text-muted-foreground ml-auto">
                {social.handle}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Theme">
          <CommandItem
            onSelect={() => {
              setTheme("dark");
              onOpenChange(false);
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Icon name="lucide:moon" size={15} />
            <span>Dark mode</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setTheme("light");
              onOpenChange(false);
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Icon name="lucide:sun" size={15} />
            <span>Light mode</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
