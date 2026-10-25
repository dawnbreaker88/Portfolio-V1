"use client";

import React from "react";
import { stickers } from "@/data/stickers";
import { StickerItem } from "@/components/shared/sticker";

export function StickerLayer() {
  if (!stickers || stickers.length === 0) return null;

  const leftStickers = stickers.filter((s) => s.side === "left");
  const rightStickers = stickers.filter((s) => s.side === "right");

  return (
    <aside
      aria-hidden="true"
      className="hidden xl:block absolute inset-0 pointer-events-none overflow-hidden z-20"
    >
      {/* Left Gutter Stickers */}
      {leftStickers.map((sticker, idx) => (
        <div
          key={`left-${idx}`}
          style={{
            top: sticker.top,
            left: "max(1.5rem, calc(50% - 460px))",
          }}
          className="absolute"
        >
          <StickerItem sticker={sticker} index={idx} />
        </div>
      ))}

      {/* Right Gutter Stickers */}
      {rightStickers.map((sticker, idx) => (
        <div
          key={`right-${idx}`}
          style={{
            top: sticker.top,
            right: "max(5.5rem, calc(50% - 460px))",
          }}
          className="absolute"
        >
          <StickerItem sticker={sticker} index={idx + leftStickers.length} />
        </div>
      ))}
    </aside>
  );
}
