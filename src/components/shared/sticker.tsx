"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import type { Sticker } from "@/data/stickers";

export function StickerItem({
  sticker,
  index,
}: {
  sticker: Sticker;
  index: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  // Gentle parallax at differing speeds based on index
  const speed = (index % 2 === 0 ? 1 : -1) * (20 + (index % 3) * 15);
  const parallaxY = useTransform(scrollYProgress, [0, 1], [-speed, speed]);
  const y = shouldReduceMotion ? 0 : parallaxY;

  return (
    <motion.div
      ref={ref}
      drag
      dragSnapToOrigin
      dragElastic={0.2}
      whileHover={shouldReduceMotion ? undefined : { scale: 1.1, rotate: sticker.rotate + 5 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
      style={{
        width: sticker.size,
        height: sticker.size,
        rotate: sticker.rotate,
        y,
      }}
      aria-hidden="true"
      className="cursor-grab active:cursor-grabbing select-none pointer-events-auto touch-none"
    >
      <Image
        src={sticker.src}
        alt={sticker.alt}
        width={sticker.size}
        height={sticker.size}
        loading="lazy"
        draggable={false}
        className="w-full h-full object-contain pointer-events-none drop-shadow-lg"
      />
    </motion.div>
  );
}
