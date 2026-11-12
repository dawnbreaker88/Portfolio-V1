"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { useLenis } from "lenis/react";
import { site } from "@/data/site";
import { copy } from "@/data/copy";
import { isBlogVisible } from "@/data/posts";
import { isFavoritesVisible } from "@/data/favorites";
import { Icon } from "@/components/shared/icon";
import { ThemeToggle } from "./theme-toggle";
import { SoundToggle } from "./sound-toggle";
import { CommandPalette } from "./command-palette";
import { cn } from "@/lib/utils";

const UNDERLINE_PATHS = {
 home: "M 1 3.6 C 22 2.1, 53 4.8, 99 3.1",
  projects: "M 1 3.7 C 18 2.5, 35 4.9, 57 3.5 S 84 2.2, 99 3.2",
  more: "M 1 3.3 C 24 4.7, 51 2.1, 73 3.4 S 91 4.1, 99 3.5",
  contact: "M 1 3.5 C 20 2.1, 43 4.8, 65 3.4 S 87 2.3, 99 3.3", 
} as const;

function DrawnUnderline({
  isVisible,
  path,
}: {
  isVisible: boolean;
  path: string;
}) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.svg
          viewBox="0 0 100 6"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="absolute bottom-0 left-2.5 w-[calc(100%-20px)] h-[5px] pointer-events-none overflow-visible text-foreground dark:text-white dark:drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]"
        >
          <motion.path
            d={path}
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              pathLength: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
            }}
          />
        </motion.svg>
      )}
    </AnimatePresence>
  );
}

export function TopBar() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const moreTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [activeSection, setActiveSection] = useState<string>("home");
  const [profileBottom, setProfileBottom] = useState(520);
  const lastScrollY = useRef(0);
  const accumulatedDown = useRef(0);
  const accumulatedUp = useRef(0);
  const { scrollY } = useScroll();
  const lenis = useLenis();

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsVisible(true);
    setIsCompact(pathname !== "/" || (typeof window !== "undefined" && window.scrollY > 60));
    setMoreOpen(false);
    setMenuOpen(false);
  }

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
      setHoveredTab((prev) => (prev === "more" ? null : prev));
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

    // 3. Smooth downward scroll threshold (75px)
    if (diff > 0) {
      accumulatedUp.current = 0;
      accumulatedDown.current += diff;

      if (accumulatedDown.current > 75) {
        setIsVisible(false);
        if (menuOpen) setMenuOpen(false);
        if (moreOpen) setMoreOpen(false);
      }
    }
    // 4. Smooth upward scroll threshold (35px)
    else if (diff < 0) {
      accumulatedDown.current = 0;
      accumulatedUp.current += Math.abs(diff);

      if (accumulatedUp.current > 35) {
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

  const getActiveTab = () => {
    if (pathname === "/contact") return "contact";
    if (pathname.startsWith("/projects")) return "projects";
    if (pathname === "/blog" || pathname === "/favorites" || moreOpen) return "more";
    if (pathname === "/") return "home";
    return "";
  };
  const activeTab = getActiveTab();
  const currentTab = hoveredTab ?? activeTab;

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
        className="fixed top-0 inset-x-0 z-50 flex flex-col items-center pointer-events-none pt-2 sm:pt-3 px-3 sm:px-6 will-change-transform"
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
              className="font-display text-xl sm:text-2xl text-foreground dark:text-white font-normal tracking-tight hover:opacity-80 transition-opacity shrink-0"
            >
              {site.name}
            </Link>

            {/* Desktop Navigation Links: Home, Projects, More (Hover), Contact */}
            <nav
              onMouseLeave={() => setHoveredTab(null)}
              className="hidden sm:flex items-center gap-1 text-xs font-sans"
            >
              {/* Home */}
              <Link
                href="/"
                data-cuelume-tap
                data-cuelume-emphasis="subtle"
                onMouseEnter={() => setHoveredTab("home")}
                className={cn(
                  "relative px-3 py-1.5 transition-colors font-medium",
                  currentTab === "home"
                    ? "text-foreground dark:text-white font-semibold"
                    : "text-zinc-600 hover:text-foreground dark:text-white/80 dark:hover:text-white"
                )}
              >
                <span>Home</span>
                <DrawnUnderline isVisible={currentTab === "home"} path={UNDERLINE_PATHS.home} />
              </Link>

              {/* Projects */}
              <Link
                href="/projects"
                data-cuelume-tap
                data-cuelume-emphasis="subtle"
                onMouseEnter={() => setHoveredTab("projects")}
                className={cn(
                  "relative px-3 py-1.5 transition-colors font-medium",
                  currentTab === "projects"
                    ? "text-foreground dark:text-white font-semibold"
                    : "text-zinc-600 hover:text-foreground dark:text-white/80 dark:hover:text-white"
                )}
              >
                <span>Projects</span>
                <DrawnUnderline isVisible={currentTab === "projects"} path={UNDERLINE_PATHS.projects} />
              </Link>

              {/* More (Hover Dropdown) */}
              <div
                className="relative"
                onMouseEnter={() => {
                  handleMouseEnterMore();
                  setHoveredTab("more");
                }}
                onMouseLeave={handleMouseLeaveMore}
              >
                <button
                  type="button"
                  data-cuelume-tap
                  onClick={() => setMoreOpen(!moreOpen)}
                  aria-expanded={moreOpen}
                  aria-haspopup="true"
                  className={cn(
                    "relative inline-flex items-center gap-1 px-3 py-1.5 transition-colors font-medium cursor-pointer",
                    currentTab === "more"
                      ? "text-foreground dark:text-white font-semibold"
                      : "text-zinc-600 hover:text-foreground dark:text-white/80 dark:hover:text-white"
                  )}
                >
                  <span>More</span>
                  <Icon
                    name="lucide:chevron-down"
                    size={13}
                    className={cn(
                      "transition-transform duration-200",
                      currentTab === "more"
                        ? "text-foreground dark:text-white"
                        : "text-zinc-500 dark:text-white/70",
                      moreOpen && "rotate-180"
                    )}
                  />
                  <DrawnUnderline isVisible={currentTab === "more"} path={UNDERLINE_PATHS.more} />
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
                      {isBlogVisible && (
                        <Link
                          href="/blog"
                          data-cuelume-tap
                          data-cuelume-emphasis="subtle"
                          onClick={() => setMoreOpen(false)}
                          className={cn(
                            "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-sans transition-colors group",
                            pathname === "/blog"
                              ? "bg-muted/70 text-foreground dark:text-white font-semibold"
                              : "text-muted-foreground hover:text-foreground dark:text-white/75 dark:hover:text-white hover:bg-muted/50"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <Icon name="lucide:book-open" size={13} className="text-muted-foreground group-hover:text-foreground dark:group-hover:text-white" />
                            <span>Blog</span>
                          </div>
                        </Link>
                      )}

                      {isFavoritesVisible && (
                        <Link
                          href="/favorites"
                          data-cuelume-tap
                          data-cuelume-emphasis="subtle"
                          onClick={() => setMoreOpen(false)}
                          className={cn(
                            "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-sans transition-colors group",
                            pathname === "/favorites"
                              ? "bg-muted/70 text-foreground dark:text-white font-semibold"
                              : "text-muted-foreground hover:text-foreground dark:text-white/75 dark:hover:text-white hover:bg-muted/50"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <Icon name="lucide:bookmark" size={13} className="text-muted-foreground group-hover:text-foreground dark:group-hover:text-white" />
                            <span>Favorites</span>
                          </div>
                        </Link>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Direct Navigation: Contact */}
              <Link
                href="/contact"
                data-cuelume-tap
                data-cuelume-emphasis="subtle"
                onMouseEnter={() => setHoveredTab("contact")}
                className={cn(
                  "relative group px-3 py-1.5 transition-colors font-medium inline-flex items-center gap-1.5",
                  currentTab === "contact"
                    ? "text-foreground dark:text-white font-semibold"
                    : "text-zinc-600 hover:text-foreground dark:text-white/80 dark:hover:text-white"
                )}
              >
                <span>Contact</span>
                <span
                  className={cn(
                    "size-1.5 rounded-full transition-transform duration-200",
                    currentTab === "contact"
                      ? "bg-emerald-400 scale-110 shadow-xs"
                      : "bg-muted-foreground/40 dark:bg-white/40 group-hover:bg-foreground dark:group-hover:bg-white group-hover:scale-125"
                  )}
                />
                <DrawnUnderline isVisible={currentTab === "contact"} path={UNDERLINE_PATHS.contact} />
              </Link>
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

                {isBlogVisible && (
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
                  </Link>
                )}

                {isFavoritesVisible && (
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
                  </Link>
                )}

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
