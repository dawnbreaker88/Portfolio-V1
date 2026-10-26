"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "./icon";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { Social } from "@/types";
import { cn } from "@/lib/utils";

export type SocialHoverCardProps = {
  social: Social;
  variant?: "icon" | "pill";
  className?: string;
};

export function SocialHoverCard({
  social,
  variant = "icon",
  className,
}: SocialHoverCardProps) {
  const profile = social.profile;

  // Render the base trigger button depending on variant
  const renderTrigger = (
    <Link
      href={social.href}
      target={social.href.startsWith("mailto:") ? undefined : "_blank"}
      rel="noopener noreferrer"
      data-cuelume-tap
      data-cuelume-emphasis="subtle"
      aria-label={`${social.name}, ${social.handle}`}
      className={
        variant === "pill"
          ? cn(
              "group flex items-center gap-3 px-4 py-2.5 rounded-full",
              "border border-border/80 hover:border-border-strong bg-card/60 backdrop-blur-sm text-foreground/80 hover:text-foreground hover:bg-muted/60",
              "transition-all duration-200 active:scale-97 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              className
            )
          : cn(
              "group relative flex items-center justify-center w-11 h-11 rounded-full",
              "border border-border/80 bg-card/60 backdrop-blur-sm text-foreground/80",
              "transition-all duration-200 hover:scale-105 hover:border-border-strong hover:text-foreground hover:bg-muted/60",
              "active:scale-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              className
            )
      }
    >
      {variant === "pill" ? (
        <>
          <div className="flex items-center justify-center size-7 rounded-full bg-muted/70 group-hover:bg-muted text-foreground/80 group-hover:text-foreground shrink-0 transition-colors">
            <Icon name={social.icon} size={15} />
          </div>
          <div className="text-left min-w-0 pr-1">
            <span className="block font-sans font-medium text-xs text-foreground">
              {social.name}
            </span>
            <span className="block font-mono text-[11px] text-muted-foreground">
              {social.handle}
            </span>
          </div>
        </>
      ) : (
        <Icon name={social.icon} size={18} />
      )}
    </Link>
  );

  // If no profile data exists (e.g., standard email link), render standalone trigger
  if (!profile) {
    return renderTrigger;
  }

  return (
    <HoverCard>
      {/* 
        HoverCardTrigger configuration:
        - openDelay 100ms, closeDelay 100ms
        - Opens on keyboard focus as well
        - Touch devices bypass hover and follow link directly via CSS media query below
      */}
      <HoverCardTrigger
        delay={100}
        closeDelay={100}
        render={renderTrigger}
      />

      <HoverCardContent
        side="bottom"
        align="start"
        sideOffset={10}
        className={cn(
          "w-[320px] p-5 rounded-2xl bg-card border border-border-strong",
          "shadow-[0_12px_40px_rgb(0_0_0/0.35)] z-50 text-left outline-hidden select-none",
          // Suppress hover card rendering on touch devices (tap follows link immediately)
          "[@media(hover:none)]:hidden",
          // Motion tokens: durationFast (150ms), ease.out, transform-origin from trigger
          "duration-150 ease-out origin-(--transform-origin)",
          "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-[0.96] data-open:slide-in-from-top-1.5",
          "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-[0.96] data-closed:duration-100",
          // Reduced motion: opacity only, zero translation/scaling
          "motion-reduce:data-open:slide-in-from-top-0 motion-reduce:data-open:zoom-in-100 motion-reduce:data-closed:zoom-out-100"
        )}
      >
        <div className="flex flex-col">
          {/* Row 1: 56px round avatar, Name, Handle, and Platform Icon */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="relative size-14 rounded-full overflow-hidden border border-border/80 shrink-0 bg-muted/60 flex items-center justify-center">
                {profile.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt={profile.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center size-full bg-muted/80 text-foreground">
                    <Icon name={social.icon} size={24} />
                  </div>
                )}
              </div>

              <div className="flex flex-col min-w-0">
                <span className="font-sans text-base font-medium text-foreground truncate">
                  {profile.name}
                </span>
                <span className="font-mono text-[13px] text-muted-foreground truncate">
                  {profile.handle}
                </span>
              </div>
            </div>

            <Icon
              name={social.icon}
              size={16}
              className="text-muted-foreground/80 shrink-0 mt-0.5"
            />
          </div>

          {/* Row 2: Bio (sans 14px, secondary text, 3-line clamp) */}
          {profile.bio && (
            <p className="font-sans text-sm text-muted-foreground line-clamp-3 leading-relaxed mt-3.5">
              {profile.bio}
            </p>
          )}

          {/* Row 3: Location / Meta row */}
          {profile.location && (
            <div className="mt-3 flex items-center gap-1.5 text-muted-foreground font-mono text-[13px]">
              <Icon name={profile.locationIcon || "lucide:map-pin"} size={14} className="shrink-0" />
              <span>{profile.location}</span>
            </div>
          )}

          {/* Row 4: Stats row (only if stats exist: hairline top border, 16px top padding, 24px gap) */}
          {profile.stats && profile.stats.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border-strong/40 flex items-center gap-6">
              {profile.stats.map((stat, idx) => (
                <div key={idx} className="flex items-baseline gap-1.5 font-mono text-[13px]">
                  <span className="font-medium text-foreground">{stat.value}</span>
                  <span className="text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
