"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
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
    setIsCompact(pathname !== "/" || (typeof window !== "undefined" && window.scrollY > 80));
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
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;
    const diff = latest - previous;
    lastScrollY.current = latest;

    // 1. In the hero/banner zone on home page (scrollY <= 80px), stay in full-width mode
    if (latest <= 80 && pathname === "/") {
      setIsVisible(true);
      setIsCompact(false);
      accumulatedDown.current = 0;
      accumulatedUp.current = 0;
      return;
    }

    setIsCompact(true);

    // 2. On home page, keep top navigation ALWAYS VISIBLE until the profile photo and name have scrolled off-screen
    if (pathname === "/" && latest < profileBottom) {
      setIsVisible(true);
      accumulatedDown.current = 0;
      accumulatedUp.current = 0;
      return;
    }

    // 3. Do not hide if search command palette or navigation menu is active
    if (paletteOpen || menuOpen || moreOpen) {
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
        if (menuOpen) setMenuOpen(false);
        if (moreOpen) setMoreOpen(false);
      }
    }
    // 5. Reveal on slight upward scroll (12px)
    else if (diff < 0) {
      accumulatedDown.current = 0;
      accumulatedUp.current += Math.abs(diff);

      if (accumulatedUp.current > 12) {
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
              ? "w-full max-w-2xl mx-auto rounded-2xl px-4 sm:px-5 py-2.5 border border-border/80 bg-background/60 dark:bg-[#111113]/60 shadow-lg backdrop-blur-xl backdrop-saturate-150 supports-[not(backdrop-filter:blur(1px))]:bg-background/95"
              : "w-full px-6 sm:px-10 py-3.5 border-b border-transparent bg-transparent rounded-none"
          )}
        >
          {/* Brand + Desktop Navigation */}
          <motion.div layout="position" className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/"
              className="font-display text-xl sm:text-2xl text-foreground font-normal tracking-tight hover:opacity-80 transition-opacity shrink-0"
            >
              {site.name}
            </Link>

            {/* Desktop Navigation Links: Home, Projects, More (Hover) */}
            <nav className="hidden sm:flex items-center gap-1 text-xs font-sans">
              {/* Home */}
              <Link
                href="/"
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
            </nav>
          </motion.div>

          {/* Right Actions: Search + Theme + Mobile Menu Button */}
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
                <span className="hidden md:inline font-sans text-xs">
                  {copy.topBar.searchPlaceholder}
                </span>
              )}
              <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-background/80 border border-border/60 text-muted-foreground">
                {copy.topBar.searchKbd}
              </kbd>
            </button>

            {/* Theme Switcher */}
            <ThemeToggle />

            {/* Mobile Navigation Collapse Menu Toggle Button (shown below 640px) */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              className="sm:hidden flex items-center justify-center size-8 rounded-full border border-border/70 bg-muted/40 hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all duration-150 active:scale-95 cursor-pointer ml-1"
            >
              <Icon name={menuOpen ? "lucide:x" : "lucide:menu"} size={16} />
            </button>
          </motion.div>
        </motion.div>

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
