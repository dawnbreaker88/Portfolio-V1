"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Icon } from "./icon";
import { cn } from "@/lib/utils";

export type TechChipProps = {
  name: string;
  icon: string;
  className?: string;
};

export function TechChip({ name, icon, className }: TechChipProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.02 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      data-cuelume-tap
      className={cn(
        "group relative inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl cursor-default select-none",
        "border border-border/70 dark:border-white/10",
        "bg-card/70 dark:bg-[#111113]/80 backdrop-blur-md",
        "text-muted-foreground",
        // Invert on hover: turn BLACK in light mode, turn WHITE in dark mode
        "hover:bg-black hover:text-white hover:border-black hover:shadow-md hover:shadow-black/15",
        "dark:hover:bg-white dark:hover:text-black dark:hover:border-white dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]",
        "transition-all duration-200",
        className
      )}
    >
      <Icon
        name={icon}
        size={16}
        className="text-muted-foreground/80 group-hover:text-white dark:group-hover:text-black transition-all duration-200 group-hover:scale-110 shrink-0"
      />
      <span className="font-mono text-xs tracking-wide font-normal group-hover:font-medium group-hover:text-white dark:group-hover:text-black transition-colors duration-200">
        {name}
      </span>
    </motion.div>
  );
}

