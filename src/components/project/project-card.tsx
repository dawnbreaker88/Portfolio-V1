"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useSpring,
} from "motion/react";
import { Icon } from "@/components/shared/icon";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import type { Project } from "@/types";
import { cn, ensureHttps } from "@/lib/utils";

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
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const [isHoveringAction, setIsHoveringAction] = useState(false);

  // Mouse tracking for floating message tip ("Click to view project details")
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 300, mass: 0.4 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // If the click originated from an explicit link/button (e.g. "View Project" or tooltip), don't trigger card navigation
    const target = e.target as HTMLElement;
    if (target.closest("a, button, [role='tooltip']")) {
      return;
    }
    if (onSelect) {
      onSelect(project);
    }
    router.push(`/projects/${project.slug}`);
  };

  const maxVisibleIcons = 6;
  const visibleStack = project.stack.slice(0, maxVisibleIcons);
  const remainingStack = project.stack.slice(maxVisibleIcons);
  const remainingCount = remainingStack.length;

  const externalUrl = project.liveUrl
    ? ensureHttps(project.liveUrl)
    : project.repoUrl
    ? ensureHttps(project.repoUrl)
    : null;

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      whileFocus="hover"
      animate="rest"
      onPointerEnter={(e) => {
        setIsHovered(true);
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        setIsHovered(false);
        setIsHoveringAction(false);
      }}
      onClick={handleCardClick}
      className={cn(
        "group relative flex flex-col justify-between h-full rounded-[18px] p-3 sm:p-3.5",
        "border border-border/70 dark:border-white/10 bg-card/60 dark:bg-[#111113]/80 backdrop-blur-sm",
        "text-card-foreground text-left cursor-pointer select-none",
        "transition-all duration-300 hover:border-border-strong dark:hover:border-white/20 hover:shadow-xl dark:hover:shadow-black/60",
        "focus-within:ring-2 focus-within:ring-ring focus-within:border-border-strong",
        className
      )}
    >
      {/* ================================================================= */}
      {/* FLOATING CURSOR TIP ("Click to view project details")              */}
      {/* Follows mouse smoothly; hides when hovering over external action   */}
      {/* ================================================================= */}
      <AnimatePresence>
        {isHovered && !isHoveringAction && !shouldReduceMotion && (
          <motion.div
            style={{
              x: cursorX,
              y: cursorY,
              translateX: "-50%",
              translateY: "-135%",
            }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="pointer-events-none absolute top-0 left-0 z-40 hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-foreground text-background text-[11px] font-mono font-medium shadow-2xl backdrop-blur-md whitespace-nowrap select-none border border-background/20"
          >
            <span>Click to view project details</span>
            <Icon name="lucide:arrow-right" size={11} className="shrink-0" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================================================================= */}
      {/* TOP / MAIN CARD CONTENT: Link to /projects/${project.slug}       */}
      {/* ================================================================= */}
      <Link
        href={`/projects/${project.slug}`}
        data-cuelume-loading
        data-cuelume-emphasis="subtle"
        onClick={() => {
          if (onSelect) {
            onSelect(project);
          }
        }}
        className="flex flex-col flex-1 focus:outline-none"
        tabIndex={0}
      >
        {/* ================================================================= */}
        {/* IMAGE CONTAINER (The Stage with bottom-anchored contracting image) */}
        {/* ================================================================= */}
        <div className="relative w-full aspect-[16/10] overflow-hidden rounded-[14px] border border-border/70 dark:border-white/[0.08] bg-zinc-100/90 dark:bg-[#09090b] select-none flex items-end justify-center">
          {/* Studio Gradient Background (Revealed on Hover) */}
          <motion.div
            variants={{
              rest: { opacity: 0.4 },
              hover: { opacity: 1 },
            }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Clean studio gradient in light mode; Charcoal to near-black in dark mode */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 via-neutral-100 to-zinc-200/90 dark:from-[#242428] dark:via-[#141416] dark:to-[#09090b]" />
            {/* Subtle soft ambient light in the top center */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.85)_0%,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.08)_0%,transparent_65%)]" />
            {/* Subtle edge vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/[0.04] via-transparent to-transparent dark:from-black/50 dark:via-transparent dark:to-black/20" />
          </motion.div>

          {/* Contracting Image Wrapper (Anchored to bottom, contracts downward on hover) */}
          <motion.div
            style={{ transformOrigin: "bottom center" }}
            variants={{
              rest: {
                scale: 1,
              },
              hover: shouldReduceMotion
                ? { scale: 1 }
                : {
                    scale: 0.85,
                  },
            }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative w-[92%] h-[88%] rounded-t-[10px] rounded-b-[4px] overflow-hidden flex items-center justify-center border border-black/[0.06] dark:border-white/[0.07] shadow-[0_6px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_6px_20px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:shadow-[0_16px_36px_-6px_rgba(0,0,0,0.14)] dark:group-hover:shadow-[0_16px_36px_-6px_rgba(0,0,0,0.85)] group-hover:border-black/15 dark:group-hover:border-white/20"
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
        {/* CARD CONTENT: Title + Status + Description                       */}
        {/* ================================================================= */}
        <div className="px-1 pt-3.5 pb-0.5 flex flex-col flex-1">
          {/* Title Row: Name + Status Badge */}
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-[19px] sm:text-[20px] font-normal tracking-tight text-foreground truncate group-hover:text-primary transition-colors">
              {project.title}
            </h3>

            {/* Status Badge (Live / Building) */}
            <span
              className={cn(
                "shrink-0 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono tracking-wider border",
                project.status === "live"
                  ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400"
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  project.status === "live"
                    ? "bg-emerald-500 dark:bg-emerald-400 animate-pulse"
                    : "bg-amber-500 dark:bg-amber-400"
                )}
              />
              {project.status === "live" ? "Live" : "Building"}
            </span>
          </div>

          {/* Short Description (14px, 2-line clamp) */}
          <p className="font-sans text-[13.5px] sm:text-[14px] text-muted-foreground line-clamp-2 leading-relaxed mt-2 mb-3">
            {project.summary}
          </p>
        </div>
      </Link>

      {/* Spacer to push action row to the bottom for equal-height cards */}
      <div className="mt-auto" />

      {/* ================================================================= */}
      {/* BOTTOM ROW: Tech Icons (left) + "View Project ↗" External (right) */}
      {/* ================================================================= */}
      <div
        className="flex items-center justify-between gap-2 pt-2.5 px-1 border-t border-border/40 relative z-20"
        onMouseEnter={() => setIsHoveringAction(true)}
        onMouseLeave={() => setIsHoveringAction(false)}
      >
        {/* Technology Icons with tooltips */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
          <TooltipProvider delay={100}>
            {visibleStack.map((tech) => (
              <Tooltip key={tech.name}>
                <TooltipTrigger
                  delay={100}
                  render={
                    <span className="inline-flex items-center justify-center size-5 text-muted-foreground/80 hover:text-foreground transition-colors cursor-pointer" />
                  }
                >
                  <Icon name={tech.icon} size={15} />
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  sideOffset={6}
                  className="font-mono text-xs px-2.5 py-1 rounded-md shadow-lg pointer-events-none z-50"
                >
                  <span>{tech.name}</span>
                </TooltipContent>
              </Tooltip>
            ))}
            {remainingCount > 0 && (
              <Tooltip>
                <TooltipTrigger
                  delay={100}
                  render={
                    <span className="text-[11px] font-mono text-muted-foreground/70 hover:text-foreground px-1 py-0.5 rounded cursor-pointer transition-colors" />
                  }
                >
                  +{remainingCount}
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  sideOffset={6}
                  className="font-mono text-xs px-2.5 py-1 rounded-md shadow-lg pointer-events-none z-50"
                >
                  <span>{remainingStack.map((t) => t.name).join(", ")}</span>
                </TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>

        {/* "View Project ↗" External Link (or internal fallback) */}
        {externalUrl ? (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
            }}
            onMouseEnter={() => setIsHoveringAction(true)}
            onMouseLeave={() => setIsHoveringAction(false)}
            className="inline-flex items-center gap-1 text-xs font-sans font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0 z-30 cursor-pointer p-1 -m-1 rounded group/action"
            title={`Open ${project.title} external website in new tab`}
          >
            <span className="group-hover/action:underline decoration-muted-foreground/50 underline-offset-4">
              View Project
            </span>
            <Icon
              name="lucide:arrow-up-right"
              size={14}
              className="transition-transform duration-300 group-hover/action:translate-x-0.5 group-hover/action:-translate-y-0.5"
            />
          </a>
        ) : (
          <Link
            href={`/projects/${project.slug}`}
            onClick={(e) => {
              e.stopPropagation();
              if (onSelect) onSelect(project);
            }}
            onMouseEnter={() => setIsHoveringAction(true)}
            onMouseLeave={() => setIsHoveringAction(false)}
            className="inline-flex items-center gap-1 text-xs font-sans font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0 z-30 cursor-pointer p-1 -m-1 rounded group/action"
          >
            <span className="group-hover/action:underline decoration-muted-foreground/50 underline-offset-4">
              View Details
            </span>
            <Icon
              name="lucide:arrow-right"
              size={14}
              className="transition-transform duration-300 group-hover/action:translate-x-0.5"
            />
          </Link>
        )}
      </div>
    </motion.div>
  );
}
