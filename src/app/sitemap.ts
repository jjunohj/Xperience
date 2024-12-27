import type { MetadataRoute } from "next";
import { allBlogPosts } from "../constants/dataset";

export default function Sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://blog.xuuno.me";

  const urls: MetadataRoute.Sitemap = allBlogPosts.map((post) => ({
    url: `${baseUrl}${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "daily",
    priority: 1,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tags`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    ...urls,
  ];
}
