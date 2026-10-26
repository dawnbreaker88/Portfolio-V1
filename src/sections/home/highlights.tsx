import React from "react";
import Link from "next/link";
import { highlights } from "@/data/highlights";
import { copy } from "@/data/copy";
import { SectionHeader } from "@/components/layout/section-header";
import { Icon } from "@/components/shared/icon";

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
          const Wrapper = isLink ? Link : "div";
          const wrapperProps = isLink
            ? {
                href: item.link as string,
                target: "_blank",
                rel: "noopener noreferrer",
                "data-cuelume-tap": true,
                "data-cuelume-emphasis": "subtle" as const,
                className:
                  "group block py-5 first:pt-0 last:pb-0 transition-colors text-left",
              }
            : {
                className: "block py-5 first:pt-0 last:pb-0 text-left",
              };

          return (
            <Wrapper key={idx} {...(wrapperProps as any)}>
              <div className="flex flex-col gap-1.5">
                {/* Top row: Label + Title (left) & Meta (right-aligned on desktop) */}
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-[13px] uppercase tracking-[0.08em] text-muted-foreground font-medium">
                      {item.label}
                    </span>
                    <span className="text-muted-foreground/30 text-xs">/</span>
                    <div className="inline-flex items-center gap-1">
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
            </Wrapper>
          );
        })}
      </div>
    </section>
  );
}
