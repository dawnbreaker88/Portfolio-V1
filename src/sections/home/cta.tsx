"use client";

import React, { useState } from "react";
import Link from "next/link";
import { copy } from "@/data/copy";
import { Icon } from "@/components/shared/icon";
import { cn } from "@/lib/utils";

export function CtaSection() {
  const [hovered, setHovered] = useState(false);

  return (
    <section aria-labelledby="cta-heading" className="mb-20">
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-2xl border border-border/80 bg-card/40 backdrop-blur-md text-left">
        <div className="flex items-start gap-4">
          {/* Sparkle icon */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border/70 bg-muted/40 text-foreground shrink-0 mt-0.5">
            <Icon name="lucide:sparkles" size={18} />
          </div>

          <div>
            <h2
              id="cta-heading"
              className="font-display text-2xl sm:text-3xl font-normal text-foreground tracking-tight"
            >
              {copy.cta.headline}
            </h2>
            <p className="font-mono text-xs sm:text-sm text-muted-foreground mt-1 max-w-md">
              {copy.cta.subline}
            </p>
          </div>
        </div>

        {/* CTA Button with Hover Swap */}
        <Link
          href="/contact"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={cn(
            "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full shrink-0",
            "bg-foreground text-background font-mono text-xs sm:text-sm font-medium",
            "transition-all duration-200 hover:scale-102 active:scale-97 shadow-md"
          )}
        >
          <span>{hovered ? copy.cta.buttonHover : copy.cta.buttonDefault}</span>
          <Icon
            name="lucide:arrow-right"
            size={14}
            className="transition-transform duration-150 group-hover:translate-x-1"
          />
        </Link>
      </div>
    </section>
  );
}
