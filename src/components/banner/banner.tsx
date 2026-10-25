"use client";

import React from "react";
import { TokyoRain } from "./tokyo-rain";
import { KyotoDusk } from "./kyoto-banner";
import { AuroraBanner } from "./aurora-banner";
import { BlackBanner } from "./black-banner";
import { ImageBanner } from "./image-banner";
import { site } from "@/data/site";
import type { BannerConfig, AsciiBannerVariant } from "@/types";

export type BannerVariant = AsciiBannerVariant | "tokyo-rain" | "kyoto-dusk" | "aurora-fjord" | "black-prism";

export interface BannerProps {
  /**
   * Fast swap shortcut:
   * - ASCII banners: "tokyo" | "kyoto" | "aurora" | "black"
   * - GIF / PNG / WebP: "/banner.gif" | "/blue.png" | "https://..."
   */
  active?: BannerVariant | string;
  /**
   * Presentation for images & GIFs:
   * - "ambient" (default): Un-cut crisp media centered with an atmospheric glowing backdrop
   * - "cover": Edge-to-edge crop
   * - "contain": Centered un-cut with dark background
   */
  fit?: "ambient" | "cover" | "contain";
  /**
   * Focal point when using "cover" mode: "center" | "top" | "bottom"
   */
  position?: "center" | "top" | "bottom" | string;
  /**
   * Explicit configuration object (matching site.banner in src/data/site.ts)
   */
  config?: BannerConfig;
  className?: string;
  alt?: string;
}

export function Banner({ active, config, className, alt, fit = "ambient", position = "center" }: BannerProps) {
  // 1. Direct active string prop (highest priority)
  if (active) {
    const lower = active.toLowerCase();
    if (lower === "tokyo" || lower === "tokyo-rain") {
      return <TokyoRain className={className} />;
    }
    if (lower === "kyoto" || lower === "kyoto-dusk") {
      return <KyotoDusk className={className} />;
    }
    if (lower === "aurora" || lower === "aurora-fjord") {
      return <AuroraBanner className={className} />;
    }
    if (lower === "black" || lower === "black-prism") {
      return <BlackBanner className={className} />;
    }
    // Any other string is treated as an image or GIF URL/path
    return (
      <ImageBanner
        src={active}
        alt={alt}
        className={className}
        fit={fit}
        position={position}
      />
    );
  }

  // 2. Explicit config prop or fallback to site.banner in src/data/site.ts
  const currentConfig = config || site.banner;

  if (currentConfig.type === "ascii") {
    const variant = currentConfig.variant?.toLowerCase();
    if (variant === "tokyo") return <TokyoRain className={className} />;
    if (variant === "kyoto") return <KyotoDusk className={className} />;
    if (variant === "aurora") return <AuroraBanner className={className} />;
    if (variant === "black") return <BlackBanner className={className} />;
    return <TokyoRain className={className} />;
  }

  if (
    currentConfig.type === "image" ||
    currentConfig.type === "gif" ||
    currentConfig.type === "video"
  ) {
    return (
      <ImageBanner
        src={currentConfig.src}
        alt={currentConfig.alt || alt}
        className={className}
        fit={("fit" in currentConfig ? currentConfig.fit : fit) || fit}
        position={("position" in currentConfig ? currentConfig.position : position) || position}
      />
    );
  }

  // Fallback default
  return <TokyoRain className={className} />;
}
