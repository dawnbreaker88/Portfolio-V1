"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { useLenis } from "lenis/react";
import { site } from "@/data/site";
import { copy } from "@/data/copy";
import { Icon } from "@/components/shared/icon";
import { ThemeToggle } from "./theme-toggle";
import { CommandPalette } from "./command-palette";
import { springSoft } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function TopBar() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");
  const [profileBottom, setProfileBottom] = useState(520);
  const lastScrollY = useRef(0);
  const accumulatedDown = useRef(0);
  const accumulatedUp = useRef(0);
  const { scrollY } = useScroll();
  const lenis = useLenis();

  // Measure the exact position where the name and avatar scroll off screen
  useEffect(() => {
    const updateProfileBottom = () => {
      const heading = document.getElementById("profile-heading");
      if (heading) {
        const rect = heading.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        // The bottom of the name heading + 24px padding so it has fully cleared the top
        setProfileBottom(rect.bottom + scrollTop + 24);
      }
    };

    updateProfileBottom();
    window.addEventListener("resize", updateProfileBottom, { passive: true });
    const timer = setTimeout(updateProfileBottom, 600);

    return () => {
      window.removeEventListener("resize", updateProfileBottom);
      clearTimeout(timer);
    };
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;
    const diff = latest - previous;
    lastScrollY.current = latest;

    // 1. In the hero/banner zone (scrollY <= 80px), always stay visible in full-width mode
    if (latest <= 80) {
      setIsVisible(true);
      setIsCompact(false);
      accumulatedDown.current = 0;
      accumulatedUp.current = 0;
      return;
    }

    setIsCompact(true);

    // 2. Keep top navigation ALWAYS VISIBLE until the profile photo and name have scrolled completely off-screen
    if (latest < profileBottom) {
      setIsVisible(true);
      accumulatedDown.current = 0;
      accumulatedUp.current = 0;
      return;
    }

    // 3. Do not hide if search command palette or mobile navigation menu is active
    if (paletteOpen || menuOpen) {
      setIsVisible(true);
      accumulatedDown.current = 0;
      accumulatedUp.current = 0;
      return;
    }

    // 4. Once past the name and avatar, hide only on intentional downward scroll (40px)
    if (diff > 0) {
      accumulatedUp.current = 0;
      accumulatedDown.current += diff;

      if (accumulatedDown.current > 40) {
        setIsVisible(false);
        if (menuOpen) {
          setMenuOpen(false);
        }
      }
    }
    // 5. Reveal on slight upward scroll (12px) or when nearing profile section
    else if (diff < 0) {
      accumulatedDown.current = 0;
      accumulatedUp.current += Math.abs(diff);

      if (accumulatedUp.current > 12) {
        setIsVisible(true);
      }
    }
  });

  // Active section tracking with IntersectionObserver for mobile collapse list
  useEffect(() => {
    const sectionIds = site.nav.map((item) => item.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "-20% 0px -40% 0px",
        threshold: 0.15,
      }
    );

    elements.forEach((el) => observer.observe(el));

    const handleScroll = () => {
      if (window.scrollY < 120) {
        setActiveSection("home");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    if (lenis) {
      lenis.scrollTo(`#${id}`, { offset: -70, duration: 1.2 });
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          y: isVisible ? 0 : -85,
        }}
        transition={{
          duration: 0.42,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={cn(
          "fixed top-0 inset-x-0 z-50 flex flex-col items-center pointer-events-none transition-[padding] duration-300",
          isCompact ? "pt-3 px-4" : "pt-0 px-0"
        )}
      >
        {/* Main Glass Bar */}
        <motion.div
          layout
          transition={springSoft}
          className={cn(
            "pointer-events-auto flex items-center justify-between transition-colors",
            isCompact
              ? "w-full max-w-2xl mx-auto rounded-2xl px-5 py-2.5 border border-border/80 bg-background/60 dark:bg-[#111113]/60 shadow-lg backdrop-blur-xl backdrop-saturate-150 supports-[not(backdrop-filter:blur(1px))]:bg-background/95"
              : "w-full px-6 sm:px-10 py-3.5 border-b border-white/10 bg-background/25 dark:bg-[#09090b]/25 backdrop-blur-xl backdrop-saturate-150 rounded-none supports-[not(backdrop-filter:blur(1px))]:bg-background/90"
          )}
        >
          {/* Static Brand on Left */}
          <motion.div layout="position" className="flex items-center">
            <Link
              href="/"
              className="font-display text-xl sm:text-2xl text-foreground font-normal tracking-tight hover:opacity-80 transition-opacity"
            >
              {site.name}
            </Link>
          </motion.div>

          {/* Right Actions */}
          <motion.div layout="position" className="flex items-center gap-2">
            {/* Search Pill Button */}
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              aria-label="Open command palette"
              className={cn(
                "flex items-center gap-2 rounded-full border border-border/70 bg-muted/40 hover:bg-muted/80 text-muted-foreground hover:text-foreground text-xs transition-all duration-150 active:scale-95 cursor-pointer",
                isCompact ? "px-2.5 py-1.5" : "px-3.5 py-1.5"
              )}
            >
              <Icon name="lucide:search" size={13} />
              {!isCompact && (
                <span className="hidden sm:inline font-sans text-xs">
                  {copy.topBar.searchPlaceholder}
                </span>
              )}
              <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-background/80 border border-border/60 text-muted-foreground">
                {copy.topBar.searchKbd}
              </kbd>
            </button>

            {/* Theme Switcher */}
            <ThemeToggle />

            {/* Mobile Navigation Collapse Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              className="lg:hidden flex items-center justify-center size-8 rounded-full border border-border/70 bg-muted/40 hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all duration-150 active:scale-95 cursor-pointer ml-1"
            >
              <Icon name={menuOpen ? "lucide:x" : "lucide:menu"} size={16} />
            </button>
          </motion.div>
        </motion.div>

        {/* Mobile Collapsible Navigation List */}
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              aria-label="Mobile navigation sections"
              className={cn(
                "pointer-events-auto w-[calc(100%-2rem)] max-w-sm mt-2 rounded-2xl",
                "border border-border/80 dark:border-white/10",
                "bg-background/85 dark:bg-[#111113]/85 backdrop-blur-xl backdrop-saturate-150",
                "shadow-2xl p-2 flex flex-col gap-1 lg:hidden"
              )}
            >
              {site.nav.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-sans font-medium transition-colors text-left cursor-pointer",
                      isActive
                        ? "bg-foreground text-background font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <Icon name={item.icon} size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Interactive Command Palette */}
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </>
  );
}
