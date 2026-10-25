"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Icon } from "@/components/shared/icon";
import { springSoft } from "@/lib/motion";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";

export type ProjectCardProps = {
  project: Project;
  priority?: boolean;
  className?: string;
  onSelect?: (project: Project) => void;
};

export function ProjectCard({
  project,
  priority = false,
  className,
  onSelect,
}: ProjectCardProps) {
  const shouldReduceMotion = useReducedMotion();

  const maxChips = 4;
  const visibleStack = project.stack.slice(0, maxChips);
  const remainingCount = project.stack.length - maxChips;

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      whileFocus="hover"
      animate="rest"
      className={cn(
        "group relative flex flex-col justify-between h-full rounded-[16px] overflow-hidden",
        "border border-border/70 dark:border-white/10 bg-card/60 dark:bg-[#111113]/70 backdrop-blur-sm",
        "text-card-foreground text-left cursor-pointer",
        "transition-all duration-300 hover:border-border-strong dark:hover:border-white/20 hover:shadow-lg dark:hover:shadow-black/50",
        "focus-within:ring-2 focus-within:ring-ring focus-within:border-border-strong",
        className
      )}
    >
      <Link
        href={`/projects/${project.slug}`}
        onClick={() => {
          if (onSelect) {
            onSelect(project);
          }
        }}
        className="flex flex-col flex-1 h-full focus:outline-none"
      >
        {/* ================================================================= */}
        {/* FULL-WIDTH SCREENSHOT STAGE (Natural 16:10 aspect, spans full width) */}
        {/* ================================================================= */}
        <div className="relative w-full aspect-[16/10] overflow-hidden rounded-t-[15px] border-b border-border/60 bg-muted/40 select-none">
          <motion.div
            variants={{
              rest: { scale: 1 },
              hover: shouldReduceMotion ? { scale: 1 } : { scale: 1.03 },
            }}
            transition={springSoft}
            className="relative w-full h-full"
          >
            <Image
              src={project.image}
              alt={project.imageAlt}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
              className="object-cover object-top select-none pointer-events-none"
            />
          </motion.div>
        </div>

        {/* ================================================================= */}
        {/* CARD CONTENT: Serif Title + Status Badge + Summary + Stack Chips  */}
        {/* ================================================================= */}
        <div className="p-4 sm:p-[18px] flex flex-col flex-1">
          {/* Title Row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <h3 className="font-display text-[19px] sm:text-[20px] font-normal tracking-tight text-foreground truncate group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <motion.span
                variants={{
                  rest: shouldReduceMotion
                    ? { opacity: 0.6 }
                    : { opacity: 0.6, x: 0, y: 0 },
                  hover: shouldReduceMotion
                    ? { opacity: 1 }
                    : { opacity: 1, x: 2, y: -2 },
                }}
                transition={springSoft}
                className="text-muted-foreground/80 shrink-0 inline-flex"
                aria-hidden="true"
              >
                <Icon name="lucide:arrow-up-right" size={15} />
              </motion.span>
            </div>

            {/* Status Badge at Right (Live / In-Progress) */}
            <span
              className={cn(
                "shrink-0 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase border",
                project.status === "live"
                  ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
                  : "border-amber-500/25 bg-amber-500/10 text-amber-400"
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  project.status === "live"
                    ? "bg-emerald-400 animate-pulse"
                    : "bg-amber-400"
                )}
              />
              {project.status === "live" ? "Live" : "In Progress"}
            </span>
          </div>

          {/* Summary (14px, 2-line clamp, secondary text) */}
          <p className="font-sans text-[14px] text-muted-foreground line-clamp-2 leading-relaxed mt-2 mb-4">
            {project.summary}
          </p>

          {/* Spacer to push chips to the bottom for equal-height cards */}
          <div className="mt-auto" />

          {/* Stack Chips Row (Iconify icons, max 4 + "+N", mono 13px minimum) */}
          <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-border/50">
            {visibleStack.map((tech) => (
              <span
                key={tech.name}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[13px] font-mono border border-border/70 bg-muted/40 text-muted-foreground transition-colors group-hover:text-foreground"
              >
                <Icon name={tech.icon} size={13} className="shrink-0" />
                <span>{tech.name}</span>
              </span>
            ))}
            {remainingCount > 0 && (
              <span className="text-[13px] font-mono text-muted-foreground/75 px-1 font-medium">
                +{remainingCount}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
