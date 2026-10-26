"use client";

import React from "react";
import Image from "next/image";

export interface ImageBannerProps {
  /**
   * Path to local image/GIF (e.g. "/banner.gif", "/blue.png", "/banner.webp")
   * or full remote URL (e.g. "https://...")
   */
  src: string;
  alt?: string;
  className?: string;
  /**
   * Display presentation:
   * - "ambient" (default): Centers un-cut image/GIF with an ambient blurred atmospheric glow
   *   filling wide desktop screens. Prevents chopping off heads/artwork on 16:9 or custom media.
   * - "cover": Edge-to-edge crop across the entire viewport.
   * - "contain": Centered un-cut image/GIF without the ambient blur glow.
   */
  fit?: "ambient" | "cover" | "contain";
  /**
   * Focal point when using "cover" mode: "center" | "top" | "bottom"
   */
  position?: "center" | "top" | "bottom" | string;
}

export function ImageBanner({
  src,
  alt = "Portfolio Banner",
  className,
  fit = "ambient",
  position = "center",
}: ImageBannerProps) {
  const resolvedSrc =
    src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")
      ? src
      : `/${src}`;

  const positionClass =
    position === "top"
      ? "object-top"
      : position === "bottom"
        ? "object-bottom"
        : position === "center"
          ? "object-center"
          : position;

  return (
    <div
      className={`relative w-full h-[320px] sm:h-[380px] md:h-[420px] lg:h-[460px] overflow-hidden bg-background ${className || ""
        }`}
    >
      {/* 
        1. Ambient Glow Backdrop (Active in "ambient" mode):
        Expands the colors and motion of the GIF/image across wide desktop monitors
        with heavy atmospheric blur so there are no awkward empty gaps or extreme cropping.
      */}
      {fit === "ambient" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          <Image
            src={resolvedSrc}
            alt=""
            fill
            unoptimized
            aria-hidden="true"
            className="w-full h-full object-cover blur-3xl opacity-40 dark:opacity-35 scale-125 select-none"
          />
          <div className="absolute inset-0 bg-background/25" />
        </div>
      )}

      {/* 
        2. Main Crisp Image / GIF Layer:
        - In "ambient" or "contain" mode: Uses object-contain so 100% of the artwork/animation is visible,
          preserving natural aspect ratio without cutting off any part on desktop.
        - In "cover" mode: Fills the screen edge-to-edge with the requested focal position.
      */}
      <div className="relative w-full h-full flex items-center justify-center">
        <Image
          src={resolvedSrc}
          alt={alt}
          fill
          priority
          unoptimized
          sizes="100vw"
          className={`w-full h-full select-none pointer-events-none ${fit === "cover"
              ? `object-cover ${positionClass}`
              : "object-contain max-w-5xl"
            }`}
        />
      </div>

      {/* Top scrim for AA-legible frosted top bar (black ~45% to transparent, ~120px) */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/50 via-black/20 to-transparent pointer-events-none z-10" />

      {/* Bottom gradient fade seamlessly blending into page background */}
      <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none z-10" />

      {/* Subtle side vignettes to soften wide edges */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/35 via-transparent to-background/35 pointer-events-none z-10" />
    </div>
  );
}
