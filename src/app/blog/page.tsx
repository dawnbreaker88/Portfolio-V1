import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/shared/icon";
import { Footer } from "@/sections/home/footer";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Blog",
  description: `Writing and essays on software engineering, deep learning, and systems architecture by ${site.name}.`,
};

export default function BlogPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <main className="flex-1 w-full max-w-2xl mx-auto px-6 pt-24 sm:pt-28 pb-16 z-10 text-left">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <Icon name="lucide:arrow-left" size={14} />
          <span>Back to home</span>
        </Link>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl sm:text-4xl font-normal text-foreground tracking-tight">
              Blog
            </h1>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border border-border/80 bg-muted/50 text-muted-foreground">
              Coming Soon
            </span>
          </div>
          <p className="font-sans text-sm sm:text-base text-muted-foreground leading-relaxed">
            Essays, technical deep dives, and thoughts on AI, system architecture, and modern product engineering are currently in the works.
          </p>
        </div>

        {/* Subtle empty state aesthetic */}
        <div className="mt-12 p-8 rounded-2xl border border-dashed border-border/70 bg-card/30 text-center flex flex-col items-center justify-center">
          <div className="size-10 rounded-full border border-border/70 bg-muted/50 flex items-center justify-center text-muted-foreground mb-3">
            <Icon name="lucide:book-open" size={18} />
          </div>
          <p className="font-mono text-xs text-muted-foreground">
            No published posts yet. Check back soon!
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
