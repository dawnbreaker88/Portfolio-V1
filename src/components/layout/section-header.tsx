"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type SectionHeaderProps = {
  title: string;
  index?: string;
  action?: React.ReactNode;
  className?: string;
};

export function SectionHeader({
  title,
  index,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between w-full mb-6 select-none",
        className
      )}
    >
      <h2 className="font-display text-2xl sm:text-3xl text-foreground font-normal tracking-tight">
        {title}
      </h2>
      <div className="h-[1px] bg-border/60 flex-1 mx-4" aria-hidden="true" />
      <div className="flex items-center gap-3 shrink-0">
        {action}
        {index && (
          <span className="font-mono text-xs sm:text-sm text-muted-foreground tracking-widest">
            {index}
          </span>
        )}
      </div>
    </div>
  );
}
