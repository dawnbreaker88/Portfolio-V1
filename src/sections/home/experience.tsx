import React from "react";
import { experience } from "@/data/experience";
import { copy } from "@/data/copy";
import { SectionHeader } from "@/components/layout/section-header";

export function ExperienceSection() {
  return (
    <section id="experience" aria-labelledby="experience-heading" className="mb-20 sm:mb-24">
      <SectionHeader
        title={copy.sections.experience.title}
        index={copy.sections.experience.index}
      />

      <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-border/60">
        {experience.map((item, index) => (
          <div key={index} className="relative group text-left">
            {/* Timeline Dot */}
            <div
              className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-foreground border-2 border-background ring-2 ring-border/50"
              aria-hidden="true"
            />

            {/* Role & Period */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <h3 className="font-display text-xl sm:text-2xl font-normal text-foreground tracking-tight">
                {item.role}
              </h3>
              <span className="font-mono text-xs text-muted-foreground">
                {item.period}
              </span>
            </div>

            {/* Organisation */}
            <p className="font-sans text-xs sm:text-sm text-muted-foreground/80 mt-0.5">
              {item.org}
            </p>

            {/* Bullet Points */}
            <ul className="list-disc list-inside mt-3 space-y-1.5 text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed">
              {item.points.map((point, pIdx) => (
                <li key={pIdx}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
