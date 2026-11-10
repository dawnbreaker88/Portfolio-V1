import type { Metadata } from "next";
import { fontDisplay, fontSans, fontMono } from "@/lib/fonts";
import { Providers } from "@/providers";
import { TopBar } from "@/components/layout/top-bar";
import { site } from "@/data/site";
import { socials } from "@/data/socials";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
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
