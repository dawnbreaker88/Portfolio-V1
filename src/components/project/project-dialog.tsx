"use client";

import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useLenis } from "lenis/react";
import { Icon } from "@/components/shared/icon";
import { TechChip } from "@/components/shared/tech-chip";
import { buttonVariants } from "@/components/ui/button";
import type { Project } from "@/types";
import { cn, ensureHttps } from "@/lib/utils";

export type ProjectDialogProps = {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProjectDialog({
  project,
  open,
  onOpenChange,
}: ProjectDialogProps) {
  const [mounted, setMounted] = useState(false);
  const lenis = useLenis();
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pause Lenis and lock body scroll when dialog opens; restore focus when closed
  useEffect(() => {
    if (!open) {
      lenis?.start();
      return;
    }

    previousActiveElement.current = document.activeElement as HTMLElement;
    lenis?.stop();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    // Focus close button on open
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      lenis?.start();
      previousActiveElement.current?.focus?.();
    };
  }, [open, onOpenChange, lenis]);

  if (!mounted || !project) return null;

  const hasHighlights = Boolean(project.highlights && project.highlights.length > 0);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Frosted Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={() => onOpenChange(false)}
            aria-hidden="true"
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Expanded Modal Card (max-w-3xl, 20px radius, internal scroll, data-lenis-prevent) */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-project-title"
            data-lenis-prevent
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: "spring", stiffness: 350, damping: 28, mass: 0.8 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "relative w-full max-w-3xl my-auto rounded-[20px] overflow-hidden",
              "border border-border/80 bg-background/95 dark:bg-[#0c0d12]/95 backdrop-blur-2xl shadow-2xl",
              "flex flex-col max-h-[90vh] text-foreground text-left"
            )}
          >
            {/* Scrollable Container with data-lenis-prevent */}
            <div
              data-lenis-prevent
              className="overflow-y-auto p-5 sm:p-7 flex flex-col gap-6 no-scrollbar"
            >
              {/* ============================================================= */}
              {/* BANNER CROP IMAGE: full dialog width, fixed short height      */}
              {/* (200px desktop / 140px mobile, ~16:5), 12px radius, 1px border*/}
              {/* NO peeking offset, NO stage background, NO zoom, NO parallax  */}
              {/* ============================================================= */}
              <div className="relative w-full h-[140px] sm:h-[200px] rounded-[12px] overflow-hidden border border-border select-none shrink-0 bg-muted/60">
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover object-top select-none pointer-events-none"
                />
              </div>

              {/* ============================================================= */}
              {/* HEADER ROW: Serif Title, Status Badge, Year (mono), Links    */}
              {/* ============================================================= */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2
                      id="dialog-project-title"
                      className="font-display text-2xl sm:text-3xl text-foreground font-normal tracking-tight"
                    >
                      {project.title}
                    </h2>

                    {/* Status Badge */}
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase border",
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

                    {/* Year in Mono */}
                    {project.year && (
                      <span className="font-mono text-xs text-muted-foreground">
                        {project.year}
                      </span>
                    )}

                    {/* Live link icon cue if liveUrl */}
                    {project.liveUrl && (
                      <Link
                        href={ensureHttps(project.liveUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
                        aria-label={`Open live demo for ${project.title}`}
                      >
                        <Icon name="lucide:external-link" size={15} />
                      </Link>
                    )}
                  </div>

                  <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                    {project.summary}
                  </p>
                </div>

                {/* Close Button */}
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => onOpenChange(false)}
                  aria-label="Close dialog"
                  className="shrink-0 flex items-center justify-center size-8 rounded-full border border-border/80 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-150 cursor-pointer active:scale-95"
                >
                  <Icon name="lucide:x" size={15} />
                </button>
              </div>

              {/* ============================================================= */}
              {/* BODY: Hairline top border, 2-column grid (~1.05fr / 0.95fr)   */}
              {/* Left: ABOUT + STACK. Right: HIGHLIGHTS bullets.              */}
              {/* Mobile (<640px): single column in order About -> Highlights -> Stack */}
              {/* ============================================================= */}
              <div
                className={cn(
                  "border-t border-border pt-6 grid gap-6",
                  hasHighlights
                    ? "grid-cols-1 sm:grid-cols-[1.05fr_0.95fr]"
                    : "grid-cols-1"
                )}
              >
                {/* Left Column on Desktop: ABOUT & STACK */}
                <div
                  className={cn(
                    "flex flex-col gap-6 order-1 sm:order-1",
                    hasHighlights ? "sm:border-r sm:border-border sm:pr-6" : ""
                  )}
                >
                  {/* ABOUT Block */}
                  <div>
                    <h3 className="font-mono text-[13px] uppercase tracking-[0.08em] text-muted-foreground mb-2">
                      About
                    </h3>
                    <p className="font-sans text-sm text-foreground/90 leading-relaxed">
                      {project.about}
                    </p>
                  </div>

                  {/* STACK Block (Desktop: sits under About in column 1) */}
                  <div className="hidden sm:block">
                    <h3 className="font-mono text-[13px] uppercase tracking-[0.08em] text-muted-foreground mb-2.5">
                      Stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.stack.map((item) => (
                        <TechChip
                          key={item.name}
                          name={item.name}
                          icon={item.icon}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column on Desktop: HIGHLIGHTS Block (Order 2 on mobile & desktop) */}
                {hasHighlights && (
                  <div className="order-2 sm:order-2">
                    <h3 className="font-mono text-[13px] uppercase tracking-[0.08em] text-muted-foreground mb-2">
                      Highlights
                    </h3>
                    <ul className="space-y-2.5">
                      {project.highlights.map((bullet, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed"
                        >
                          <span className="size-1.5 rounded-full bg-primary/70 shrink-0 mt-2" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Mobile STACK Block (Order 3 on mobile: About -> Highlights -> Stack) */}
                <div className="block sm:hidden order-3">
                  <h3 className="font-mono text-[13px] uppercase tracking-[0.08em] text-muted-foreground mb-2.5">
                    Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((item) => (
                      <TechChip
                        key={item.name}
                        name={item.name}
                        icon={item.icon}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Solved / What's New dialog-only blocks if present */}
              {(project.solved || project.whatsNew) && (
                <div className="border-t border-border pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                  {project.solved && (
                    <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground block mb-1">
                        Solved Problem
                      </span>
                      <p className="text-muted-foreground leading-relaxed">
                        {project.solved}
                      </p>
                    </div>
                  )}
                  {project.whatsNew && (
                    <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground block mb-1">
                        What&apos;s New
                      </span>
                      <p className="text-muted-foreground leading-relaxed">
                        {project.whatsNew}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================= */}
              {/* FOOTER BUTTONS: Live Demo, GitHub, View full page             */}
              {/* ============================================================= */}
              <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3 mt-auto">
                <div className="flex flex-wrap items-center gap-2.5">
                  {project.liveUrl && (
                    <Link
                      href={ensureHttps(project.liveUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({ variant: "default" }),
                        "rounded-full font-mono text-xs px-5 inline-flex items-center gap-2 font-medium"
                      )}
                    >
                      <span>Live Demo</span>
                      <Icon name="lucide:arrow-up-right" size={14} />
                    </Link>
                  )}

                  {project.repoUrl && (
                    <Link
                      href={ensureHttps(project.repoUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "rounded-full font-mono text-xs px-4 inline-flex items-center gap-2"
                      )}
                    >
                      <Icon name="logos:github-icon" size={13} />
                      <span>GitHub</span>
                    </Link>
                  )}
                </div>

                {/* View Full Page Deep Link */}
                <Link
                  href={`/projects/${project.slug}`}
                  onClick={() => onOpenChange(false)}
                  className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5 py-1 px-2"
                >
                  <span>View full page</span>
                  <Icon name="lucide:arrow-right" size={13} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
