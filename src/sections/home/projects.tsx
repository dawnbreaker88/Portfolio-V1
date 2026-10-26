"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { projects } from "@/data/projects";
import { copy } from "@/data/copy";
import { SectionHeader } from "@/components/layout/section-header";
import { ProjectCard } from "@/components/project/project-card";
import { cn } from "@/lib/utils";

type FilterCategory = "all" | "web" | "ml";

const FILTER_TABS: { id: FilterCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "web", label: "Web" },
  { id: "ml", label: "AI / ML" },
];

export function ProjectsSection({
  isStandalonePage = false,
}: {
  isStandalonePage?: boolean;
} = {}) {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");

  // Sort featured projects first, then preserve order
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  const filteredProjects =
    activeFilter === "all"
      ? sortedProjects
      : sortedProjects.filter((p) => p.category === activeFilter);

  const filterTabsAction = (
    <div
      role="tablist"
      aria-label="Filter projects by category"
      className="flex items-center gap-1 p-1 rounded-full border border-border/70 bg-card/50 backdrop-blur-sm"
    >
      {FILTER_TABS.map((tab) => {
        const isActive = activeFilter === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            data-cuelume-select
            data-cuelume-emphasis="subtle"
            aria-selected={isActive}
            onClick={() => setActiveFilter(tab.id)}
            className={cn(
              "relative px-2.5 sm:px-3 py-1 text-xs font-mono rounded-full transition-colors cursor-pointer select-none",
              isActive
                ? "text-background font-medium"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeProjectFilter"
                className="absolute inset-0 rounded-full bg-foreground"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <section id="projects" aria-labelledby="projects-heading" className="mb-20 sm:mb-24">
      {/* Header: Clean 2-line intro on standalone page, or standard SectionHeader on home */}
      {isStandalonePage ? (
        <div className="mb-8 space-y-4">
          <div>
            <h1
              id="projects-heading"
              className="font-display text-3xl sm:text-4xl font-normal text-foreground tracking-tight"
            >
              Projects
            </h1>
            <p className="font-sans text-sm sm:text-base text-muted-foreground leading-relaxed mt-2 max-w-xl">
              A collection of web and machine learning projects I&apos;ve built. Filter by category or select any project to explore its full details.
            </p>
          </div>
          <div className="flex items-center justify-start pt-1">
            {filterTabsAction}
          </div>
        </div>
      ) : (
        <SectionHeader
          title={copy.sections.projects.title}
          index={copy.sections.projects.index}
          action={filterTabsAction}
        />
      )}

      {/* 
        TWO columns from 640px up (sm:grid-cols-2), one column below.
        16px gap (gap-4), equal-height rows (items-stretch).
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
        <AnimatePresence initial={false}>
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.slug}
              layout="position"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              className="flex flex-col h-full"
            >
              <ProjectCard
                project={project}
                priority={index < 2}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
