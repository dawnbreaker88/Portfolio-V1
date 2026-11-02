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

  const isGif = resolvedSrc.toLowerCase().endsWith(".gif");

  return (
    <div
      className={`relative w-full h-[320px] sm:h-[380px] md:h-[420px] lg:h-[460px] overflow-hidden bg-background ${className || ""
        }`}
    >
      {/* 
        1. Ambient Glow Backdrop (Active in "ambient" mode):
        Expands the colors across wide desktop monitors with atmospheric blur.
        For animated GIFs, uses a lightweight GPU-accelerated gradient mesh to avoid decoding double GIFs simultaneously.
      */}
      {fit === "ambient" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          {isGif ? (
            <div
              className="w-full h-full opacity-40 dark:opacity-30 blur-3xl scale-125"
              style={{
                background: "radial-gradient(circle at 50% 50%, rgba(120, 119, 198, 0.35) 0%, rgba(59, 130, 246, 0.2) 40%, transparent 75%)",
              }}
            />
          ) : (
            <Image
              src={resolvedSrc}
              alt=""
              fill
              aria-hidden="true"
              className="w-full h-full object-cover blur-3xl opacity-40 dark:opacity-35 scale-125 select-none"
            />
          )}
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

      {/* Top scrim for AA-legible frosted top bar (white in light mode, black in dark mode) */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-white/70 via-white/25 to-transparent dark:from-black/50 dark:via-black/20 pointer-events-none z-10" />

      {/* Bottom gradient fade seamlessly blending into page background */}
      <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none z-10" />

      {/* Subtle side vignettes to soften wide edges */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/35 via-transparent to-background/35 pointer-events-none z-10" />
    </div>
  );
}
