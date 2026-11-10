const sharp = require("sharp");
const path = require("path");

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glowTop" cx="80%" cy="15%" r="60%">
      <stop offset="0%" stop-color="#4f46e5" stop-opacity="0.22" />
      <stop offset="100%" stop-color="#09090b" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="glowBottom" cx="15%" cy="85%" r="55%">
      <stop offset="0%" stop-color="#0284c7" stop-opacity="0.18" />
      <stop offset="100%" stop-color="#09090b" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#e4e4e7" />
    </linearGradient>
  </defs>

  <!-- Background base -->
  <rect width="1200" height="630" fill="#09090b" />
  
  <!-- Ambient glows -->
  <rect width="1200" height="630" fill="url(#glowTop)" />
  <rect width="1200" height="630" fill="url(#glowBottom)" />

  <!-- Inset Border Frame -->
  <rect x="36" y="36" width="1128" height="558" rx="20" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1.5" />

  <!-- Top Status Pill -->
  <g transform="translate(76, 76)">
    <rect width="320" height="38" rx="19" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1" />
    <circle cx="20" cy="19" r="4.5" fill="#22c55e" />
    <text x="36" y="24" fill="#a1a1aa" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="500" letter-spacing="1">AVAILABLE FOR COLLABORATIONS</text>
  </g>

  <!-- Top Right Domain Badge -->
  <g transform="translate(980, 76)">
    <rect width="144" height="38" rx="19" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.1)" stroke-width="1" />
    <text x="72" y="24" text-anchor="middle" fill="#d4d4d8" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" letter-spacing="0.5">prabhath.dev</text>
  </g>

  <!-- Main Headline & Subtitle -->
  <g transform="translate(76, 230)">
    <!-- Big Title -->
    <text x="0" y="70" fill="url(#textGrad)" font-family="system-ui, -apple-system, sans-serif" font-size="82" font-weight="700" letter-spacing="-2">Prabhath</text>
    
    <!-- Tagline -->
    <text x="0" y="145" fill="#f4f4f5" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="400" letter-spacing="-0.5">Building useful software and exploring AI.</text>
    
    <!-- Sub-bullets -->
    <text x="0" y="200" fill="#a1a1aa" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="400" letter-spacing="0.2">Machine Learning • Full-Stack Systems • Curious Engineering</text>
  </g>

  <!-- Bottom Divider & Socials -->
  <line x1="76" y1="510" x2="1124" y2="510" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />

  <g transform="translate(76, 545)">
    <text x="0" y="0" fill="#71717a" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="500">
      GitHub: <tspan fill="#a1a1aa">@dawnbreaker88</tspan>
      <tspan fill="#52525b">  •  </tspan>
      X: <tspan fill="#a1a1aa">@dawnbreaker88</tspan>
      <tspan fill="#52525b">  •  </tspan>
      LinkedIn: <tspan fill="#a1a1aa">in/vankaprabhath</tspan>
    </text>
  </g>

  <g transform="translate(1124, 545)">
    <text x="0" y="0" text-anchor="end" fill="#71717a" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="500">Portfolio &amp; Engineering Log</text>
  </g>
</svg>
`;

async function run() {
  const outputPath = path.join(__dirname, "../public/og.png");
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9, quality: 90 })
    .toFile(outputPath);
  console.log("Successfully generated public/og.png at:", outputPath);
}

run().catch(console.error);

