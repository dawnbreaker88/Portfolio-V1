"use client";

import * as React from "react";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.5,
        autoRaf: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
