import React from "react";
import Link from "next/link";
import { highlights } from "@/data/highlights";
import { copy } from "@/data/copy";
import { SectionHeader } from "@/components/layout/section-header";
import { Icon } from "@/components/shared/icon";
import { cn } from "@/lib/utils";

export function HighlightsSection() {
  if (!highlights || highlights.length === 0) {
    return null;
  }

  return (
    <section id="highlights" aria-labelledby="highlights-heading" className="mb-20 sm:mb-24">
      <SectionHeader
        title={copy.sections.highlights.title}
        index={copy.sections.highlights.index}
      />

      <div className="divide-y divide-border/60">
        {highlights.map((item, idx) => {
          const isLink = Boolean(item.link);
          const content = (
            <div className="flex flex-col gap-1.5">
              {/* Top row: Label + Title (left) & Meta (right-aligned on desktop) */}
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-md text-[11px] font-mono uppercase tracking-[0.08em] border font-medium shrink-0",
                      item.label.toLowerCase() === "research"
                        ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/25"
                        : item.label.toLowerCase() === "recognition"
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25"
                        : "bg-muted/60 text-muted-foreground border-border/70"
                    )}
                  >
                    {item.label}
                  </span>
                  <div className="inline-flex items-center gap-1.5">
                    <h3 className="font-display text-lg sm:text-xl font-normal text-foreground tracking-tight group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    {isLink && (
                      <Icon
                        name="lucide:arrow-up-right"
                        size={15}
                        className="text-muted-foreground group-hover:text-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0"
                      />
                    )}
                  </div>
                </div>

                {item.meta && (
                  <span className="font-mono text-[13px] text-muted-foreground shrink-0 sm:text-right">
                    {item.meta}
                  </span>
                )}
              </div>

              {/* Description text (sans 15px, secondary text) */}
              <p className="font-sans text-[14.5px] sm:text-[15px] text-muted-foreground leading-relaxed mt-0.5">
                {item.text}
              </p>
            </div>
          );

          if (item.link) {
            return (
              <Link
                key={idx}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                data-cuelume-tap
                data-cuelume-emphasis="subtle"
                className="group block py-5 first:pt-0 last:pb-0 transition-colors text-left"
              >
                {content}
              </Link>
            );
          }

          return (
            <div
              key={idx}
              className="block py-5 first:pt-0 last:pb-0 text-left"
            >
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}
