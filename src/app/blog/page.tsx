import { Metadata } from "next";
import NotionBlogClient from "./_components/NotionBlogClient";
import { getAllPageMetadata, getCategoriesWithUploadedPosts } from "@/src/libs/notion";

export const metadata: Metadata = {
  title: "Blog",
  description: "프론트엔드 개발자의 실전 경험과 인사이트를 공유하는 기술 블로그",
  openGraph: {
    title: "Blog | Xperiences",
    description: "프론트엔드 개발자의 실전 경험과 인사이트를 공유하는 기술 블로그",
    url: "https://blog.xuuno.me/blog",
    siteName: "Xperiences",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Xperiences Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Xperiences",
    description: "프론트엔드 개발자의 실전 경험과 인사이트를 공유하는 기술 블로그",
    images: ["/og-image.png"],
    creator: "@xuuno",
  },
  alternates: {
    canonical: "https://blog.xuuno.me/blog",
  },
  keywords: ["블로그", "노션블로그", "개발블로그", "기술블로그", "React", "Next.js", "TypeScript"],
};

export const revalidate = 3600;

export default async function NotionBlogPage() {
  const [pages, categories] = await Promise.all([getAllPageMetadata(), getCategoriesWithUploadedPosts()]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 p-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Blog",
            description: "프론트엔드 개발자의 실전 경험과 인사이트를 공유하는 기술 블로그",
            url: "https://blog.xuuno.me/blog",
            isPartOf: {
              "@type": "WebSite",
              name: "Xperiences",
              url: "https://blog.xuuno.me",
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://blog.xuuno.me",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Blog",
                  item: "https://blog.xuuno.me/blog",
                },
              ],
            },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: pages.length,
              itemListElement: pages.slice(0, 10).map((post, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `https://blog.xuuno.me/blog/${post.slug}`,
                name: post.title,
              })),
            },
          }),
        }}
      />

      <div className="mb-4">
        <h1 className="mb-3 text-4xl font-extrabold lg:text-5xl">Blog</h1>
        <span className="pl-1 text-sm font-light text-neutral-600 dark:text-neutral-400">
          다시 보고 싶은 기술들을 저만의 언어로 공유합니다.
        </span>
      </div>

      <NotionBlogClient pages={pages} categories={categories} />
    </div>
  );
}
