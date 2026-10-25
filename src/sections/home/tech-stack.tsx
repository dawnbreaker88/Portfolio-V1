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
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-mono transition-all duration-150 shrink-0",
                isActive
                  ? "bg-foreground text-background font-medium shadow-sm"
                  : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/70 border border-border/50"
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
