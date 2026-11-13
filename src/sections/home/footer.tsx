"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { site } from "@/data/site";

const contactLinks = [
  {
    name: "Email",
    href: "mailto:vankaprabhath@gmail.com",
    external: false,
  },
  {
    name: "GitHub",
    href: "https://github.com/dawnbreaker88",
    external: true,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/vankaprabhath",
    external: true,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/pra.bha.th",
    external: true,
  },
];

export type FooterProps = {
  fullScreen?: boolean;
};

export function Footer({ fullScreen = false }: FooterProps) {
  const shouldReduceMotion = useReducedMotion();

  // Minimal footer for subpages (/projects, /blog, /favorites)
  if (!fullScreen) {
    return (
      <footer className="w-full text-center py-10 border-t border-border/40 text-muted-foreground/60 font-mono text-xs">
        <p>© 2026 {site.name}</p>
      </footer>
    );
  }

  // Full-screen footer for home page with Creation of Adam graphite sketch
  return (
    <footer
      id="footer"
      className="relative w-full h-screen min-h-[100dvh] overflow-hidden flex flex-col justify-between bg-background border-t border-border/30 select-none"
    >
      {/* Full-viewport Creation of Adam image with GPU-accelerated light transition */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden flex items-center justify-center will-change-[transform,opacity]"
      >
        {/* Light Mode: Native transparent graphite webp texture (zero blend-mode overhead) */}
        <Image
          src="/footer/graphite-hands-light.webp"
          alt="Creation of Adam graphite hands sketch"
          fill
          priority={false}
          sizes="100vw"
          className="object-cover md:object-contain lg:object-cover w-full h-full object-center opacity-90 dark:hidden pointer-events-none"
        />

        {/* Dark Mode: Native transparent luminous chalk webp texture (zero blend-mode overhead) */}
        <Image
          src="/footer/graphite-hands-dark.webp"
          alt="Creation of Adam graphite hands sketch"
          fill
          priority={false}
          sizes="100vw"
          className="object-cover md:object-contain lg:object-cover w-full h-full object-center opacity-85 hidden dark:block pointer-events-none"
        />

        {/* Subtle gradient vignette at bottom to guarantee pristine text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent pointer-events-none" />
      </motion.div>

      {/* Top spacer to preserve breathing room for the hands */}
      <div className="w-full flex-1 pointer-events-none" />

      {/* Text on it in the same position: bottom-left Prabhath/tagline, bottom-right contact links */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.06 }}
        className="w-full max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 pb-8 sm:pb-12 pt-6 shrink-0 relative z-10 pointer-events-auto will-change-[transform,opacity]"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8 pb-5 sm:pb-6 border-b border-border/40">
          {/* Bottom Left: Name & Tagline */}
          <div className="space-y-2">
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-foreground tracking-tight leading-none select-none">
              Prabhath.
            </h2>
            <p className="font-mono text-xs sm:text-sm text-muted-foreground max-w-md leading-relaxed">
              {site.tagline}
            </p>
          </div>

          {/* Bottom Right: Contact Links */}
          <div className="flex flex-wrap sm:grid sm:grid-cols-2 gap-x-8 gap-y-3.5 shrink-0">
            {contactLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                data-cuelume-tap
                className="group inline-flex items-center gap-1.5 font-mono text-xs sm:text-sm text-foreground/80 hover:text-foreground transition-colors cursor-pointer select-none"
              >
                <span>{link.name}</span>
                <span
                  aria-hidden="true"
                  className="inline-block text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                >
                  ↗
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Minimal Copyright */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-muted-foreground/60 font-mono text-xs">
          <p>© 2026 {site.name}</p>
          <p className="text-[11px] text-muted-foreground/40 hidden sm:block">
            Collecting ideas, occasionally executing them.
          </p>
        </div>
      </motion.div>
    </footer>
  );
}
