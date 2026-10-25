"use client";

import React from "react";
import { TopBar } from "@/components/layout/top-bar";
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
  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden">
      <TopBar />  
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
      {/* <Banner active="kyoto"/> */}
       <Banner active="anime.gif" fit="cover" />

     
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
