import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/about",
    },
    sitemap: "https://blog.xuuno.me/sitemap.xml",
  };
}
