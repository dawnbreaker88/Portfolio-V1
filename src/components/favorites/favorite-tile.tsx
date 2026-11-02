"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Icon } from "@/components/shared/icon";
import { springSoft, shelfItemReveal } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Favorite } from "@/types";

interface FavoriteTileProps {
  favorite: Favorite;
  index: number;
}

export function FavoriteTile({ favorite, index }: FavoriteTileProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isPoster = favorite.kind === "movie" || favorite.kind === "tv";

  // Aspect ratios and dimension classes per category (movies & TV use 2:3 tall poster ratio)
  const aspectClass = isPoster
    ? "aspect-[2/3] w-[92px] sm:w-[140px]"
    : favorite.kind === "anime"
    ? "aspect-[3/4] w-full"
    : "aspect-square w-full";

  const cardContent = (
    <div className="relative w-full h-full overflow-hidden rounded-[10px] flex items-center justify-center bg-card">
      {/* Background shadow layer fading in via opacity */}
      <div className="absolute inset-0 rounded-[10px] shadow-[0_12px_28px_rgba(0,0,0,0.14)] dark:shadow-[0_12px_28px_rgba(0,0,0,0.45)] -z-10 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200 pointer-events-none" />

      {favorite.cover ? (
        /* Clean poster artwork: zero text overlay */
        <Image
          src={favorite.cover}
          alt={favorite.title}
          fill
          sizes={
            isPoster
              ? "(max-width: 640px) 92px, 140px"
              : "(max-width: 640px) 50vw, 33vw"
          }
          className="object-cover"
          loading="lazy"
        />
      ) : (
        /* Clean minimalist placeholder poster without text clutter */
        <div className="w-full h-full flex flex-col items-center justify-center p-3 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors">
          <Icon
            name={
              favorite.kind === "movie"
                ? "lucide:film"
                : favorite.kind === "tv"
                ? "lucide:tv"
                : "lucide:clapperboard"
            }
            size={isPoster ? 22 : 26}
          />
        </div>
      )}
    </div>
  );

  const tileBody = (
    <motion.div
      whileHover={shouldReduceMotion ? undefined : { y: -6 }}
      whileFocus={shouldReduceMotion ? undefined : { y: -6 }}
      transition={springSoft}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={cn(
        "group relative block rounded-[10px] bg-card text-card-foreground border border-border group-hover:border-border-strong transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 select-none",
        aspectClass
      )}
    >
      {cardContent}
    </motion.div>
  );

  return (
    <motion.div
      variants={shelfItemReveal}
      initial={shouldReduceMotion ? "visible" : "hidden"}
      animate="visible"
      custom={index}
      className={cn(
        "flex flex-col",
        isPoster ? "w-[92px] sm:w-[140px] shrink-0" : "w-full"
      )}
    >
      <Tooltip open={isHovered || isFocused}>
        <TooltipTrigger
          render={
            favorite.href ? (
              <a
                href={favorite.href}
                target="_blank"
                rel="noopener noreferrer"
                className="outline-none"
              />
            ) : (
              <div tabIndex={0} role="article" className="outline-none" />
            )
          }
        >
          {tileBody}
        </TooltipTrigger>
        <TooltipContent
          side="top"
          sideOffset={8}
          className="max-w-xs font-sans text-xs leading-relaxed flex flex-col gap-0.5 text-background shadow-lg"
        >
          <span className="font-semibold text-background">
            {favorite.title}
            {favorite.year && (
              <span className="font-normal opacity-80"> ({favorite.year})</span>
            )}
          </span>
          <span className="text-background opacity-90 leading-normal">{favorite.note}</span>
        </TooltipContent>
      </Tooltip>
    </motion.div>
  );
}
