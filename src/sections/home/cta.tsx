"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { copy } from "@/data/copy";
import { WordSwap, WordSwapDots } from "@/components/shared/word-swap";
import { Magnetic } from "@/components/shared/magnetic";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function CtaSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [buttonHovered, setButtonHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const availability = copy.cta.availability;

  const handlePause = useCallback(() => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
    setIsPaused(true);
  }, []);

  const handleResume = useCallback(() => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    resumeTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 600);
  }, []);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section id="cta" aria-labelledby="cta-heading" className="w-full mb-20 sm:mb-24">
      <div className="relative w-full rounded-[16px] border border-border bg-card p-[28px] shadow-xs text-left">
        {/* Optional Availability Pill (if defined in copy.cta.availability) */}
        {availability?.label && (
          <div className="mb-4">
            <TooltipProvider delay={0}>
              <Tooltip>
                <TooltipTrigger
                  delay={0}
                  aria-label={`Availability: ${availability.label}${availability.tip ? `. ${availability.tip}` : ""}`}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/80 bg-muted/40 backdrop-blur-sm text-[13px] font-mono text-foreground/85 cursor-default select-none hover:border-border-strong hover:bg-muted/60 transition-colors focus-visible:ring-1 focus-visible:ring-ring outline-none"
                >
                  <span
                    className={cn(
                      "size-2 rounded-full bg-emerald-500",
                      !shouldReduceMotion && "animate-pulse"
                    )}
                    aria-hidden="true"
                  />
                  <span>{availability.label}</span>
                </TooltipTrigger>
                {availability.tip && (
                  <TooltipContent side="top" sideOffset={8} className="font-mono text-xs">
                    <span>{availability.tip}</span>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {/* Headline with Inline Word Swap (display size serif) */}
        <h2
          id="cta-heading"
          className="font-display text-2xl sm:text-3xl md:text-4xl font-normal text-foreground tracking-tight leading-tight"
        >
          <span>{copy.cta.headlinePrefix}</span>
          <WordSwap
            activeIndex={activeIndex}
            onActiveIndexChange={setActiveIndex}
            isPaused={isPaused}
            onPause={handlePause}
            onResume={handleResume}
          />
          <span>{copy.cta.headlineSuffix}</span>
        </h2>

        {/* Subline (mono 14px muted) */}
        <p className="font-mono text-sm text-muted-foreground mt-3 max-w-lg leading-relaxed">
          {copy.cta.subline}
        </p>

        {/* Bottom Row: Primary Pill Button + Progress Dots Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mt-7 pt-2">
          {/* Primary Pill Button with Magnetic Hover & Label Swap */}
          <Magnetic strength={0.18}>
            <Link
              href="/contact"
              data-cuelume-tap
              onMouseEnter={() => setButtonHovered(true)}
              onMouseLeave={() => setButtonHovered(false)}
              className={cn(
                "group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full shrink-0",
                "bg-primary text-primary-foreground font-mono text-sm font-medium",
                "transition-all duration-200 shadow-sm hover:shadow-md active:scale-98 cursor-pointer select-none"
              )}
            >
              <span>
                {buttonHovered ? copy.cta.buttonHover : copy.cta.buttonDefault}
              </span>
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </Magnetic>

          {/* Progress Dots Indicator for Cycling Words */}
          <WordSwapDots
            activeIndex={activeIndex}
            onSelectIndex={setActiveIndex}
            onPause={handlePause}
            onResume={handleResume}
            className="self-start sm:self-center"
          />
        </div>
      </div>
    </section>
  );
}
