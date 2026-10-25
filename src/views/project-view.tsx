import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { TechChip } from "@/components/shared/tech-chip";
import { Icon } from "@/components/shared/icon";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProjectView({ slug }: { slug: string }) {
  const projectIndex = projects.findIndex((p) => p.slug === slug);
  if (projectIndex === -1) {
    notFound();
  }

  const project = projects[projectIndex];
  const prevProject = projectIndex > 0 ? projects[projectIndex - 1] : null;
  const nextProject =
    projectIndex < projects.length - 1 ? projects[projectIndex + 1] : null;

  return (
    <main className="flex-1 max-w-2xl mx-auto px-6 py-20 w-full text-left">
      {/* Back link */}
      <Link
        href="/#projects"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <Icon name="lucide:arrow-left" size={14} />
        <span>Back to projects</span>
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <h1 className="font-display text-3xl sm:text-5xl font-normal text-foreground tracking-tight">
          {project.title}
        </h1>
        <Badge
          variant="outline"
          className={
            project.status === "live"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono"
              : "border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-mono"
          }
        >
          {project.status === "live" ? "Live" : "In Progress"}
        </Badge>
      </div>

      <p className="font-sans text-base text-muted-foreground leading-relaxed mb-6">
        {project.summary}
      </p>

      {/* Hero screenshot */}
      <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-border/70 bg-neutral-950 mb-10 shadow-lg">
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 672px"
          className="object-cover"
          priority
        />
      </div>

      {/* Context & Highlights */}
      <div className="space-y-8">
        <div>
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-2.5">
            Context & Background
          </h2>
          <p className="font-sans text-sm sm:text-base leading-relaxed text-foreground/90">
            {project.context}
          </p>
        </div>

        {project.highlights && project.highlights.length > 0 && (
          <div>
            <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-2.5">
              Key Highlights
            </h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground font-sans leading-relaxed">
              {project.highlights.map((highlight, idx) => (
                <li key={idx}>{highlight}</li>
              ))}
            </ul>
          </div>
        )}

        {project.details && (
          <div>
            <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-2.5">
              Technical Details
            </h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground font-sans leading-relaxed">
              {project.details.map((detail, idx) => (
                <li key={idx}>{detail}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Tech Stack */}
        <div>
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
            Technologies Used
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {project.stack.map((item) => (
              <TechChip key={item.name} name={item.name} icon={item.icon} />
            ))}
          </div>
        </div>

        {/* Action Links */}
        <div className="pt-4 flex flex-wrap items-center gap-3 border-t border-border/50">
          {project.liveUrl && (
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "default" }),
                "rounded-full font-mono text-xs px-5 inline-flex items-center gap-2"
              )}
            >
              <span>Live Demo</span>
              <Icon name="lucide:arrow-up-right" size={14} />
            </Link>
          )}

          {project.repoUrl && (
            <Link
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "border-border/80 hover:bg-muted/60 rounded-full font-mono text-xs px-5 inline-flex items-center gap-2"
              )}
            >
              <Icon name="lucide:github" size={14} />
              <span>GitHub</span>
            </Link>
          )}
        </div>

        {/* Next / Prev Project Navigation */}
        <div className="flex items-center justify-between pt-8 border-t border-border/50">
          {prevProject ? (
            <Link
              href={`/projects/${prevProject.slug}`}
              className="group flex flex-col text-left"
            >
              <span className="font-mono text-[11px] text-muted-foreground flex items-center gap-1 group-hover:text-foreground">
                <Icon name="lucide:arrow-left" size={12} /> Previous
              </span>
              <span className="font-display text-sm text-foreground mt-0.5">
                {prevProject.title}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {nextProject ? (
            <Link
              href={`/projects/${nextProject.slug}`}
              className="group flex flex-col text-right ml-auto"
            >
              <span className="font-mono text-[11px] text-muted-foreground flex items-center justify-end gap-1 group-hover:text-foreground">
                Next <Icon name="lucide:arrow-right" size={12} />
              </span>
              <span className="font-display text-sm text-foreground mt-0.5">
                {nextProject.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </main>
  );
}
