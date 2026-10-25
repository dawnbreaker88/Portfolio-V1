"use client";

import React, { useState, useEffect } from "react";
import { useLenis } from "lenis/react";
import { AppDock, DEFAULT_ITEMS } from "@/components/provided/app-dock";

export function IconPillNav() {
  const [activeSection, setActiveSection] = useState<string>("home");
  const lenis = useLenis();

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
    <div className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:block select-none">
      <AppDock
        orientation="vertical"
        items={DEFAULT_ITEMS}
        activeId={activeSection}
        onSelect={scrollTo}
      />
    </div>
  );
}
