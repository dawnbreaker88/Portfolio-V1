"use client";

import * as React from "react";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileTouch, setIsMobileTouch] = React.useState(false);

  React.useEffect(() => {
    // Detect mobile touch devices (phones and tablets where primary pointer is coarse touch)
    const media = window.matchMedia("(hover: none) and (pointer: coarse)");
    setIsMobileTouch(media.matches);

    const onChange = (e: MediaQueryListEvent) => setIsMobileTouch(e.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  // On mobile touch screens: disable Lenis to use native 120Hz GPU compositor scrolling.
  // This eliminates touch lag, removes main-thread touchmove listeners, and delivers instant momentum.
  if (isMobileTouch) {
    return <>{children}</>;
  }

  // On desktop / pointer devices: run Lenis for smooth mouse wheel interpolation
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.12,
        duration: 1.0,
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1.0,
        syncTouch: false,
        autoRaf: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
