"use client";

import { useEffect, useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import * as opentype from "opentype.js";
import { cn } from "@/lib/utils";

export interface SignatureProps {
  /** Text to generate signature for */
  text?: string;
  /** Color of the signature path */
  color?: string;
  /** Font size of the signature */
  fontSize?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Delay before animation starts in seconds */
  delay?: number;
  /** Additional CSS classes */
  className?: string;
  /** Only animate when in view */
  inView?: boolean;
  /** Only animate once */
  once?: boolean;
  /** Custom font URL to load */
  fontUrl?: string;
}

interface ScheduledChar {
  path: string;
  start: number;
  duration: number;
}

// Module-level cache so we never re-fetch or re-parse the font binary on re-renders
const fontCache = new Map<string, Promise<opentype.Font>>();

function loadFont(url: string): Promise<opentype.Font> {
  const cached = fontCache.get(url);
  if (cached) return cached;

  const promise = (async () => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to load font from "${url}" (status ${res.status})`);
    }
    const buffer = await res.arrayBuffer();
    return opentype.parse(buffer);
  })();

  fontCache.set(url, promise);
  promise.catch(() => {
    fontCache.delete(url);
  });

  return promise;
}

// Computes natural human handwriting timing weights for each character
function getCharTimingWeight(char: string, index: number): { weight: number; pauseBefore: number } {
  // Punctuation: quick decisive mark preceded by a natural pen lift pause
  if (char === "." || char === "!" || char === "?") {
    return { weight: 0.35, pauseBefore: 0.08 };
  }
  // Starting capital: generous time for introductory flourishing loop & downstroke
  if (index === 0) {
    return { weight: 1.85, pauseBefore: 0 };
  }
  const lower = char.toLowerCase();
  // Tall ascenders/descenders require more travel distance
  if ("bhtkldfgjpqy".includes(lower)) {
    return { weight: 1.15, pauseBefore: 0 };
  }
  // Wide characters
  if ("mw".includes(lower)) {
    return { weight: 1.25, pauseBefore: 0 };
  }
  // Quick cursive connectors & vowels
  return { weight: 0.85, pauseBefore: 0 };
}

export function Signature({
  text = "Prabhath.",
  color = "currentColor",
  fontSize = 64,
  duration = 1.4,
  delay = 0,
  className,
  inView = true,
  once = true,
  fontUrl,
}: SignatureProps) {
  const [items, setItems] = useState<ScheduledChar[]>([]);
  const [svgSize, setSvgSize] = useState<{ width: number; height: number }>({
    width: 320,
    height: 120,
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const rawId = useId();
  const maskId = `sig-mask-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      try {
        const candidatePaths = fontUrl
          ? [fontUrl]
          : [
              "/LastoriaBoldRegular.otf",
              "https://www.componentry.fun/LastoriaBoldRegular.otf",
            ];

        let font: opentype.Font | null = null;
        for (const path of candidatePaths) {
          try {
            font = await loadFont(path);
            if (font) break;
          } catch {
            // Try next candidate path
          }
        }

        if (!font) {
          throw new Error("Signature font could not be loaded from any source");
        }

        if (isCancelled) return;

        let x = 0;
        const rawGlyphs: { glyph: opentype.Glyph; x: number; char: string; index: number }[] = [];
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        for (let i = 0; i < text.length; i++) {
          const char = text[i]!;
          const glyph = font.charToGlyph(char);
          const path = glyph.getPath(x, 0, fontSize);
          const bb = path.getBoundingBox();

          if (path.commands && path.commands.length > 0) {
            if (bb.x1 < minX) minX = bb.x1;
            if (bb.y1 < minY) minY = bb.y1;
            if (bb.x2 > maxX) maxX = bb.x2;
            if (bb.y2 > maxY) maxY = bb.y2;
          }

          rawGlyphs.push({ glyph, x, char, index: i });
          const advanceWidth = glyph.advanceWidth ?? font.unitsPerEm;
          x += advanceWidth * (fontSize / font.unitsPerEm);
        }

        if (!isFinite(minX)) {
          minX = 0;
          minY = 0;
          maxX = x || fontSize;
          maxY = fontSize;
        }

        const padX = fontSize * 0.15;
        const padY = fontSize * 0.15;
        const totalWidth = Math.ceil(maxX - minX + padX * 2);
        const totalHeight = Math.ceil(maxY - minY + padY * 2);
        const offsetX = -minX + padX;
        const offsetY = -minY + padY;

        // Collect positioned paths with organic timings
        const charTimings: { path: string; weight: number; pauseBefore: number }[] = [];
        for (const { glyph, x: charX, char, index } of rawGlyphs) {
          const path = glyph.getPath(charX + offsetX, offsetY, fontSize);
          const timing = getCharTimingWeight(char, index);
          charTimings.push({
            path: path.toPathData(2),
            weight: timing.weight,
            pauseBefore: timing.pauseBefore,
          });
        }

        const totalWeight = charTimings.reduce((sum, item) => sum + item.weight, 0);
        let currentDelay = delay;
        const scheduled: ScheduledChar[] = [];

        for (let i = 0; i < charTimings.length; i++) {
          const { path, weight, pauseBefore } = charTimings[i]!;
          const charDuration = (weight / totalWeight) * duration * 1.35;
          currentDelay += pauseBefore;
          const start = currentDelay;
          
          // Overlap cursive characters by 28% so ink flows naturally into the subsequent stroke
          const isPunctuation = i === charTimings.length - 1 && (".!?".includes(text[i] || ""));
          const overlap = !isPunctuation && i < charTimings.length - 1 ? charDuration * 0.28 : 0;
          currentDelay += (charDuration - overlap);

          scheduled.push({
            path,
            start: Number(start.toFixed(3)),
            duration: Math.max(0.08, Number(charDuration.toFixed(3))),
          });
        }

        if (!isCancelled) {
          setSvgSize({ width: totalWidth, height: totalHeight });
          setItems(scheduled);
          setIsLoaded(true);
        }
      } catch (error) {
        console.error("Signature component font load error:", error);
        if (!isCancelled) {
          setItems([]);
          setIsLoaded(false);
        }
      }
    }

    load();

    return () => {
      isCancelled = true;
    };
  }, [text, fontSize, fontUrl, duration, delay]);

  const maskVariants = {
    hidden: { pathLength: 0, opacity: 0, fillOpacity: 0 },
    visible: { pathLength: 1, opacity: 1, fillOpacity: 1 },
  };

  // Graceful fallback while font loads or if reduced motion is requested
  if (!isLoaded || items.length === 0) {
    return (
      <span
        className={cn(
          "font-display text-4xl sm:text-5xl md:text-6xl font-normal text-foreground tracking-tight select-none inline-block",
          className
        )}
      >
        {text}
      </span>
    );
  }

  return (
    <motion.svg
      key={`${items.length}-${text}`}
      viewBox={`0 0 ${svgSize.width} ${svgSize.height}`}
      fill="none"
      className={cn(
        "text-foreground overflow-visible select-none inline-block",
        className
      )}
      initial="hidden"
      whileInView={inView ? "visible" : undefined}
      animate={inView ? undefined : "visible"}
      viewport={{ once, amount: 0.15 }}
      role="img"
      aria-label={text}
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          {items.map((item, i) => (
            <motion.path
              key={`mask-${i}`}
              d={item.path}
              stroke="white"
              strokeWidth={fontSize * 0.48}
              fill="white"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={maskVariants}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : {
                      pathLength: {
                        delay: item.start,
                        duration: item.duration,
                        ease: [0.22, 1, 0.36, 1], // Natural pen stroke velocity curve
                      },
                      opacity: {
                        delay: item.start,
                        duration: 0.01,
                      },
                      fillOpacity: {
                        delay: item.start + item.duration * 0.72,
                        duration: Math.max(0.06, item.duration * 0.28),
                        ease: "easeOut",
                      },
                    }
              }
            />
          ))}
        </mask>
      </defs>

      {/* Solid filled cursive signature revealed by organic handwriting ink mask */}
      <g mask={`url(#${maskId})`}>
        {items.map((item, i) => (
          <path key={`fill-${i}`} d={item.path} fill={color} />
        ))}
      </g>
    </motion.svg>
  );
}