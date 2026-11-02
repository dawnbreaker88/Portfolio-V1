import React from "react";
import { FavoriteTile } from "@/components/favorites/favorite-tile";
import { MusicTile } from "@/components/favorites/music-tile";
import type { Favorite, FavoriteKind } from "@/types";

interface FavoritesShelfProps {
  id: string;
  kind: FavoriteKind;
  label: string;
  items: Favorite[];
}

export function FavoritesShelf({
  id,
  kind,
  label,
  items,
}: FavoritesShelfProps) {
  if (items.length === 0) return null;

  return (
    <section id={id} className="scroll-mt-32 w-full pt-4">
      {/* Shelf Header */}
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <h2 className="font-mono text-[13px] uppercase tracking-[0.08em] text-muted-foreground font-medium">
          {label}
        </h2>
        <div className="h-px flex-1 bg-border/60" />
      </div>

      {/* Grid rendering by category (Movies & TV use tall 2:3 poster wrapping row) */}
      {(kind === "movie" || kind === "tv") && (
        <div className="flex flex-wrap gap-4 items-start">
          {items.map((item, idx) => (
            <FavoriteTile
              key={item.title + item.year}
              favorite={item}
              index={idx}
            />
          ))}
        </div>
      )}

      {kind === "anime" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {items.map((item, idx) => (
            <FavoriteTile
              key={item.title + item.year}
              favorite={item}
              index={idx}
            />
          ))}
        </div>
      )}

      {kind === "music" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-14">
          {items.map((item, idx) => (
            <MusicTile
              key={item.title + item.year}
              favorite={item}
              index={idx}
            />
          ))}
        </div>
      )}
    </section>
  );
}

