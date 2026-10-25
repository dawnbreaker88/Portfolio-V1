"use client";

import Link from "next/link";
import { Icon } from "./icon";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { Social } from "@/types";
import { cn } from "@/lib/utils";

export type SocialButtonProps = {
  social: Social;
  className?: string;
};

export function SocialButton({ social, className }: SocialButtonProps) {
  return (
    <HoverCard>
      <HoverCardTrigger
        render={
          <Link
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            className={cn(
              "group relative flex items-center justify-center w-11 h-11 rounded-full",
              "border border-border/80 bg-card/60 backdrop-blur-sm text-foreground/80",
              "transition-all duration-200 hover:scale-105 hover:border-border-strong hover:text-foreground hover:bg-muted/60",
              "active:scale-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              className
            )}
          />
        }
      >
        <Icon name={social.icon} size={18} />
      </HoverCardTrigger>
      <HoverCardContent
        side="bottom"
        align="center"
        className="w-64 p-3 rounded-xl border border-border/80 bg-card/95 backdrop-blur-md shadow-xl text-left"
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm text-foreground">
              {social.name}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {social.handle}
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-sans leading-relaxed">
            {social.blurb}
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
