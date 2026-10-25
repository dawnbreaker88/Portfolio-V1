"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { site } from "@/data/site";
import { socials } from "@/data/socials";
import { SocialButton } from "@/components/shared/social-button";

export function ProfileSection() {
  const shouldReduceMotion = useReducedMotion();

  const taglines =
    site.taglines && site.taglines.length > 0
      ? site.taglines
      : [site.tagline];

  const avatarList =
    site.avatars && site.avatars.length > 0
      ? site.avatars
      : [site.avatar, "/tenma.jpeg", "/anime.jpeg", "/avatar.webp"].filter(Boolean);

  const [taglineIndex, setTaglineIndex] = useState(0);
  const [avatarIndex, setAvatarIndex] = useState(0);

  const handleAvatarClick = () => {
    setAvatarIndex((prev) => (prev + 1) % avatarList.length);
  };

  // Automatically cycle tagline every 5 seconds
  useEffect(() => {
    if (taglines.length <= 1) return;

    const timer = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [taglines.length]);

  return (
    <section
      id="home"
      aria-labelledby="profile-heading"
      className="relative flex flex-col items-center text-center -mt-16 sm:-mt-20 mb-16 sm:mb-20 z-10"
    >
      {/* Interactive Avatar with Simple Fade Easter Egg */}
      <button
        type="button"
        onClick={handleAvatarClick}
        aria-label="Switch profile avatar"
        className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-b from-border/80 via-border/40 to-background shadow-2xl cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-95 transition-transform duration-150 select-none"
      >
        <div className="relative w-full h-full rounded-full overflow-hidden bg-card border border-border/80 ring-4 ring-background">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={avatarList[avatarIndex]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="relative w-full h-full"
            >
              <Image
                src={avatarList[avatarIndex]}
                alt={site.name}
                fill
                unoptimized
                sizes="(max-width: 640px) 112px, 128px"
                className="object-cover select-none pointer-events-none"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </button>

      {/* Name + Rotating Tagline Container */}
      <div className="mt-6 flex flex-col items-center max-w-lg mx-auto">
        {/* Static Name */}
        <h1
          id="profile-heading"
          className="font-display text-4xl sm:text-6xl font-normal text-foreground tracking-tight text-center"
        >
          {site.name}
        </h1>

        {/* Rotating Tagline at 5s interval with zero layout shift */}
        <div className="relative font-mono text-xs sm:text-sm text-muted-foreground tracking-wide mt-2.5 max-w-md mx-auto text-center min-h-[1.75rem] flex items-center justify-center">
          {/* SEO fallback */}
          <span className="sr-only">{site.tagline}</span>

          {/* Animated tagline cross-fade */}
          <AnimatePresence mode="wait">
            <motion.p
              key={taglines[taglineIndex]}
              initial={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0, y: 6, filter: "blur(4px)" }
              }
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: -6, filter: "blur(4px)" }
              }
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block"
              aria-hidden="true"
            >
              {taglines[taglineIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Social Buttons */}
      <div className="flex items-center gap-3.5 mt-6">
        {socials.map((social) => (
          <SocialButton key={social.name} social={social} />
        ))}
      </div>
    </section>
  );
}
