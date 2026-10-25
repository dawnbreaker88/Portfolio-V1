import React from "react";
import { site } from "@/data/site";
import { copy } from "@/data/copy";
import { SectionHeader } from "@/components/layout/section-header";

export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-heading" className="mb-20 sm:mb-24">
      <SectionHeader
        title={copy.sections.about.title}
        index={copy.sections.about.index}
      />
      <div className="space-y-4 text-sm sm:text-base text-muted-foreground/90 font-sans leading-relaxed text-left">
        {site.bio.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
