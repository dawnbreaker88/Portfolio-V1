"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Icon } from "@/components/shared/icon";
import { copy } from "@/data/copy";
import { toggleThemeWithTransition } from "@/lib/theme-transition";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  if (!mounted) {
    return <div className="w-8 h-8 rounded-full" aria-hidden="true" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      data-cuelume-toggle
      data-cuelume-emphasis="subtle"
      onClick={() =>
        toggleThemeWithTransition(isDark ? "light" : "dark", setTheme)
      }
      aria-label={copy.topBar.themeToggleAria}
      className={cn(
        "relative flex items-center justify-center w-8 h-8 rounded-full",
        "text-muted-foreground hover:text-foreground transition-all duration-200",
        "hover:bg-muted/60 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        className
      )}
    >
      <Icon
        name={isDark ? "lucide:sun" : "lucide:moon"}
        size={16}
        className="transition-transform duration-200 hover:rotate-12"
      />
    </button>
  );
}
