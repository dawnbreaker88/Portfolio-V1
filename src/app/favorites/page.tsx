import type { Metadata } from "next";
import { Footer } from "@/sections/home/footer";
import { FavoritesView } from "@/views/favorites-view";
import { favorites } from "@/data/favorites";
import { site } from "@/data/site";
import { copy } from "@/data/copy";
import { CATEGORY_CONFIG } from "@/data/favorites";

export async function generateMetadata(): Promise<Metadata> {
  const isEmpty = favorites.length === 0;

  const title = `Favorites | ${site.name}`;
  const description = `Curated films, television, anime, and albums favored by ${site.name}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${site.url}/favorites`,
    },
    robots: isEmpty
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
      url: `${site.url}/favorites`,
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

export default function FavoritesPage() {
  // Generate one ItemList JSON-LD per category
  const activeCategories = CATEGORY_CONFIG.filter((cat) =>
    favorites.some((f) => f.kind === cat.kind)
  );

  const categoryJsonLdList = activeCategories.map((cat) => {
    const items = favorites.filter((f) => f.kind === cat.kind);
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Favorite ${cat.label} by ${site.name}`,
      description: copy.favorites.intro,
      numberOfItems: items.length,
      itemListElement: items.map((item, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: item.title,
        description: item.note,
        author: {
          "@type": "Person",
          name: item.creator,
        },
        datePublished: item.year,
        ...(item.href ? { url: item.href } : {}),
      })),
    };
  });

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Category ItemList JSON-LDs */}
      {categoryJsonLdList.map((jsonLd, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ))}

      {/* Main Page View */}
      <FavoritesView favorites={favorites} />

      {/* Persistent Footer */}
      <Footer />
    </div>
  );
}
