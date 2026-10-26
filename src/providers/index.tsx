"use client";

import * as React from "react";
import { ThemeProvider } from "./theme-provider";
import { MotionProvider } from "./motion-provider";
import { SmoothScrollProvider } from "./smooth-scroll";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SoundProvider } from "./sound-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <MotionProvider>
        <SmoothScrollProvider>
          <SoundProvider>
            <TooltipProvider delay={150}>{children}</TooltipProvider>
          </SoundProvider>
        </SmoothScrollProvider>
      </MotionProvider>
    </ThemeProvider>
  );
}

