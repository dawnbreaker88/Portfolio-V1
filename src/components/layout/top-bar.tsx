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
          className="absolute -bottom-1 inset-x-0 w-full h-[5px] pointer-events-none overflow-visible text-foreground dark:text-white dark:drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]"
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
  const moreContainerRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLElement>(null);
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

  // Handle escape key and click outside for dropdown & mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMoreOpen(false);
        setMenuOpen(false);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (moreContainerRef.current && !moreContainerRef.current.contains(target)) {
        setMoreOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        const toggleBtn = document.getElementById("mobile-menu-toggle");
        if (!toggleBtn || !toggleBtn.contains(target)) {
          setMenuOpen(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMouseEnterMore = () => {
    if (moreTimeoutRef.current) clearTimeout(moreTimeoutRef.current);
    setMoreOpen(true);
  };

  const handleMouseLeaveMore = () => {
    moreTimeoutRef.current = setTimeout(() => {
      setMoreOpen(false);
      setHoveredTab((prev) => (prev === "more" ? null : prev));
    }, 260);
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
              ? cn(
                  "max-w-2xl mx-auto rounded-2xl px-4 sm:px-5 py-2.5",
                  "bg-white/45 dark:bg-[#0c0c0e]/50",
                  "backdrop-blur-md backdrop-saturate-180",
                  "border border-white/50 dark:border-white/[0.12]",
                  "shadow-[0_8px_32px_0_rgba(0,0,0,0.06),inset_0_1px_1px_0_rgba(255,255,255,0.8),inset_0_-1px_1px_0_rgba(0,0,0,0.03)]",
                  "dark:shadow-[0_12px_40px_0_rgba(0,0,0,0.55),inset_0_1px_1px_0_rgba(255,255,255,0.18),inset_0_-1px_1px_0_rgba(0,0,0,0.3)]",
                  "supports-[not(backdrop-filter:blur(1px))]:bg-background/90"
                )
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
                <span className="relative">
                  Home
                  <DrawnUnderline isVisible={currentTab === "home"} path={UNDERLINE_PATHS.home} />
                </span>
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
                <span className="relative">
                  Projects
                  <DrawnUnderline isVisible={currentTab === "projects"} path={UNDERLINE_PATHS.projects} />
                </span>
              </Link>

              {/* More (Hover Dropdown) */}
              <div
                ref={moreContainerRef}
                className="relative"
                onMouseEnter={() => {
                  handleMouseEnterMore();
                  setHoveredTab("more");
                }}
                onMouseLeave={handleMouseLeaveMore}
              >
                <button
                  id="more-button"
                  type="button"
                  data-cuelume-tap
                  onClick={() => setMoreOpen(!moreOpen)}
                  aria-expanded={moreOpen}
                  aria-haspopup="menu"
                  className={cn(
                    "relative inline-flex items-center gap-1 px-3 py-1.5 transition-colors font-medium cursor-pointer outline-none",
                    currentTab === "more"
                      ? "text-foreground dark:text-white font-semibold"
                      : "text-zinc-600 hover:text-foreground dark:text-white/80 dark:hover:text-white"
                  )}
                >
                  <span className="relative">
                    More
                    <DrawnUnderline isVisible={currentTab === "more"} path={UNDERLINE_PATHS.more} />
                  </span>
                  <Icon
                    name="lucide:chevron-down"
                    size={12}
                    className={cn(
                      "transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      currentTab === "more"
                        ? "text-foreground dark:text-white"
                        : "text-zinc-500 dark:text-white/70",
                      moreOpen && "rotate-180"
                    )}
                  />
                </button>

                {/* Smooth Simple Dropdown Menu (No icons, Blog & Favorites only) */}
                <AnimatePresence>
                  {moreOpen && (
                    <motion.div
                      id="more-dropdown-menu"
                      role="menu"
                      initial={{ opacity: 0, y: 4, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 3, scale: 0.98 }}
                      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                      className={cn(
                        "absolute top-full left-0 mt-2 w-36 rounded-xl",
                        "bg-white/55 dark:bg-[#0f0f12]/65",
                        "backdrop-blur-xl backdrop-saturate-180",
                        "border border-white/50 dark:border-white/[0.12]",
                        "shadow-[0_16px_40px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.7)]",
                        "dark:shadow-[0_20px_45px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)]",
                        "p-1.5 flex flex-col gap-0.5 z-50",
                        "before:absolute before:-top-2.5 before:inset-x-0 before:h-2.5 before:content-['']"
                      )}
                    >
                      {isBlogVisible && (
                        <Link
                          href="/blog"
                          role="menuitem"
                          data-cuelume-tap
                          data-cuelume-emphasis="subtle"
                          onClick={() => setMoreOpen(false)}
                          className={cn(
                            "flex items-center px-3 py-2 rounded-lg text-xs font-sans transition-all duration-200",
                            pathname === "/blog"
                              ? "bg-black/10 dark:bg-white/15 text-foreground dark:text-white font-semibold"
                              : "text-muted-foreground hover:text-foreground dark:text-white/75 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                          )}
                        >
                          <span>Blog</span>
                        </Link>
                      )}

                      {isFavoritesVisible && (
                        <Link
                          href="/favorites"
                          role="menuitem"
                          data-cuelume-tap
                          data-cuelume-emphasis="subtle"
                          onClick={() => setMoreOpen(false)}
                          className={cn(
                            "flex items-center px-3 py-2 rounded-lg text-xs font-sans transition-all duration-200",
                            pathname === "/favorites"
                              ? "bg-black/10 dark:bg-white/15 text-foreground dark:text-white font-semibold"
                              : "text-muted-foreground hover:text-foreground dark:text-white/75 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                          )}
                        >
                          <span>Favorites</span>
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
                <span className="relative">
                  Contact
                  <DrawnUnderline isVisible={currentTab === "contact"} path={UNDERLINE_PATHS.contact} />
                </span>
                <span
                  className={cn(
                    "size-1.5 rounded-full transition-transform duration-200",
                    currentTab === "contact"
                      ? "bg-emerald-400 scale-110 shadow-xs"
                      : "bg-muted-foreground/40 dark:bg-white/40 group-hover:bg-foreground dark:group-hover:bg-white group-hover:scale-125"
                  )}
                />
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
                "flex items-center gap-2 rounded-full",
                "bg-white/35 dark:bg-white/[0.06] hover:bg-white/55 dark:hover:bg-white/[0.12]",
                "border border-white/50 dark:border-white/[0.1]",
                "shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.6)] dark:shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.08)]",
                "text-muted-foreground hover:text-foreground text-xs transition-all duration-300 active:scale-95 cursor-pointer",
                isCompact ? "px-2.5 py-1.5" : "px-3.5 py-1.5"
              )}
            >
              <Icon name="lucide:search" size={13} />
              <span
                className={cn(
                  "font-sans text-xs transition-all duration-300 whitespace-nowrap overflow-hidden inline-block",
                  isCompact ? "max-w-0 opacity-0 pointer-events-none" : "max-w-[140px] opacity-100 hidden md:inline-block"
                )}
              >
                {copy.topBar.searchPlaceholder}
              </span>
              <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/50 dark:bg-black/30 border border-white/60 dark:border-white/10 text-muted-foreground">
                {copy.topBar.searchKbd}
              </kbd>
            </button>

            {/* Sound Effects Toggle */}
            <SoundToggle />

            {/* Theme Switcher */}
            <ThemeToggle />

            {/* Mobile Navigation Collapse Menu Toggle Button (shown below 640px) */}
            <button
              id="mobile-menu-toggle"
              type="button"
              data-cuelume-tap
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              className={cn(
                "sm:hidden flex items-center justify-center size-8 rounded-full ml-1",
                "bg-white/35 dark:bg-white/[0.06] hover:bg-white/55 dark:hover:bg-white/[0.12]",
                "border border-white/50 dark:border-white/[0.1]",
                "shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.6)] dark:shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.08)]",
                "text-muted-foreground hover:text-foreground transition-all duration-150 active:scale-95 cursor-pointer"
              )}
            >
              <Icon name={menuOpen ? "lucide:x" : "lucide:menu"} size={16} />
            </button>
          </div>
        </div>

        {/* Mobile Collapsible Navigation Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              ref={mobileMenuRef}
              initial={{ opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              aria-label="Mobile navigation"
              className={cn(
                "pointer-events-auto w-[calc(100%-2rem)] max-w-sm mt-2 rounded-2xl",
                "bg-white/60 dark:bg-[#0f0f12]/70",
                "backdrop-blur-xl backdrop-saturate-180",
                "border border-white/50 dark:border-white/[0.12]",
                "shadow-[0_16px_40px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.6)]",
                "dark:shadow-[0_20px_45px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.12)]",
                "p-2.5 flex flex-col gap-1 sm:hidden",
                "max-h-[calc(100dvh-5rem)] overflow-y-auto scrollbar-none"
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
