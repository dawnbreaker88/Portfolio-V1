import type { Metadata } from "next";
import Link from "next/link";
import { ProjectsSection } from "@/sections/home/projects";
import { Footer } from "@/sections/home/footer";
import { Icon } from "@/components/shared/icon";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Projects",
  description: `Selected software, machine learning, and systems engineering projects by ${site.name}.`,
};

export default function ProjectsPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <main className="flex-1 w-full max-w-2xl mx-auto px-6 pt-24 sm:pt-28 pb-16 z-10 text-left">
        {/* Breadcrumb back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <Icon name="lucide:arrow-left" size={14} />
          <span>Back to home</span>
        </Link>

        {/* Standalone Projects Section with clean 2-line intro and filter tabs */}
        <ProjectsSection isStandalonePage />
      </main>

      {/* Page Footer */}
      <Footer />
    </div>
  );
}
