"use client";

import { forwardRef, useState, useEffect, type ComponentPropsWithoutRef } from "react";
import {
  Home,
  LayoutGrid,
  Search,
  UserRound,
  FolderGit2,
  Briefcase,
  Wrench,
  Sparkles,
  GitCommitHorizontal,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/cn";

export type AppDockItem = Readonly<{
  id: string;
  label: string;
  icon?: LucideIcon;
}>;

export type AppDockProps = Readonly<
  {
    items?: readonly AppDockItem[];
    activeId?: string;
    showLabels?: boolean;
    orientation?: "vertical" | "horizontal";
    onSelect?: (id: string) => void;
  } & Omit<ComponentPropsWithoutRef<"div">, "onSelect">
>;

export const DEFAULT_ITEMS: readonly AppDockItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "tech-stack", label: "Tech stack", icon: Wrench },
  { id: "github-activity", label: "GitHub", icon: GitCommitHorizontal },
  { id: "highlights", label: "Highlights", icon: Sparkles },
];

// App dock — launcher matching MacDock frosted tray + hover motion (horizontal or vertical on the right).
export const AppDock = forwardRef<HTMLDivElement, AppDockProps>(
  (
    {
      className,
      items = DEFAULT_ITEMS,
      activeId: activeIdProp,
      showLabels = false,
      orientation = "horizontal",
      onSelect,
      ...props
    },
    ref,
  ) => {
    const [activeId, setActiveId] = useState(
      activeIdProp ?? items[0]?.id ?? "",
    );
    const currentId = activeIdProp ?? activeId;

    useEffect(() => {
      if (activeIdProp !== undefined) {
        setActiveId(activeIdProp);
      }
    }, [activeIdProp]);

    const isVertical = orientation === "vertical";

    return (
      <div
        ref={ref}
        data-slot="app-dock"
        className={cn(
          "relative overflow-visible font-sans select-none",
          isVertical ? "pt-0" : "pt-10",
          className
        )}
        {...props}
      >
        <nav
          aria-label="App dock"
          className={cn(
            "rounded-2xl border border-white/15 dark:border-white/10",
            "bg-background/25 dark:bg-[#09090b]/35 shadow-2xl shadow-black/20",
            "backdrop-blur-xl backdrop-saturate-150",
            "supports-[backdrop-filter]:bg-background/25 dark:supports-[backdrop-filter]:bg-[#09090b]/30",
            "supports-[not(backdrop-filter:blur(1px))]:bg-background/90",
            isVertical
              ? "flex flex-col items-center gap-2 p-2"
              : "mx-auto inline-flex items-end gap-2.5 p-3"
          )}
        >
          {items.map((item) => {
            const Icon = item.icon ?? Home;
            const active = item.id === currentId;

            return (
              <button
                key={item.id}
                type="button"
                data-cuelume-select
                data-cuelume-emphasis="subtle"
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                onClick={() => {
                  setActiveId(item.id);
                  onSelect?.(item.id);
                }}
                className="group relative flex flex-col items-center outline-none cursor-pointer"
              >
                {/* Tooltip */}
                <span
                  className={cn(
                    "ease-smooth pointer-events-none absolute z-20 rounded-md border border-white/15 dark:border-white/10 bg-background/80 dark:bg-[#09090b]/80 backdrop-blur-xl px-2.5 py-1 text-[11px] font-mono text-foreground opacity-0 shadow-xl transition-[opacity,transform] duration-200 group-hover:opacity-100 group-focus-visible:opacity-100",
                    isVertical
                      ? "right-full mr-3.5 top-1/2 -translate-y-1/2 group-hover:-translate-x-0.5 group-focus-visible:-translate-x-0.5"
                      : "-top-10 left-1/2 -translate-x-1/2 group-hover:-translate-y-0.5 group-focus-visible:-translate-y-0.5"
                  )}
                >
                  {item.label}
                </span>

                {/* Animated Icon Box with MacDock hover motion */}
                <span
                  className={cn(
                    "ease-smooth flex size-10 sm:size-11 cursor-pointer items-center justify-center rounded-xl transition-all duration-300 will-change-transform group-hover:scale-125 group-focus-visible:scale-125",
                    isVertical
                      ? "origin-right group-hover:-translate-x-1"
                      : "origin-bottom group-hover:-translate-y-1.5",
                    active
                      ? "bg-foreground text-background shadow-md shadow-black/10"
                      : "bg-white/10 dark:bg-white/[0.07] hover:bg-white/20 dark:hover:bg-white/15 text-muted-foreground hover:text-foreground border border-white/10 dark:border-white/5 backdrop-blur-md",
                  )}
                >
                  <Icon size={18} aria-hidden strokeWidth={1.75} />
                </span>

                {showLabels ? (
                  <span className="mt-1 text-[10px] font-medium text-neutral-500">
                    {item.label}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>
    );
  },
);

AppDock.displayName = "AppDock";