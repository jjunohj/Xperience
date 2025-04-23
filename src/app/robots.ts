import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/static/"],
    },
    sitemap: "https://blog.xuuno.me/sitemap.xml",
    host: "https://blog.xuuno.me",
  };
}
