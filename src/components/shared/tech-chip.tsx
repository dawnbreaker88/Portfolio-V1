"use client";

import { Icon } from "./icon";
import { cn } from "@/lib/utils";

export type TechChipProps = {
  name: string;
  icon: string;
  className?: string;
};

export function TechChip({ name, icon, className }: TechChipProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl",
        "bg-card/80 border border-border/70 backdrop-blur-sm",
        "text-foreground text-xs font-mono tracking-wide",
        "transition-all duration-150 hover:border-border-strong hover:bg-muted/50",
        className
      )}
    >
      <Icon name={icon} size={16} />
      <span>{name}</span>
    </div>
  );
}
