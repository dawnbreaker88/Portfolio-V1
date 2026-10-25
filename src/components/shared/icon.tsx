"use client";

import { Icon as IconifyIcon } from "@iconify/react";
import { cn } from "@/lib/utils";

export type IconProps = {
  name: string;
  className?: string;
  size?: number;
};

export function Icon({ name, className, size = 18 }: IconProps) {
  return (
    <span
      className={cn("inline-flex items-center justify-center shrink-0", className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <IconifyIcon icon={name} width={size} height={size} />
    </span>
  );
}
