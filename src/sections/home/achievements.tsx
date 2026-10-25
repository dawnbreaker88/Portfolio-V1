import React from "react";
import Link from "next/link";
import { achievements } from "@/data/achievements";
import { copy } from "@/data/copy";
import { SectionHeader } from "@/components/layout/section-header";
import { Icon } from "@/components/shared/icon";

export function AchievementsSection() {
  return (
    <section id="achievements" aria-labelledby="achievements-heading" className="mb-20 sm:mb-24">
      <SectionHeader
        title={copy.sections.achievements.title}
        index={copy.sections.achievements.index}
      />

      <div className="space-y-3">
        {achievements.map((item, idx) => {
          const content = (
            <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-border/70 bg-card/40 backdrop-blur-sm transition-all duration-150 hover:border-border-strong hover:bg-card/70 group text-left">
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Trophy icon circle */}
                <div className="flex items-center justify-center w-9 h-9 rounded-full border border-border/70 bg-muted/40 text-muted-foreground group-hover:text-foreground shrink-0 transition-colors">
                  <Icon name="lucide:trophy" size={16} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-lg sm:text-xl font-normal text-foreground tracking-tight truncate">
                    {item.title}
                  </h3>
                  <p className="font-sans text-xs text-muted-foreground mt-0.5">
                    {item.issuer}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-xs text-muted-foreground">
                  {item.year}
                </span>
                {item.link && (
                  <Icon
                    name="lucide:arrow-up-right"
                    size={13}
                    className="text-muted-foreground group-hover:text-foreground transition-colors"
                  />
                )}
              </div>
            </div>
          );

          return item.link ? (
            <Link
              key={idx}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              {content}
            </Link>
          ) : (
            <div key={idx}>{content}</div>
          );
        })}
      </div>
    </section>
  );
}
