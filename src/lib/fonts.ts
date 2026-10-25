import localFont from "next/font/local";
import { Geist_Mono } from "next/font/google";

export const fontDisplay = localFont({
  src: "../assets/fonts/Melodrama-Variable.woff2",
  variable: "--font-display",
  display: "swap",
  fallback: ["ui-serif", "Georgia", "serif"],
});

export const fontSans = localFont({
  src: "../assets/fonts/Satoshi-Variable.woff2",
  variable: "--font-sans",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  fallback: ["ui-monospace", "Menlo", "monospace"],
});
