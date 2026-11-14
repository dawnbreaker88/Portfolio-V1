"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface PixelCanvasProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Size of each pixel cell in pixels */
  gap?: number;
  /** Speed of the trailing decay (higher = faster fade) */
  speed?: number;
  /** Array of colors for pixels - will interpolate through them as trail fades */
  colors?: string[];
  /** Disable mouse tracking */
  noFocus?: boolean;
  /** Variant style */
  variant?: "default" | "trail" | "glow";
}

interface Pixel {
  x: number;
  y: number;
  size: number;
  intensity: number;
  targetIntensity: number;
  colorPhase: number;
}

// Helper to interpolate between two hex colors
function lerpColor(color1: string, color2: string, t: number): string {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  if (!c1 || !c2) return color1;

  const r = Math.round(c1.r + (c2.r - c1.r) * t);
  const g = Math.round(c1.g + (c2.g - c1.g) * t);
  const b = Math.round(c1.b + (c2.b - c1.b) * t);

  return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1]!, 16),
        g: parseInt(result[2]!, 16),
        b: parseInt(result[3]!, 16),
      }
    : null;
}

export function PixelCanvas({
  className,
  gap = 6,
  speed = 0.025,
  colors = ["#525252", "#a3a3a3", "#737373", "#e5e5e5"],
  noFocus = false,
  variant = "default",
  ...props
}: PixelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pixelsRef = useRef<Pixel[][]>([]);
  const activePixelsRef = useRef<Set<Pixel>>(new Set());
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const getColorFromIntensity = useCallback(
    (intensity: number, phase: number) => {
      if (colors.length === 0) return "#ffffff";
      if (colors.length === 1) return colors[0]!;

      // Use phase + intensity to create a shifting color effect
      const t = (phase + intensity) % 1;
      const index = Math.floor(t * (colors.length - 1));
      const nextIndex = Math.min(index + 1, colors.length - 1);
      const localT = (t * (colors.length - 1)) % 1;

      const color1 = colors[index];
      const color2 = colors[nextIndex];

      if (!color1) return "#ffffff";
      if (!color2) return color1!;

      return lerpColor(color1, color2, localT);
    },
    [colors]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let cols = 0;
    let rows = 0;
    const pixelSize = Math.max(gap, 4);
    let isVisible = true;

    const initPixels = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      cols = Math.ceil(rect.width / pixelSize);
      rows = Math.ceil(rect.height / pixelSize);

      activePixelsRef.current.clear();
      const newPixels: Pixel[][] = [];
      for (let i = 0; i < cols; i++) {
        const row: Pixel[] = [];
        for (let j = 0; j < rows; j++) {
          const existing = pixelsRef.current[i]?.[j];
          const pixel: Pixel = {
            x: i * pixelSize,
            y: j * pixelSize,
            size: pixelSize - 1,
            intensity: existing?.intensity ?? 0,
            targetIntensity: 0,
            colorPhase: Math.random(),
          };
          if (pixel.intensity > 0.01) {
            activePixelsRef.current.add(pixel);
          }
          row.push(pixel);
        }
        newPixels.push(row);
      }
      pixelsRef.current = newPixels;
    };

    const draw = (timestamp: number) => {
      if (!isVisible) {
        animationRef.current = 0;
        return;
      }

      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      const rect = container.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const { x: mouseX, y: mouseY } = mouseRef.current;
      const pixels = pixelsRef.current;
      const activePixels = activePixelsRef.current;

      const radius = variant === "glow" ? 120 : 80;
      const glowPasses = variant === "glow" ? 2 : 1;
      const radiusSq = radius * radius;

      // 1. Spatially bounded mouse illumination — only check cells within radius
      if (mouseX > -500 && mouseY > -500 && cols > 0 && rows > 0) {
        const minCol = Math.max(0, Math.floor((mouseX - radius) / pixelSize));
        const maxCol = Math.min(cols - 1, Math.ceil((mouseX + radius) / pixelSize));
        const minRow = Math.max(0, Math.floor((mouseY - radius) / pixelSize));
        const maxRow = Math.min(rows - 1, Math.ceil((mouseY + radius) / pixelSize));

        for (let i = minCol; i <= maxCol; i++) {
          const col = pixels[i];
          if (!col) continue;

          for (let j = minRow; j <= maxRow; j++) {
            const pixel = col[j];
            if (!pixel) continue;

            const centerX = pixel.x + pixel.size / 2;
            const centerY = pixel.y + pixel.size / 2;
            const dx = mouseX - centerX;
            const dy = mouseY - centerY;
            const distSq = dx * dx + dy * dy;

            if (distSq < radiusSq) {
              const distance = Math.sqrt(distSq);
              const falloff = 1 - distance / radius;
              pixel.targetIntensity = Math.pow(falloff, 1.5);
              activePixels.add(pixel);
            }
          }
        }
      }

      // 2. Process and draw only active pixels (99%+ faster than iterating all pixels)
      if (activePixels.size > 0) {
        const toRemove: Pixel[] = [];

        for (const pixel of activePixels) {
          const centerX = pixel.x + pixel.size / 2;
          const centerY = pixel.y + pixel.size / 2;
          const dx = mouseX - centerX;
          const dy = mouseY - centerY;
          const distSq = dx * dx + dy * dy;

          // If mouse is far away or offscreen, decay to 0
          if (distSq >= radiusSq || mouseX < -500) {
            pixel.targetIntensity = 0;
          }

          const lerpSpeed =
            pixel.targetIntensity > pixel.intensity ? 0.3 : speed;
          pixel.intensity +=
            (pixel.targetIntensity - pixel.intensity) * lerpSpeed;
          pixel.colorPhase =
            (pixel.colorPhase + 0.001 * (deltaTime / 16)) % 1;

          if (pixel.intensity > 0.01) {
            const color = getColorFromIntensity(
              pixel.intensity,
              pixel.colorPhase
            );

            // Glow variant pass
            if (variant === "glow" && pixel.intensity > 0.2) {
              for (let g = glowPasses; g > 0; g--) {
                const glowSize = pixel.size + g * 4;
                const glowOffset = (glowSize - pixel.size) / 2;
                ctx.globalAlpha = (pixel.intensity * 0.15) / g;
                ctx.fillStyle = color;
                ctx.fillRect(
                  pixel.x - glowOffset,
                  pixel.y - glowOffset,
                  glowSize,
                  glowSize
                );
              }
            }

            ctx.globalAlpha = pixel.intensity * 0.9;
            ctx.fillStyle = color;

            if (variant === "trail") {
              const cornerRadius = pixel.size * 0.3;
              ctx.beginPath();
              ctx.roundRect(
                pixel.x,
                pixel.y,
                pixel.size,
                pixel.size,
                cornerRadius
              );
              ctx.fill();
            } else {
              ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
            }
          } else {
            pixel.intensity = 0;
            toRemove.push(pixel);
          }
        }

        for (const p of toRemove) {
          activePixels.delete(p);
        }
      }

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(draw);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      if (isVisible && !animationRef.current) {
        lastTimeRef.current = performance.now();
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    const onMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        if (touch) {
          const rect = canvas.getBoundingClientRect();
          mouseRef.current = {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top,
          };
          if (isVisible && !animationRef.current) {
            lastTimeRef.current = performance.now();
            animationRef.current = requestAnimationFrame(draw);
          }
        }
      }
    };

    const onTouchEnd = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    // Pause execution when footer is outside the viewport to preserve 0 CPU
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry?.isIntersecting ?? true;
        if (isVisible) {
          lastTimeRef.current = performance.now();
          if (!animationRef.current) {
            animationRef.current = requestAnimationFrame(draw);
          }
        } else {
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = 0;
          }
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    initPixels();
    lastTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(draw);

    window.addEventListener("resize", initPixels);

    // Track mouse events from the closest footer/parent so pointer-events-none on canvas still receives all cursor moves
    const target = container.closest("footer") || container.parentElement || container;
    if (!noFocus) {
      target.addEventListener("mousemove", onMouseMove as EventListener);
      target.addEventListener("mouseleave", onMouseLeave as EventListener);
      target.addEventListener("touchmove", onTouchMove as EventListener, {
        passive: true,
      });
      target.addEventListener("touchend", onTouchEnd as EventListener);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      observer.disconnect();
      window.removeEventListener("resize", initPixels);
      if (!noFocus) {
        target.removeEventListener("mousemove", onMouseMove as EventListener);
        target.removeEventListener("mouseleave", onMouseLeave as EventListener);
        target.removeEventListener("touchmove", onTouchMove as EventListener);
        target.removeEventListener("touchend", onTouchEnd as EventListener);
      }
    };
  }, [gap, speed, noFocus, variant, getColorFromIntensity]);

  return (
    <div
      ref={containerRef}
      className={cn("h-full w-full relative overflow-hidden", className)}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
