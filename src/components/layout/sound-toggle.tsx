"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@/components/shared/icon";
import { useSound } from "@/providers/sound-provider";
import { cn } from "@/lib/utils";

export function SoundToggle({ className }: { className?: string }) {
  const { soundEnabled, toggleSound } = useSound();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8 rounded-full" aria-hidden="true" />;
  }

  return (
    <button
      type="button"
      onClick={toggleSound}
      aria-label={soundEnabled ? "Mute interaction sounds" : "Enable interaction sounds"}
      title={soundEnabled ? "Mute sounds" : "Unmute sounds"}
      className={cn(
        "relative flex items-center justify-center w-8 h-8 rounded-full",
        "text-muted-foreground hover:text-foreground transition-all duration-200",
        "hover:bg-muted/60 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer",
        className
      )}
    >
      <Icon
        name={soundEnabled ? "lucide:volume-2" : "lucide:volume-x"}
        size={16}
        className={cn(
          "transition-transform duration-200 hover:scale-110",
          !soundEnabled && "opacity-60"
        )}
      />
    </button>
  );
}
