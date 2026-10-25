import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { ProjectView } from "@/views/project-view";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} — ${site.name}`,
    description: project.summary,
    openGraph: {
      title: `${project.title} — ${site.name}`,
      description: project.summary,
      images: [
        {
          url: project.image,
          alt: project.imageAlt,
        },
      ],
    },
  };
}

async function ProjectContent({ params }: PageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return <ProjectView slug={slug} />;
}

function ProjectLoadingSkeleton() {
  return (
    <main className="flex-1 max-w-2xl mx-auto px-6 py-20 w-full text-left animate-pulse">
      <div className="h-4 w-28 bg-muted/70 rounded mb-8" />
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="h-10 w-2/3 bg-muted/70 rounded" />
        <div className="h-6 w-16 bg-muted/60 rounded-full" />
      </div>
      <div className="h-5 w-full bg-muted/50 rounded mb-2" />
      <div className="h-5 w-4/5 bg-muted/50 rounded mb-6" />
      <div className="w-full aspect-[16/10] bg-muted/60 rounded-2xl mb-10 border border-border/50" />
      <div className="space-y-4">
        <div className="h-4 w-32 bg-muted/60 rounded" />
        <div className="h-4 w-full bg-muted/40 rounded" />
        <div className="h-4 w-5/6 bg-muted/40 rounded" />
      </div>
    </main>
  );
}

export default function ProjectPage({ params }: PageProps) {
  return (
    <Suspense fallback={<ProjectLoadingSkeleton />}>
      <ProjectContent params={params} />
    </Suspense>
  );
}

