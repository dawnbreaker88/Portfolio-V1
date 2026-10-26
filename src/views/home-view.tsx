"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useLenis } from "lenis/react";
import { IconPillNav } from "@/components/layout/icon-pill-nav";
import { StickerLayer } from "@/components/layout/sticker-layer";
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

const DARK_BANNER_ROTATION: Array<{
  id: string;
  name: string;
  active: string;
  fit?: "cover" | "ambient" | "contain";
}> = [
  { id: "ascii", name: "ASCII City", active: "ascii.png", fit: "cover" },
  { id: "kyoto", name: "Kyoto Dusk", active: "kyoto" },
  { id: "perp2", name: "Perpetual II", active: "perp2.avif", fit: "cover" },
  { id: "tokyo", name: "Tokyo Rain", active: "tokyo" },
  { id: "perp3", name: "Perpetual III", active: "perp3.avif", fit: "cover" },
   { id: "anime", name: "Perpetual III", active: "anime.gif", fit: "cover" },
    { id: "pixel", name: "Perpetual III", active: "pixel.gif", fit: "cover" },
  { id: "aurora", name: "Aurora Fjord", active: "aurora" },
];

export function HomeView() {
  const lenis = useLenis();
  const shouldReduceMotion = useReducedMotion();

  // Hourly rotating background in dark mode (clock-aligned)
  const [bannerIndex, setBannerIndex] = useState(() => {
    if (typeof window === "undefined") return 0;
    const epochHours = Math.floor(Date.now() / (1000 * 60 * 60));
    return epochHours % DARK_BANNER_ROTATION.length;
  });

  useEffect(() => {
    const getHourIndex = () => {
      const epochHours = Math.floor(Date.now() / (1000 * 60 * 60));
      return epochHours % DARK_BANNER_ROTATION.length;
    };

    setBannerIndex(getHourIndex());

    // Calculate exact milliseconds until the turn of the next clock hour
    const now = new Date();
    const msUntilNextHour =
      (60 - now.getMinutes() - 1) * 60 * 1000 +
      (60 - now.getSeconds()) * 1000 +
      (1000 - now.getMilliseconds());

    let intervalId: NodeJS.Timeout | null = null;

    const timeoutId = setTimeout(() => {
      setBannerIndex(getHourIndex());
      // Recurring every 1 hour (3,600,000 ms)
      intervalId = setInterval(() => {
        setBannerIndex(getHourIndex());
      }, 3600000);
    }, msUntilNextHour);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const currentBanner = DARK_BANNER_ROTATION[bannerIndex] ?? DARK_BANNER_ROTATION[0];

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

      {/* Universal Banner: visible in dark mode with hourly rotation, smoothly collapsed and removed in light mode */}
      <div className="overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out max-h-0 opacity-0 pointer-events-none dark:max-h-[600px] dark:opacity-100 dark:pointer-events-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBanner.id}
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
        className="flex-1 w-full max-w-2xl mx-auto px-6 z-10 pt-20 sm:pt-24 dark:pt-0 transition-[padding] duration-500 ease-in-out"
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
