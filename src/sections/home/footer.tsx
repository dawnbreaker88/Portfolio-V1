import React from "react";
import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="w-full text-center py-10 border-t border-border/40 text-muted-foreground/60 font-mono text-xs">
      <p>© 2026 {site.name}</p>
    </footer>
  );
}
