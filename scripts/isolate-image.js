/**
 * Versatile Image Alpha & Optimization Pipeline
 * 
 * Usage:
 *   node scripts/isolate-image.js <input-image-path> [options]
 * 
 * Examples:
 *   # Color illustration on white background (preserves original colors):
 *   node scripts/isolate-image.js public/art.png --bg=white
 * 
 *   # Neon graphic on black background:
 *   node scripts/isolate-image.js public/neon.png --bg=black
 * 
 *   # Dual theme monochrome sketch (generates -light.webp and -dark.webp):
 *   node scripts/isolate-image.js public/sketch.png --mode=dual-theme
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function processImage(inputPath, options = {}) {
  const {
    bg = 'white',         // 'white' | 'black' | hex (e.g. '#f5f5f5')
    mode = 'color',       // 'color' (preserves colors) | 'dual-theme' (light/dark monochrome)
    threshold = 235,      // sensitivity cutoff for background
    quality = 90,
  } = options;

  if (!fs.existsSync(inputPath)) {
    console.error(`Error: File not found: ${inputPath}`);
    process.exit(1);
  }

  const parsed = path.parse(inputPath);
  console.log(`Processing: ${inputPath} (mode: ${mode}, bg: ${bg})...`);

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const totalPixels = width * height;

  if (mode === 'dual-theme') {
    // Generates light (#18181b) and dark (#f4f4f5) monochrome textures
    const lightBuf = Buffer.alloc(totalPixels * 4);
    const darkBuf = Buffer.alloc(totalPixels * 4);

    for (let i = 0; i < totalPixels; i++) {
      const idx = i * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;

      let darkness = Math.max(0, threshold - lum);
      let alpha = Math.min(255, Math.round(darkness * (255 / (threshold - 30))));

      // Light mode: dark graphite (#18181b)
      lightBuf[idx] = 24;
      lightBuf[idx + 1] = 24;
      lightBuf[idx + 2] = 27;
      lightBuf[idx + 3] = alpha;

      // Dark mode: chalk white (#f4f4f5)
      darkBuf[idx] = 244;
      darkBuf[idx + 1] = 244;
      darkBuf[idx + 2] = 245;
      darkBuf[idx + 3] = alpha;
    }

    const outLight = path.join(parsed.dir, `${parsed.name}-light.webp`);
    const outDark = path.join(parsed.dir, `${parsed.name}-dark.webp`);

    await sharp(lightBuf, { raw: { width, height, channels: 4 } })
      .webp({ quality })
      .toFile(outLight);

    await sharp(darkBuf, { raw: { width, height, channels: 4 } })
      .webp({ quality })
      .toFile(outDark);

    console.log(`✓ Created: ${outLight}`);
    console.log(`✓ Created: ${outDark}`);
    return;
  }

  // COLOR MODE: Preserves original colors with un-premultiplied de-matting
  const outBuf = Buffer.alloc(totalPixels * 4);
  const isWhiteBg = bg === 'white';

  for (let i = 0; i < totalPixels; i++) {
    const idx = i * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];

    let alpha = 255;
    let outR = r;
    let outG = g;
    let outB = b;

    if (isWhiteBg) {
      // Distance from white (255, 255, 255)
      // Minimum channel difference from pure white
      const minDiff = 255 - Math.max(r, g, b);
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;

      if (lum >= threshold && minDiff < 15) {
        // Pure background
        alpha = 0;
      } else if (lum > threshold - 40) {
        // Semi-transparent edge: calculate alpha smoothly
        const t = (threshold - lum) / 40;
        alpha = Math.min(255, Math.max(0, Math.round(t * 255)));
      }

      // Color de-matting (removes white halo on semi-transparent edges)
      if (alpha > 0 && alpha < 255) {
        const aNorm = alpha / 255;
        outR = Math.min(255, Math.max(0, Math.round((r - (1 - aNorm) * 255) / aNorm)));
        outG = Math.min(255, Math.max(0, Math.round((g - (1 - aNorm) * 255) / aNorm)));
        outB = Math.min(255, Math.max(0, Math.round((b - (1 - aNorm) * 255) / aNorm)));
      }
    } else if (bg === 'black') {
      // Distance from black (0, 0, 0)
      const maxVal = Math.max(r, g, b);
      if (maxVal <= 20) {
        alpha = 0;
      } else if (maxVal < 60) {
        alpha = Math.round(((maxVal - 20) / 40) * 255);
      }
      // De-matting for black background
      if (alpha > 0 && alpha < 255) {
        const aNorm = alpha / 255;
        outR = Math.min(255, Math.max(0, Math.round(r / aNorm)));
        outG = Math.min(255, Math.max(0, Math.round(g / aNorm)));
        outB = Math.min(255, Math.max(0, Math.round(b / aNorm)));
      }
    }

    outBuf[idx] = outR;
    outBuf[idx + 1] = outG;
    outBuf[idx + 2] = outB;
    outBuf[idx + 3] = alpha;
  }

  const outPath = path.join(parsed.dir, `${parsed.name}-transparent.webp`);
  await sharp(outBuf, { raw: { width, height, channels: 4 } })
    .webp({ quality })
    .toFile(outPath);

  const origSize = (fs.statSync(inputPath).size / 1024).toFixed(1);
  const newSize = (fs.statSync(outPath).size / 1024).toFixed(1);

  console.log(`✓ Created: ${outPath} (${newSize} KB, was ${origSize} KB)`);
}

// CLI args parsing
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node scripts/isolate-image.js <image-path> [--bg=white|black] [--mode=color|dual-theme]');
  process.exit(0);
}

const inputPath = args[0];
const options = {};
for (const arg of args.slice(1)) {
  if (arg.startsWith('--bg=')) options.bg = arg.split('=')[1];
  if (arg.startsWith('--mode=')) options.mode = arg.split('=')[1];
  if (arg.startsWith('--threshold=')) options.threshold = Number(arg.split('=')[1]);
}

processImage(inputPath, options).catch(console.error);
