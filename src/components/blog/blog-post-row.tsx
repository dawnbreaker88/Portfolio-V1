"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Icon } from "@/components/shared/icon";
import { blogRowReveal } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Post } from "@/types";

interface BlogPostRowProps {
  post: Post;
  index: number;
  isPinned?: boolean;
}

export function BlogPostRow({ post, index, isPinned = false }: BlogPostRowProps) {
  const shouldReduceMotion = useReducedMotion();
  const isExternal = "href" in post && typeof post.href === "string";
  const targetUrl = isExternal ? post.href : `/blog/${post.slug}`;
  const sourceLabel = isExternal ? post.sourceLabel ?? "old blog" : null;

  const content = (
    <>
      {/* Background overlay for smooth opacity-based fade */}
      <div
        className={cn(
          "absolute inset-0 rounded-[12px] -z-10 transition-opacity duration-200 pointer-events-none",
          isPinned
            ? "bg-muted/70 dark:bg-muted/40 opacity-100 group-hover:opacity-90"
            : "bg-muted/60 dark:bg-muted/40 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
        )}
      />

      <div className="flex flex-col gap-2">
        {/* Title row */}
        <div className="flex items-start justify-between gap-4">
          <h2
            className={cn(
              "font-display font-normal text-foreground leading-snug transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transform-none",
              isPinned
                ? "text-[21px] sm:text-[22px]"
                : "text-[19px] sm:text-[21px]"
            )}
          >
            {post.title}
          </h2>

          {/* Iconify arrow-up-right indicator */}
          <span
            aria-hidden="true"
            className="inline-flex shrink-0 pt-1 text-muted-foreground/60 transition-all duration-200 opacity-0 group-hover:opacity-100 group-hover:text-foreground group-hover:translate-x-[3px] group-hover:-translate-y-[3px] group-focus-visible:opacity-100 group-focus-visible:text-foreground group-focus-visible:translate-x-[3px] group-focus-visible:-translate-y-[3px] motion-reduce:transform-none motion-reduce:opacity-100"
          >
            <Icon name="lucide:arrow-up-right" size={17} />
          </span>
        </div>

        {/* 1-2 line summary */}
        <p className="font-sans text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {post.summary}
        </p>

        {/* Mono meta line */}
        <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs text-muted-foreground">
          {isPinned && (
            <span className="font-mono text-[11px] sm:text-xs font-medium px-2 py-0.5 rounded-full border border-primary/25 bg-primary/10 text-foreground dark:text-white">
              Start here
            </span>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[11px] sm:text-xs px-2 py-0.5 rounded-full border border-border/80 bg-background/60 dark:bg-card/50 text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {post.readingTime && (
            <span className="text-[11px] sm:text-xs text-muted-foreground/80">
              {post.readingTime}
            </span>
          )}

          {isExternal && sourceLabel && (
            <span className="text-[11px] sm:text-xs text-muted-foreground/70">
              on {sourceLabel} ↗
            </span>
          )}
        </div>
      </div>
    </>
  );

  const sharedClassName = cn(
    "group relative block w-full text-left rounded-[12px] p-4 sm:p-5 transition-colors outline-none focus-visible:ring-1 focus-visible:ring-ring",
    isPinned
      ? "border border-border/80 shadow-xs"
      : "border border-transparent"
  );

  return (
    <motion.div
      variants={blogRowReveal}
      initial={shouldReduceMotion ? "visible" : "hidden"}
      animate="visible"
      custom={index}
      className="w-full"
    >
      {isExternal ? (
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-cuelume-tap
          data-cuelume-emphasis="subtle"
          className={sharedClassName}
        >
          {content}
        </a>
      ) : (
        <Link
          href={targetUrl}
          data-cuelume-tap
          data-cuelume-emphasis="subtle"
          className={sharedClassName}
        >
          {content}
        </Link>
      )}
    </motion.div>
  );
}

