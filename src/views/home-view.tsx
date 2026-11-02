"use client";

import React, { useEffect, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useLenis } from "lenis/react";
import { IconPillNav } from "@/components/layout/icon-pill-nav";
import { Banner } from "@/components/banner";
import { ProfileSection } from "@/sections/home/profile";
import { AboutSection } from "@/sections/home/about";
import { ProjectsSection } from "@/sections/home/projects";
import { ExperienceSection } from "@/sections/home/experience";
import { TechStackSection } from "@/sections/home/tech-stack";
import { HighlightsSection } from "@/sections/home/highlights";
import { GithubActivitySection } from "@/sections/home/github-activity";
import { CtaSection } from "@/sections/home/cta";
import { Footer } from "@/sections/home/footer";

export type BannerItem = {
  id: string;
  name: string;
  active: string;
  fit?: "cover" | "ambient" | "contain";
};

const DEFAULT_DARK_BANNER_ROTATION: BannerItem[] = [
  { id: "dark-ascii", name: "ASCII City", active: "dark/ascii.png", fit: "cover" },
  { id: "dark-kyoto", name: "Kyoto Dusk", active: "kyoto" },
  { id: "dark-perp2", name: "Perpetual II", active: "dark/perp2.avif", fit: "cover" },
  { id: "dark-tokyo", name: "Tokyo Rain", active: "tokyo" },
  { id: "dark-perp3", name: "Perpetual III", active: "dark/perp3.avif", fit: "cover" },
  { id: "dark-aurora", name: "Aurora Fjord", active: "aurora" },
];

const DEFAULT_WHITE_BANNER_ROTATION: BannerItem[] = [
  { id: "white-kyoto", name: "Kyoto Dusk", active: "kyoto" },
  { id: "white-aurora", name: "Aurora Fjord", active: "aurora" },
  { id: "white-tokyo", name: "Tokyo Rain", active: "tokyo" },
];

function getHourSnapshot(): number {
  return Math.floor(Date.now() / (1000 * 60 * 60));
}

function getServerSnapshot(): number {
  return 0;
}

function subscribeToHour(callback: () => void): () => void {
  const now = new Date();
  const msUntilNextHour =
    (60 - now.getMinutes() - 1) * 60 * 1000 +
    (60 - now.getSeconds()) * 1000 +
    (1000 - now.getMilliseconds());

  let intervalId: NodeJS.Timeout | null = null;
  const timeoutId = setTimeout(() => {
    callback();
    // Recurring every 1 hour (3,600,000 ms)
    intervalId = setInterval(callback, 3600000);
  }, msUntilNextHour);

  return () => {
    clearTimeout(timeoutId);
    if (intervalId) clearInterval(intervalId);
  };
}

export function HomeView({
  initialWhiteBanners = [],
  initialDarkBanners = [],
}: {
  initialWhiteBanners?: string[];
  initialDarkBanners?: string[];
} = {}) {
  const lenis = useLenis();
  const shouldReduceMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const isDark = mounted ? resolvedTheme === "dark" : true;

  // Hourly rotating background in dark mode & white mode (clock-aligned, hydration-safe)
  const hourIndex = useSyncExternalStore(
    subscribeToHour,
    getHourSnapshot,
    getServerSnapshot
  );

  const darkRotation: BannerItem[] =
    initialDarkBanners.length > 0
      ? initialDarkBanners.map((p, idx) => ({
          id: `dark-${idx}`,
          name: `Dark Background ${idx + 1}`,
          active: p,
          fit: "cover" as const,
        }))
      : DEFAULT_DARK_BANNER_ROTATION;

  const whiteRotation: BannerItem[] =
    initialWhiteBanners.length > 0
      ? initialWhiteBanners.map((p, idx) => ({
          id: `white-${idx}`,
          name: `White Background ${idx + 1}`,
          active: p,
          fit: "cover" as const,
        }))
      : DEFAULT_WHITE_BANNER_ROTATION;

  const activeRotation = isDark ? darkRotation : whiteRotation;
  const currentBanner =
    activeRotation[hourIndex % activeRotation.length] ?? activeRotation[0];

  // Smooth scroll to anchor on initial mount/navigation if hash is present
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash;
      const timer = setTimeout(() => {
        if (lenis) {
          lenis.scrollTo(hash, { offset: -70, duration: 1.0 });
        } else {
          const el = document.querySelector(hash);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [lenis]);

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden">
      <IconPillNav />

      {/* Universal Banner: visible in both dark mode and white theme with hourly rotation */}
      <div className="w-full overflow-hidden max-h-[600px] opacity-100 pointer-events-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${isDark ? "dark" : "white"}-${currentBanner.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <Banner active={currentBanner.active} fit={currentBanner.fit} />
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.main
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
        className="flex-1 w-full max-w-2xl mx-auto px-6 z-10 pt-0 transition-[padding] duration-500 ease-in-out"
      >
        <ProfileSection />
        <AboutSection />
        <ProjectsSection />
        <ExperienceSection />
        <TechStackSection />
        <GithubActivitySection />
        <HighlightsSection />
        <CtaSection />
      </motion.main>

     
      <Footer />
    </div>
  );
}
