"use client";

import React, { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BlogPostRow } from "./blog-post-row";
import { cn } from "@/lib/utils";
import type { Post } from "@/types";

interface BlogListProps {
  posts: Post[];
}

export function BlogList({ posts }: BlogListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTag = searchParams.get("tag");

  // Show tag filter chips only when total posts is 6 or more
  const showFilterChips = posts.length >= 6;

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((p) => {
      p.tags?.forEach((t) => tagSet.add(t));
    });
    return Array.from(tagSet).sort();
  }, [posts]);

  // Client-side filtering via ?tag= query param
  const filteredPosts = useMemo(() => {
    if (!currentTag) return posts;
    return posts.filter((p) =>
      p.tags?.some((t) => t.toLowerCase() === currentTag.toLowerCase())
    );
  }, [posts, currentTag]);

  // Pinned post (at most one)
  const pinnedPost = useMemo(() => {
    return filteredPosts.find((p) => p.pinned);
  }, [filteredPosts]);

  // Remaining posts grouped by year (newest year first)
  const groupedByYear = useMemo(() => {
    const remaining = filteredPosts.filter((p) => !p.pinned);
    const groups: Record<string, Post[]> = {};

    remaining.forEach((post) => {
      const year = post.date.slice(0, 4);
      if (!groups[year]) {
        groups[year] = [];
      }
      groups[year].push(post);
    });

    // Sort years descending (newest first)
    const sortedYears = Object.keys(groups).sort(
      (a, b) => Number(b) - Number(a)
    );

    return sortedYears.map((year) => ({
      year,
      posts: groups[year],
    }));
  }, [filteredPosts]);

  const handleSelectTag = (tag: string | null) => {
    if (!tag) {
      router.push("/blog", { scroll: false });
    } else {
      router.push(`/blog?tag=${encodeURIComponent(tag)}`, { scroll: false });
    }
  };

  // Track animation stagger index across all rendered rows
  let animationCounter = 0;

  return (
    <div className="w-full">
      {/* Tag filter chips: only rendered when there are 6+ posts */}
      {showFilterChips && (
        <div className="mb-10 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleSelectTag(null)}
            className={cn(
              "font-mono text-xs px-3 py-1 rounded-full border transition-colors",
              !currentTag
                ? "bg-foreground text-background border-foreground font-medium"
                : "border-border/80 bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/70"
            )}
          >
            All
          </button>
          {allTags.map((tag) => {
            const isActive =
              currentTag?.toLowerCase() === tag.toLowerCase();
            return (
              <button
                key={tag}
                type="button"
                onClick={() => handleSelectTag(isActive ? null : tag)}
                className={cn(
                  "font-mono text-xs px-3 py-1 rounded-full border transition-colors",
                  isActive
                    ? "bg-foreground text-background border-foreground font-medium"
                    : "border-border/80 bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/70"
                )}
              >
                {tag}
              </button>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="py-16 text-center border border-dashed border-border/70 rounded-2xl bg-card/20">
          <p className="font-mono text-xs text-muted-foreground mb-4">
            No posts found for tag &ldquo;{currentTag}&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => handleSelectTag(null)}
            className="font-mono text-xs underline underline-offset-4 text-foreground hover:text-muted-foreground transition-colors"
          >
            Clear tag filter
          </button>
        </div>
      )}

      {/* Pinned post: shown first with 'Start here' chip and 21px title on --muted bg with 12px radius */}
      {pinnedPost && (
        <div className="mb-10 sm:mb-12">
          <div className="md:flex md:gap-8 items-start">
            {/* Left column on 768px+: 64px (w-16), mono 13px muted, sticky under top bar */}
            <div className="hidden md:block w-16 shrink-0 pt-4">
              <span className="font-mono text-[13px] text-muted-foreground/80 sticky top-24 block uppercase tracking-wider">
                Pinned
              </span>
            </div>

            {/* Mobile year/label heading below 768px */}
            <div className="block md:hidden font-mono text-[13px] text-muted-foreground/80 uppercase tracking-wider mb-2.5 px-4">
              Pinned
            </div>

            {/* Right column: row */}
            <div className="flex-1 min-w-0">
              <BlogPostRow
                post={pinnedPost}
                index={animationCounter++}
                isPinned={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Year Groupings: 2 columns from 768px up (64px left sticky, right rows); mono heading below 768px */}
      <div className="space-y-12 sm:space-y-14">
        {groupedByYear.map(({ year, posts: yearPosts }) => (
          <section key={year} aria-labelledby={`year-${year}`} className="w-full">
            <div className="md:flex md:gap-8 items-start">
              {/* Left column on 768px+: 64px (w-16), mono 13px muted, sticky under top bar */}
              <div className="hidden md:block w-16 shrink-0 pt-4">
                <span
                  id={`year-${year}`}
                  className="font-mono text-[13px] text-muted-foreground sticky top-24 block"
                >
                  {year}
                </span>
              </div>

              {/* Mobile heading below 768px */}
              <h3
                id={`year-${year}-mobile`}
                className="block md:hidden font-mono text-[13px] text-muted-foreground mb-2.5 px-4"
              >
                {year}
              </h3>

              {/* Right column: that year's rows */}
              <div className="flex-1 min-w-0 flex flex-col gap-2 sm:gap-2.5">
                {yearPosts.map((post) => (
                  <BlogPostRow
                    key={post.title + post.date}
                    post={post}
                    index={animationCounter++}
                    isPinned={false}
                  />
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

