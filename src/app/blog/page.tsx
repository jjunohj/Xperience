import { Metadata } from "next";
import { allBlogPosts, allCategories } from "@/src/constants/dataset";
import BlogClient from "./_components/BlogClient";

export const metadata: Metadata = {
  title: "Blog",
  description: "프론트엔드 개발 경험과 인사이트를 공유하는 기술 블로그의 글 목록입니다.",
  openGraph: {
    title: "Blog | Xperiences",
    description: "프론트엔드 개발 경험과 인사이트를 공유하는 기술 블로그의 글 목록입니다.",
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
    description: "프론트엔드 개발 경험과 인사이트를 공유하는 기술 블로그의 글 목록입니다.",
    images: ["/og-image.png"],
    creator: "@xuuno",
  },
  alternates: {
    canonical: "https://blog.xuuno.me/blog",
  },
  keywords: ["프론트엔드", "개발", "기술블로그", "React", "Next.js", "TypeScript", "JavaScript", "웹개발"],
};

export default function BlogPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 p-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Blog",
            description: "프론트엔드 개발 경험과 인사이트를 공유하는 기술 블로그의 글 목록입니다.",
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
              numberOfItems: allBlogPosts.length,
              itemListElement: allBlogPosts.slice(0, 10).map((post, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `https://blog.xuuno.me${post.slug}`,
                name: post.title,
              })),
            },
          }),
        }}
      />
      <h1 className="text-4xl font-extrabold lg:text-5xl">Blog</h1>
      <span className="text-sm font-light text-gray-600 dark:text-gray-400">
        다시 보고 싶은 기술들을 저만의 언어로 공유합니다.
      </span>
      <BlogClient allBlogPosts={allBlogPosts} allCategories={allCategories} />
    </div>
  );
}