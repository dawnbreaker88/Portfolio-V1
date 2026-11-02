"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ImageBanner } from "./image-banner";
import { site } from "@/data/site";
import type { BannerConfig, AsciiBannerVariant } from "@/types";

const BannerSkeleton = ({ className }: { className?: string }) => (
  <div className={`w-full h-[320px] sm:h-[380px] md:h-[420px] lg:h-[460px] bg-background/40 ${className || ""}`} />
);

const TokyoRain = dynamic(() => import("./tokyo-rain").then((m) => m.TokyoRain), {
  ssr: false,
  loading: () => <BannerSkeleton />,
});

const KyotoDusk = dynamic(() => import("./kyoto-banner").then((m) => m.KyotoDusk), {
  ssr: false,
  loading: () => <BannerSkeleton />,
});

const AuroraBanner = dynamic(() => import("./aurora-banner").then((m) => m.AuroraBanner), {
  ssr: false,
  loading: () => <BannerSkeleton />,
});

const BlackBanner = dynamic(() => import("./black-banner").then((m) => m.BlackBanner), {
  ssr: false,
  loading: () => <BannerSkeleton />,
});

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
