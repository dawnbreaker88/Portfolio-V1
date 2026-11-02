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
import type { Favorite } from "@/types";

interface MusicTileProps {
  favorite: Favorite;
  index: number;
}

export function MusicTile({ favorite, index }: MusicTileProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isActive = isHovered || isFocused;

  return (
    <motion.div
      variants={shelfItemReveal}
      initial={shouldReduceMotion ? "visible" : "hidden"}
      animate="visible"
      custom={index}
      className="flex flex-col w-full"
    >
      <Tooltip open={isActive}>
        <TooltipTrigger
          render={
            favorite.href ? (
              <a
                href={favorite.href}
                target="_blank"
                rel="noopener noreferrer"
                className="outline-none block w-full select-none"
              />
            ) : (
              <div
                tabIndex={0}
                role="article"
                className="outline-none block w-full select-none"
              />
            )
          }
        >
          {/* Main animated container that lifts on hover/focus */}
          <motion.div
            whileHover={shouldReduceMotion ? undefined : { y: -6 }}
            whileFocus={shouldReduceMotion ? undefined : { y: -6 }}
            transition={springSoft}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="group relative w-full aspect-square outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-[10px]"
          >
            {/* Background shadow layer fading in via opacity */}
            <div className="absolute inset-0 rounded-[10px] shadow-[0_16px_32px_rgba(0,0,0,0.16)] dark:shadow-[0_16px_32px_rgba(0,0,0,0.5)] -z-20 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200 pointer-events-none" />

            {/* Vinyl Disc that rises UP by ~35% and rotates slowly while active */}
            <motion.div
              initial={{ y: "0%" }}
              animate={{
                y: isActive ? "-35%" : "0%",
                rotate: isActive && !shouldReduceMotion ? 360 : 0,
              }}
              transition={{
                y: springSoft,
                rotate: {
                  repeat: isActive && !shouldReduceMotion ? Infinity : 0,
                  duration: 4.5,
                  ease: "linear",
                },
              }}
              aria-hidden="true"
              className="absolute inset-x-3 sm:inset-x-4 top-0 aspect-square rounded-full border border-border-strong bg-[#121214] shadow-md -z-10 pointer-events-none flex items-center justify-center overflow-hidden"
            >
              {/* Concentric grooved rings */}
              <div className="absolute inset-2 sm:inset-3 rounded-full border border-white/10 dark:border-white/5" />
              <div className="absolute inset-5 sm:inset-6 rounded-full border border-white/10 dark:border-white/5" />
              <div className="absolute inset-8 sm:inset-9 rounded-full border border-white/10 dark:border-white/5" />
              <div className="absolute inset-11 sm:inset-12 rounded-full border border-white/10 dark:border-white/5" />

              {/* Center record label with spindle hole */}
              <div className="size-8 sm:size-10 rounded-full bg-muted/90 border border-border flex items-center justify-center">
                <div className="size-2 sm:size-2.5 rounded-full bg-background border border-border" />
              </div>
            </motion.div>

            {/* Sleeve front (sits over the lower portion of the vinyl) */}
            <div className="relative z-10 w-full h-full rounded-[10px] bg-card text-card-foreground border border-border group-hover:border-border-strong transition-colors overflow-hidden shadow-xs flex items-center justify-center">
              {favorite.cover ? (
                /* Clean album cover: no overlaid text or gradient */
                <Image
                  src={favorite.cover}
                  alt={favorite.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover"
                  loading="lazy"
                />
              ) : (
                /* Clean minimalist vinyl sleeve without text clutter */
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors">
                  <Icon name="lucide:disc-3" size={28} />
                </div>
              )}
            </div>
          </motion.div>
        </TooltipTrigger>

        {/* Tooltip appears BELOW the sleeve so it never collides with rising vinyl */}
        <TooltipContent
          side="bottom"
          sideOffset={10}
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
