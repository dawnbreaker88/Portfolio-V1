"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { copy } from "@/data/copy";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useSound } from "@/providers/sound-provider";
import { durationNormal, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type WordSwapProps = {
  className?: string;
  onActiveIndexChange?: (index: number) => void;
  activeIndex?: number;
  isPaused?: boolean;
  onPause?: () => void;
  onResume?: () => void;
};

export function WordSwap({
  className,
  activeIndex: controlledIndex,
  onActiveIndexChange,
  isPaused: externalPaused,
  onPause,
  onResume,
}: WordSwapProps) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const { playSound } = useSound();

  const words = copy.cta.words;
  const [internalIndex, setInternalIndex] = useState(0);
  const isControlled = typeof controlledIndex === "number";
  const activeIndex = isControlled ? controlledIndex : internalIndex;

  const [internalPaused, setInternalPaused] = useState(false);
  const isPaused = externalPaused !== undefined ? externalPaused : internalPaused;
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const internalResumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const longestWord = words.reduce(
    (longest, item) => (item.word.length > longest.length ? item.word : longest),
    ""
  );

  const updateIndex = useCallback(
    (newIndex: number) => {
      if (!isControlled) {
        setInternalIndex(newIndex);
      }
      onActiveIndexChange?.(newIndex);
    },
    [isControlled, onActiveIndexChange]
  );

  // Auto-cycle every 2.8s unless paused or reduced motion
  useEffect(() => {
    if (shouldReduceMotion || isPaused) return;

    const interval = setInterval(() => {
      updateIndex((activeIndex + 1) % words.length);
    }, 2800);

    return () => clearInterval(interval);
  }, [activeIndex, isPaused, shouldReduceMotion, words.length, updateIndex]);

  // Clean up internal resume timeout
  useEffect(() => {
    return () => {
      if (internalResumeTimeoutRef.current) {
        clearTimeout(internalResumeTimeoutRef.current);
      }
    };
  }, []);

  const handlePointerEnter = () => {
    if (internalResumeTimeoutRef.current) clearTimeout(internalResumeTimeoutRef.current);
    if (onPause) {
      onPause();
    } else {
      setInternalPaused(true);
    }
    setTooltipOpen(true);
  };

  const handlePointerLeave = () => {
    setTooltipOpen(false);
    if (onResume) {
      onResume();
    } else {
      internalResumeTimeoutRef.current = setTimeout(() => {
        setInternalPaused(false);
      }, 600);
    }
  };

  const handleFocus = () => {
    if (internalResumeTimeoutRef.current) clearTimeout(internalResumeTimeoutRef.current);
    if (onPause) {
      onPause();
    } else {
      setInternalPaused(true);
    }
    setTooltipOpen(true);
  };

  const handleBlur = () => {
    setTooltipOpen(false);
    if (onResume) {
      onResume();
    } else {
      internalResumeTimeoutRef.current = setTimeout(() => {
        setInternalPaused(false);
      }, 600);
    }
  };

  const currentWord = words[activeIndex] || words[0];

  const handleActivate = () => {
    playSound("tap", { emphasis: "normal" });
    const targetUrl = `/contact?topic=${encodeURIComponent(currentWord.topic)}`;

    if (
      typeof document !== "undefined" &&
      "startViewTransition" in document &&
      !shouldReduceMotion
    ) {
      const doc = document as Document & {
        startViewTransition?: (callback: () => void | Promise<void>) => unknown;
      };
      if (doc.startViewTransition) {
        doc.startViewTransition(() => {
          router.push(targetUrl);
        });
      } else {
        router.push(targetUrl);
      }
    } else {
      router.push(targetUrl);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleActivate();
    } else if (e.key === "Escape") {
      setTooltipOpen(false);
    }
  };

  return (
    <span className={cn("inline-flex items-baseline", className)}>
      <TooltipProvider delay={0}>
        <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
          <TooltipTrigger
            delay={0}
            type="button"
            data-cuelume-tap
            aria-label={`Choose a topic: ${currentWord.word}`}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onClick={handleActivate}
            onKeyDown={handleKeyDown}
            className="group relative inline-grid items-baseline cursor-pointer text-left outline-none rounded-xs select-none font-display font-normal focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {/* Invisible sizer using the longest word: guarantees zero layout shift */}
            <span
              aria-hidden="true"
              className="invisible pointer-events-none select-none font-display underline decoration-dashed decoration-[1.5px] decoration-muted-foreground underline-offset-4"
              style={{ gridArea: "1 / 1" }}
            >
              {longestWord}
            </span>

            {/* Animated Word Display */}
            <span
              className="relative inline-flex items-baseline"
              style={{ gridArea: "1 / 1" }}
            >
              {shouldReduceMotion ? (
                <span className="font-display text-foreground underline decoration-dashed decoration-[1.5px] decoration-muted-foreground group-hover:decoration-foreground underline-offset-4 transition-colors">
                  {words[0].word}
                </span>
              ) : (
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={currentWord.word}
                    initial={{ y: 16, opacity: 0, filter: "blur(6px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: -16, opacity: 0, filter: "blur(6px)" }}
                    transition={{
                      duration: durationNormal,
                      ease,
                    }}
                    className="inline-block font-display text-foreground underline decoration-dashed decoration-[1.5px] decoration-muted-foreground group-hover:decoration-foreground underline-offset-4 transition-colors"
                  >
                    {currentWord.word}
                  </motion.span>
                </AnimatePresence>
              )}
            </span>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            sideOffset={8}
            className="font-mono text-xs text-background bg-foreground px-2.5 py-1 rounded-md shadow-lg pointer-events-none"
          >
            <span>{currentWord.tip}</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </span>
  );
}

/**
 * Progress Dots Indicator for WordSwap
 */
export function WordSwapDots({
  activeIndex,
  onSelectIndex,
  onPause,
  onResume,
  className,
}: {
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  onPause?: () => void;
  onResume?: () => void;
  className?: string;
}) {
  const words = copy.cta.words;
  const { playSound } = useSound();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      role="tablist"
      aria-label="Topic word cycle selector"
      onPointerLeave={onResume}
      className={cn("flex items-center gap-1.5 select-none", className)}
    >
      {words.map((item, idx) => {
        const isActive = activeIndex === idx;
        return (
          <button
            key={item.topic}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`Jump to topic: ${item.word}`}
            onPointerEnter={() => {
              onSelectIndex(idx);
              onPause?.();
              playSound("select", { emphasis: "subtle" });
            }}
            onClick={() => {
              onSelectIndex(idx);
              onPause?.();
              playSound("select", { emphasis: "subtle" });
            }}
            className="group relative flex items-center justify-center size-6 p-1 rounded-full cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {/* Background / Inactive Dot Track */}
            <span
              className={cn(
                "size-2 rounded-full transition-colors duration-200",
                isActive
                  ? "opacity-0"
                  : "bg-muted-foreground/30 group-hover:bg-muted-foreground/60"
              )}
            />

            {/* Active Filled Dot Sliding Between Dots via layoutId */}
            {isActive && (
              <motion.span
                layoutId="activeCtaFilledDot"
                className="absolute size-2 rounded-full bg-foreground"
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 450, damping: 30 }
                }
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
