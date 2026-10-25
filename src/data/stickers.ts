export type Sticker = {
  src: string;
  alt: string;
  side: "left" | "right";
  top: string; // e.g. "18%", "45%"
  rotate: number; // in degrees
  size: number; // in pixels
};

export const stickers: Sticker[] = [

  {
    src: "/stickers/ai-robot-sticker.svg",
    alt: "AI Bot Sticker",
    side: "right",
    top: "28%",
    rotate: 10,
    size: 84,
  },
  {
    src: "/stickers/coffee-sticker.svg",
    alt: "Coffee Brew Sticker",
    side: "left",
    top: "52%",
    rotate: 6,
    size: 80,
  },
  {
    src: "/stickers/mountain-sticker.svg",
    alt: "Alpine Mountain Sticker",
    side: "right",
    top: "68%",
    rotate: -9,
    size: 92,
  },
  {
    src: "/stickers/spark-sticker.svg",
    alt: "Retro Sparkle Sticker",
    side: "left",
    top: "84%",
    rotate: -12,
    size: 76,
  },
];
