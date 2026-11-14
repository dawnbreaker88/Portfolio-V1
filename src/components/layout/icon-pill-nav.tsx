"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLenis } from "lenis/react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import { AppDock, DEFAULT_ITEMS } from "@/components/provided/app-dock";

export function IconPillNav() {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const lastScrollY = useRef<number>(0);
  const shouldReduceMotion = useReducedMotion();
  const lenis = useLenis();
  const { scrollY } = useScroll();

  // Scroll direction and footer proximity detection:
  // - When scrolling down into the footer, hide the side dock navbar.
  // - When scrolling up, reveal the side dock navbar.
  useMotionValueEvent(scrollY, "change", (latest) => {
    const diff = latest - lastScrollY.current;
    lastScrollY.current = latest;

    const footer = document.getElementById("footer");
    if (!footer) return;

    const rect = footer.getBoundingClientRect();
    // Footer enters into the lower 80% of the viewport
    const isAtFooter = rect.top <= window.innerHeight * 0.8;

    if (isAtFooter) {
      if (diff > 2) {
        // Scrolling down into / within footer -> disappear
        setIsVisible(false);
      } else if (diff < -2) {
        // Scrolling up -> appear
        setIsVisible(true);
      }
    } else {
      // Above footer -> keep visible
      setIsVisible(true);
    }
  });

  // Initial check on mount in case the page is loaded/refreshed already at the footer
  useEffect(() => {
    const checkInitialPosition = () => {
      const footer = document.getElementById("footer");
      if (footer) {
        const rect = footer.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.8) {
          setIsVisible(false);
        }
      }
    };
    checkInitialPosition();
  }, []);

  // Active section tracking with IntersectionObserver
  useEffect(() => {
    const sectionIds = DEFAULT_ITEMS.map((item) => item.id);
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

    // Scroll listener for top of page -> home
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

  const scrollTo = (id: string) => {
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
    /* Desktop AppDock on Right Edge (Hidden on mobile/tablet, moved to TopBar collapse list) */
    <div className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:block select-none pointer-events-none">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 28 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto"
          >
            <AppDock
              orientation="vertical"
              items={DEFAULT_ITEMS}
              activeId={activeSection}
              onSelect={scrollTo}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
