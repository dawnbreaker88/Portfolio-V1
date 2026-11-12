import type { Metadata } from "next";
import { fontDisplay, fontSans, fontMono } from "@/lib/fonts";
import { Providers } from "@/providers";
import { TopBar } from "@/components/layout/top-bar";
import { site } from "@/data/site";
import { socials } from "@/data/socials";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : site.url;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Prabhath",
  description: site.description,
  keywords: [
    "Prabhath",
    "Portfolio",
    "Software Engineer",
    "Machine Learning",
    "Artificial Intelligence",
    "Full Stack Developer",
    "Next.js",
    "React",
    "Vanka Prabhath",
  ],
  authors: [{ name: site.name, url: siteUrl }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: site.name,
    title: `${site.name} — Portfolio`,
    description: site.description,
    images: [
      {
        url: "/nep.png",
        width: 1200,
        height: 630,
        alt: `${site.name} — Portfolio Preview`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Portfolio`,
    description: site.description,
    images: ["/nep.png"],
    creator: "@dawnbreaker88",
  },
  icons: {
    icon: [
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    sameAs: socials
      .filter((s) => !s.href.startsWith("mailto:") && !s.href.startsWith("/"))
      .map((s) => s.href),
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      className={`${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable} antialiased [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        className="min-h-screen flex flex-col bg-background text-foreground [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <Providers>
          <TopBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
