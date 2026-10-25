import type { Metadata } from "next";
import { fontDisplay, fontSans, fontMono } from "@/lib/fonts";
import { Providers } from "@/providers";
import { TopBar } from "@/components/layout/top-bar";
import { site } from "@/data/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      className={`${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable} h-full antialiased [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
    >
      <body
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        className="min-h-full flex flex-col bg-background text-foreground [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <Providers>
          <TopBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
