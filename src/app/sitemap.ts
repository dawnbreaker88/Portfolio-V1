import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { posts } from "@/data/posts";
import { projects } from "@/data/projects";
import { favorites } from "@/data/favorites";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${site.url}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${site.url}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  // Show Blog in sitemap only when there are 2+ posts
  if (posts.length >= 2) {
    routes.push({
      url: `${site.url}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // Show Favorites in sitemap only when there are items
  if (favorites.length > 0) {
    routes.push({
      url: `${site.url}/favorites`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // Include non-draft project pages
  projects
    .filter((p) => !p.draft)
    .forEach((p) => {
      routes.push({
        url: `${site.url}/projects/${p.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    });

  return routes;
}

