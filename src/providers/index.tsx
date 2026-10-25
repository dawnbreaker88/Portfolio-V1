"use client";

import * as React from "react";
import { ThemeProvider } from "./theme-provider";
import { MotionProvider } from "./motion-provider";
import { SmoothScrollProvider } from "./smooth-scroll";
import { TooltipProvider } from "@/components/ui/tooltip";

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
          <TooltipProvider delay={150}>{children}</TooltipProvider>
        </SmoothScrollProvider>
      </MotionProvider>
    </ThemeProvider>
  );
}
