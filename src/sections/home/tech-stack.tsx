"use client";

import React, { useState } from "react";
import { techStack } from "@/data/tech-stack";
import { copy } from "@/data/copy";
import { SectionHeader } from "@/components/layout/section-header";
import { TechChip } from "@/components/shared/tech-chip";
import type { TechItemGroup } from "@/types";
import { cn } from "@/lib/utils";

type FilterTab = "all" | TechItemGroup;

const TABS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "languages", label: "Languages" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "databases", label: "Databases" },
  { id: "devops", label: "DevOps & Cloud" },
  { id: "ai", label: "AI" },
];

export function TechStackSection() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const filteredItems =
    activeTab === "all"
      ? techStack
      : techStack.filter((item) => item.group === activeTab);

  return (
    <section id="tech-stack" aria-labelledby="tech-stack-heading" className="mb-20 sm:mb-24">
      <SectionHeader
        title={copy.sections.techStack.title}
        index={copy.sections.techStack.index}
      />

      {/* Tabs Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-6">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              data-cuelume-select
              data-cuelume-emphasis="subtle"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-mono transition-all duration-150 shrink-0 cursor-pointer select-none",
                isActive
                  ? "bg-foreground text-background font-medium shadow-sm"
                  : "bg-card/40 dark:bg-[#111113]/60 text-muted-foreground hover:text-foreground border border-border/60 dark:border-white/10 hover:border-border-strong dark:hover:border-white/20 hover:bg-muted/40 dark:hover:bg-[#18181b]/80"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tech Chips Grid */}
      <div className="flex flex-wrap gap-2.5">
        {filteredItems.map((item) => (
          <TechChip key={item.name} name={item.name} icon={item.icon} />
        ))}
      </div>
    </section>
  );
}
