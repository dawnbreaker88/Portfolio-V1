import React from "react";
import Link from "next/link";
import { Icon } from "@/components/shared/icon";
import { FavoritesShelf } from "@/sections/favorites/favorites-shelf";
import { copy } from "@/data/copy";
import { CATEGORY_CONFIG, favoriteProfiles } from "@/data/favorites";
import type { Favorite } from "@/types";

interface FavoritesViewProps {
  favorites: Favorite[];
}

export function FavoritesView({ favorites }: FavoritesViewProps) {
  // Group favorites by kind
  const itemsByKind = {
    movie: favorites.filter((f) => f.kind === "movie"),
    tv: favorites.filter((f) => f.kind === "tv"),
    anime: favorites.filter((f) => f.kind === "anime"),
    music: favorites.filter((f) => f.kind === "music"),
  };

  // Only show categories that have at least 1 item
  const activeCategories = CATEGORY_CONFIG.filter(
    (cat) => itemsByKind[cat.kind].length > 0
  );

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto px-6 pt-24 sm:pt-28 pb-20 z-10 text-left">
      {/* Back to home breadcrumb */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <Icon name="lucide:arrow-left" size={14} />
        <span>Back to home</span>
      </Link>

      {/* Page Header */}
      <header className="space-y-3 mb-10 sm:mb-12">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-3xl sm:text-4xl font-normal text-foreground tracking-tight">
            Favorites
          </h1>
          <div className="flex items-center gap-1 text-muted-foreground/70">
            <a
              href={favoriteProfiles.letterboxd}
              target="_blank"
              rel="noopener noreferrer"
              data-cuelume-tap
              aria-label="Letterboxd profile"
              title="Letterboxd profile"
              className="p-1.5 rounded-md hover:text-foreground hover:bg-muted/50 transition-colors inline-flex items-center justify-center"
            >
              <Icon name="simple-icons:letterboxd" size={18} />
            </a>
            <a
              href={favoriteProfiles.spotify}
              target="_blank"
              rel="noopener noreferrer"
              data-cuelume-tap
              aria-label="Spotify profile"
              title="Spotify profile"
              className="p-1.5 rounded-md hover:text-foreground hover:bg-muted/50 transition-colors inline-flex items-center justify-center"
            >
              <Icon name="simple-icons:spotify" size={18} />
            </a>
          </div>
        </div>
        <p className="font-mono text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {copy.favorites.intro}
        </p>
      </header>

      {/* Four Stacked Shelves */}
      <div className="space-y-14 sm:space-y-16">
        {activeCategories.map((cat) => (
          <FavoritesShelf
            key={cat.id}
            id={cat.id}
            kind={cat.kind}
            label={cat.label}
            items={itemsByKind[cat.kind]}
          />
        ))}
      </div>

      {/* Optional footer attribution */}
      {copy.favorites.attribution && (
        <div className="mt-20 pt-8 border-t border-border/60 text-center font-mono text-xs text-muted-foreground">
          {copy.favorites.attribution}
        </div>
      )}
    </div>
  );
}
