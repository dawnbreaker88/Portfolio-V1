export { cn } from "cn";

/**
 * Ensures a URL has an http:// or https:// protocol prefix.
 * If a URL like "loopersstore.vercel.app" is passed, it returns "https://loopersstore.vercel.app".
 * Prevents Next.js / browsers from treating external domain strings as relative local paths.
 */
export function ensureHttps(url?: string | null): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}
