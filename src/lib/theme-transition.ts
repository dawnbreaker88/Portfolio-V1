"use client";

import { flushSync } from "react-dom";

/**
 * Triggers a dark/light theme switch using the View Transitions API
 * with the circular SVG blur mask animation.
 */
export function toggleThemeWithTransition(
  targetTheme: string,
  setTheme: (theme: string) => void
) {
  if (
    typeof document === "undefined" ||
    !("startViewTransition" in document) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    setTheme(targetTheme);
    return;
  }

  const doc = document as Document & {
    startViewTransition?: (callback: () => void | Promise<void>) => {
      ready: Promise<void>;
      finished: Promise<void>;
      updateCallbackDone: Promise<void>;
    };
  };

  if (!doc.startViewTransition) {
    setTheme(targetTheme);
    return;
  }

  const isTargetDark =
    targetTheme === "dark" ||
    (targetTheme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  try {
    doc.startViewTransition(() => {
      // 1. Instantly toggle class for immediate snapshot capture
      if (isTargetDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      // 2. Synchronously flush next-themes state in React
      flushSync(() => {
        setTheme(targetTheme);
      });
    });
  } catch {
    // If a transition is already in progress, fallback to standard setter
    setTheme(targetTheme);
  }
}
