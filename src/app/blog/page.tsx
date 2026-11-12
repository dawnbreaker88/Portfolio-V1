import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Icon } from "@/components/shared/icon";
import { Footer } from "@/sections/home/footer";
import { BlogList } from "@/components/blog/blog-list";
import { posts } from "@/data/posts";
import { copy } from "@/data/copy";
import { site } from "@/data/site";

interface BlogPageProps {
  searchParams: Promise<{ tag?: string }>;
}

export async function generateMetadata({
  searchParams,
}: BlogPageProps): Promise<Metadata> {
  const { tag } = await searchParams;
  const isFiltered = Boolean(tag);
  const shouldNoIndex = isFiltered || posts.length < 2;

  const title = isFiltered
    ? `Blog (${tag}) | ${site.name}`
    : `Blog | ${site.name}`;

  const description =
    "Technical essays, systems explorations, and explainers on machine learning, AI, and software architecture.";

  return {
    description,
    alternates: {
      canonical: `${site.url}/blog`,
    },
    robots: shouldNoIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
    openGraph: {
      title,
      description,
      url: `${site.url}/blog`,
      siteName: site.name,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default function BlogPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Blog Posts by ${site.name}`,
    description: copy.blog.intro,
    numberOfItems: posts.length,
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: post.title,
      description: post.summary,
      url:
        "href" in post && post.href
          ? post.href
          : `${site.url}/blog/${post.slug}`,
    })),
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* ItemList JSON-LD for rich snippet indexing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <main className="flex-1 w-full max-w-2xl sm:max-w-3xl mx-auto px-6 pt-24 sm:pt-28 pb-16 z-10 text-left">
        {/* Breadcrumb back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <Icon name="lucide:arrow-left" size={14} />
          <span>Back to home</span>
        </Link>

        {/* Page Header */}
        <header className="space-y-3 mb-10 sm:mb-12">
          <h1 className="font-display text-3xl sm:text-4xl font-normal text-foreground tracking-tight">
            Blog
          </h1>
          <p className="font-mono text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {copy.blog.intro}
          </p>
        </header>

        {/* Typographic Posts Index */}
        <Suspense
          fallback={
            <div className="py-12 flex items-center justify-center font-mono text-xs text-muted-foreground">
              Loading posts...
            </div>
          }
        >
          <BlogList posts={posts} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
