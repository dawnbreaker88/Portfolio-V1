"use client";

import React, { useEffect } from "react";
import { useLenis } from "lenis/react";
import { IconPillNav } from "@/components/layout/icon-pill-nav";
import { StickerLayer } from "@/components/layout/sticker-layer";
import { Banner } from "@/components/banner";
import { ProfileSection } from "@/sections/home/profile";
import { AboutSection } from "@/sections/home/about";
import { ProjectsSection } from "@/sections/home/projects";
import { ExperienceSection } from "@/sections/home/experience";
import { TechStackSection } from "@/sections/home/tech-stack";
import { GithubActivitySection } from "@/sections/home/github-activity";
import { AchievementsSection } from "@/sections/home/achievements";
import { CtaSection } from "@/sections/home/cta";
import { Footer } from "@/sections/home/footer";

export function HomeView() {
  const lenis = useLenis();

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

    
      {/* <StickerLayer /> */}

      {/* 
        ========================================================================
        UNIVERSAL BANNER (ASCII, GIF, or PNG/WebP):
        Swap effortlessly by changing the `active` prop below:
          - ASCII procedural:  active="tokyo" | active="kyoto" | active="aurora" | active="black"
          - Animated GIF:      active="/banner.gif" (or remote GIF URL)
          - Static Image:      active="/banner.webp" | active="/banner.png"
          - From site.ts:      <Banner /> (uses site.banner in src/data/site.ts)
        ========================================================================
      */}
      {/* <Banner active="black"/> */}
       <Banner active="perp2.png" fit="cover" />

     
      <main className="flex-1 w-full max-w-2xl mx-auto px-6 z-10">
        <ProfileSection />
        <AboutSection />
        <ProjectsSection />
        <ExperienceSection />
        <TechStackSection />
        <GithubActivitySection />
        <AchievementsSection />
        <CtaSection />
      </main>

     
      <Footer />
    </div>
  );
}
