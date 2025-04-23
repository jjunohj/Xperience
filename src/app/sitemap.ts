import type { MetadataRoute } from "next";
import { allBlogPosts } from "../constants/dataset";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://blog.xuuno.me";
  const currentDate = new Date().toISOString();

  const urls: MetadataRoute.Sitemap = allBlogPosts.map((post) => ({
    url: `${baseUrl}${post.slug}`,
    lastModified: new Date(post.date).toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    ...urls,
  ];
}
