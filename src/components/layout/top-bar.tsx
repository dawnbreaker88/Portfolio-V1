"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { useLenis } from "lenis/react";
import { site } from "@/data/site";
import { copy } from "@/data/copy";
import { Icon } from "@/components/shared/icon";
import { ThemeToggle } from "./theme-toggle";
import { SoundToggle } from "./sound-toggle";
import { CommandPalette } from "./command-palette";
import { springSoft } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function TopBar() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [activeSection, setActiveSection] = useState<string>("home");
  const [profileBottom, setProfileBottom] = useState(520);
  const lastScrollY = useRef(0);
  const accumulatedDown = useRef(0);
  const accumulatedUp = useRef(0);
  const { scrollY } = useScroll();
  const lenis = useLenis();

  // Close dropdowns and update layout state on route changes
  useEffect(() => {
    setIsVisible(true);
    setIsCompact(pathname !== "/" || (typeof window !== "undefined" && window.scrollY > 60));
    setMoreOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  // Handle escape key for dropdown
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMoreOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleMouseEnterMore = () => {
    if (moreTimeoutRef.current) clearTimeout(moreTimeoutRef.current);
    setMoreOpen(true);
  };

  const handleMouseLeaveMore = () => {
    moreTimeoutRef.current = setTimeout(() => {
      setMoreOpen(false);
    }, 150);
  };

  // Measure the exact position where the name and avatar scroll off screen
  useEffect(() => {
    const updateProfileBottom = () => {
      const heading = document.getElementById("profile-heading");
      if (heading) {
        const rect = heading.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
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
  }, [resolvedTheme]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;
    const diff = latest - previous;
    lastScrollY.current = latest;

    // Smooth full-width <-> compact pill transition with hysteresis
    if (pathname === "/") {
      if (latest > 65) {
        setIsCompact(true);
      } else if (latest < 25) {
        setIsCompact(false);
      }
    } else {
      setIsCompact(true);
    }

    // 1. In the top / hero area, stay visible
    if (latest <= 80 || (pathname === "/" && latest < profileBottom)) {
      setIsVisible(true);
      accumulatedDown.current = 0;
      accumulatedUp.current = 0;
      return;
    }

    // 2. Do not hide if search command palette or navigation menu is active
    if (paletteOpen || menuOpen || moreOpen) {
      setIsVisible(true);
      accumulatedDown.current = 0;
      accumulatedUp.current = 0;
      return;
    }

    // 3. Smooth downward scroll threshold (50px)
    if (diff > 0) {
      accumulatedUp.current = 0;
      accumulatedDown.current += diff;

      if (accumulatedDown.current > 50) {
        setIsVisible(false);
        if (menuOpen) setMenuOpen(false);
        if (moreOpen) setMoreOpen(false);
      }
    }
    // 4. Smooth upward scroll threshold (20px)
    else if (diff < 0) {
      accumulatedDown.current = 0;
      accumulatedUp.current += Math.abs(diff);

      if (accumulatedUp.current > 20) {
        setIsVisible(true);
      }
    }
  });

  // Active section tracking with IntersectionObserver for home page
  useEffect(() => {
    if (pathname !== "/") return;

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
  }, [pathname]);

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
        initial={{ y: -24, opacity: 0 }}
        animate={{
          y: isVisible ? 0 : -90,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          duration: 0.28,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="fixed top-0 inset-x-0 z-50 flex flex-col items-center pointer-events-none pt-2 sm:pt-3 px-3 sm:px-6"
      >
        {/* Main Glass Bar: smoothly transitions between full-width and compact pill */}
        <div
          className={cn(
            "pointer-events-auto w-full flex items-center justify-between",
            "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            isCompact
              ? "max-w-2xl mx-auto rounded-2xl px-4 sm:px-5 py-2.5 border border-border/80 bg-background/80 dark:bg-[#111113]/85 shadow-lg backdrop-blur-xl backdrop-saturate-150 supports-[not(backdrop-filter:blur(1px))]:bg-background/95"
              : "max-w-7xl mx-auto rounded-2xl px-5 sm:px-8 py-3.5 border border-transparent bg-transparent shadow-none"
          )}
        >
          {/* Brand + Desktop Navigation */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/"
              data-cuelume-tap
              data-cuelume-emphasis="subtle"
              className="font-display text-xl sm:text-2xl text-foreground font-normal tracking-tight hover:opacity-80 transition-opacity shrink-0"
            >
              {site.name}
            </Link>

            {/* Desktop Navigation Links: Home, Projects, More (Hover), Contact */}
            <nav className="hidden sm:flex items-center gap-1 text-xs font-sans">
              {/* Home */}
              <Link
                href="/"
                data-cuelume-tap
                data-cuelume-emphasis="subtle"
                className={cn(
                  "px-3 py-1.5 rounded-full transition-colors font-medium",
                  pathname === "/"
                    ? "text-foreground bg-muted/70 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
              >
                Home
              </Link>

              {/* Projects */}
              <Link
                href="/projects"
                data-cuelume-tap
                data-cuelume-emphasis="subtle"
                className={cn(
                  "px-3 py-1.5 rounded-full transition-colors font-medium",
                  pathname.startsWith("/projects")
                    ? "text-foreground bg-muted/70 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
              >
                Projects
              </Link>

              {/* More (Hover Dropdown) */}
              <div
                className="relative"
                onMouseEnter={handleMouseEnterMore}
                onMouseLeave={handleMouseLeaveMore}
              >
                <button
                  type="button"
                  data-cuelume-tap
                  onClick={() => setMoreOpen(!moreOpen)}
                  aria-expanded={moreOpen}
                  aria-haspopup="true"
                  className={cn(
                    "inline-flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors font-medium cursor-pointer",
                    moreOpen || pathname === "/blog" || pathname === "/favorites"
                      ? "text-foreground bg-muted/70 font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  )}
                >
                  <span>More</span>
                  <Icon
                    name="lucide:chevron-down"
                    size={13}
                    className={cn(
                      "transition-transform duration-200 text-muted-foreground/80",
                      moreOpen && "rotate-180 text-foreground"
                    )}
                  />
                </button>

                {/* Hover Dropdown Menu */}
                <AnimatePresence>
                  {moreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.96 }}
                      transition={{ duration: 0.16, ease: "easeOut" }}
                      className="absolute top-full left-0 mt-1 w-44 rounded-xl border border-border/80 bg-background/95 dark:bg-[#111113]/95 backdrop-blur-xl shadow-xl p-1.5 flex flex-col gap-0.5 z-50"
                    >
                      <Link
                        href="/blog"
                        data-cuelume-tap
                        data-cuelume-emphasis="subtle"
                        onClick={() => setMoreOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-sans transition-colors group",
                          pathname === "/blog"
                            ? "bg-muted/70 text-foreground font-semibold"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Icon name="lucide:book-open" size={13} className="text-muted-foreground group-hover:text-foreground" />
                          <span>Blog</span>
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border border-border/70 bg-muted/60 text-muted-foreground">
                          Soon
                        </span>
                      </Link>

                      <Link
                        href="/favorites"
                        data-cuelume-tap
                        data-cuelume-emphasis="subtle"
                        onClick={() => setMoreOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-sans transition-colors group",
                          pathname === "/favorites"
                            ? "bg-muted/70 text-foreground font-semibold"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Icon name="lucide:bookmark" size={13} className="text-muted-foreground group-hover:text-foreground" />
                          <span>Favorites</span>
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border border-border/70 bg-muted/60 text-muted-foreground">
                          Soon
                        </span>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Direct Navigation: Contact */}
              <motion.div
                whileHover={{ y: -1, scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Link
                  href="/contact"
                  data-cuelume-tap
                  data-cuelume-emphasis="subtle"
                  className={cn(
                    "group px-3 py-1.5 rounded-full transition-all font-medium inline-flex items-center gap-1.5",
                    pathname === "/contact"
                      ? "text-foreground bg-muted/70 font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  )}
                >
                  <span>Contact</span>
                  <span
                    className={cn(
                      "size-1.5 rounded-full transition-transform duration-200",
                      pathname === "/contact"
                        ? "bg-emerald-500 scale-110 shadow-xs"
                        : "bg-muted-foreground/35 group-hover:bg-foreground group-hover:scale-125"
                    )}
                  />
                </Link>
              </motion.div>
            </nav>
          </div>

          {/* Right Actions: Search + Sound + Theme + Mobile Menu Button */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Search Pill Button */}
            <button
              type="button"
              data-cuelume-tap
              onClick={() => setPaletteOpen(true)}
              aria-label="Open command palette"
              className={cn(
                "flex items-center gap-2 rounded-full border border-border/70 bg-muted/40 hover:bg-muted/80 text-muted-foreground hover:text-foreground text-xs transition-all duration-300 active:scale-95 cursor-pointer",
                isCompact ? "px-2.5 py-1.5" : "px-3.5 py-1.5"
              )}
            >
              <Icon name="lucide:search" size={13} />
              <span
                className={cn(
                  "font-sans text-xs transition-all duration-300 overflow-hidden whitespace-nowrap",
                  isCompact ? "max-w-0 opacity-0 hidden" : "max-w-[200px] opacity-100 hidden md:inline"
                )}
              >
                {copy.topBar.searchPlaceholder}
              </span>
              <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-background/80 border border-border/60 text-muted-foreground">
                {copy.topBar.searchKbd}
              </kbd>
            </button>

            {/* Sound Effects Toggle */}
            <SoundToggle />

            {/* Theme Switcher */}
            <ThemeToggle />

            {/* Mobile Navigation Collapse Menu Toggle Button (shown below 640px) */}
            <button
              type="button"
              data-cuelume-tap
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              className="sm:hidden flex items-center justify-center size-8 rounded-full border border-border/70 bg-muted/40 hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all duration-150 active:scale-95 cursor-pointer ml-1"
            >
              <Icon name={menuOpen ? "lucide:x" : "lucide:menu"} size={16} />
            </button>
          </div>
        </div>

        {/* Mobile Collapsible Navigation Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              aria-label="Mobile navigation"
              className={cn(
                "pointer-events-auto w-[calc(100%-2rem)] max-w-sm mt-2 rounded-2xl",
                "border border-border/80 dark:border-white/10",
                "bg-background/90 dark:bg-[#111113]/90 backdrop-blur-xl backdrop-saturate-150",
                "shadow-2xl p-2.5 flex flex-col gap-1 sm:hidden"
              )}
            >
              {/* Primary Pages */}
              <div className="flex flex-col gap-0.5 pb-2 border-b border-border/50">
                <Link
                  href="/"
                  data-cuelume-tap
                  data-cuelume-emphasis="subtle"
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-sans transition-colors",
                    pathname === "/"
                      ? "bg-foreground text-background font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <Icon name="lucide:home" size={15} />
                  <span>Home</span>
                </Link>

                <Link
                  href="/projects"
                  data-cuelume-tap
                  data-cuelume-emphasis="subtle"
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-sans transition-colors",
                    pathname.startsWith("/projects")
                      ? "bg-foreground text-background font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <Icon name="lucide:folder-git-2" size={15} />
                  <span>Projects</span>
                </Link>

                <Link
                  href="/blog"
                  data-cuelume-tap
                  data-cuelume-emphasis="subtle"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-sans text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon name="lucide:book-open" size={15} />
                    <span>Blog</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border border-border/70 bg-muted/60 text-muted-foreground">
                    Soon
                  </span>
                </Link>

                <Link
                  href="/favorites"
                  data-cuelume-tap
                  data-cuelume-emphasis="subtle"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-sans text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon name="lucide:bookmark" size={15} />
                    <span>Favorites</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border border-border/70 bg-muted/60 text-muted-foreground">
                    Soon
                  </span>
                </Link>

                <Link
                  href="/contact"
                  data-cuelume-tap
                  data-cuelume-emphasis="subtle"
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-sans transition-colors",
                    pathname === "/contact"
                      ? "bg-foreground text-background font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <Icon name="lucide:mail" size={15} />
                  <span>Contact</span>
                </Link>
              </div>

              {/* On-Page Section Anchors (if on Home page) */}
              {pathname === "/" && (
                <div className="flex flex-col gap-0.5 pt-1">
                  <span className="px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
                    On This Page
                  </span>
                  {site.nav.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        data-cuelume-select
                        data-cuelume-emphasis="subtle"
                        onClick={() => scrollToSection(item.id)}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-sans transition-colors text-left cursor-pointer",
                          isActive
                            ? "text-foreground font-semibold"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                        )}
                      >
                        <Icon name={item.icon} size={14} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Interactive Command Palette */}
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </>
  );
}
