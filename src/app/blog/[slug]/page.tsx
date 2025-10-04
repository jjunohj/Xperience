import { Metadata } from "next";
import { notFound } from "next/navigation";
import NotionPostLayout from "../_components/NotionPostLayout";
import { getAllPageMetadata, getPostDetail } from "@/src/libs/notion";

type NotionPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const posts = await getAllPageMetadata();
    const params = posts.map((post) => ({
      slug: post.slug,
    }));
    console.log(`✅ 총 ${params.length} 개 페이지에 대한 정적 파라미터 생성 완료`);
    return params;
  } catch (error) {
    console.error("정적 파라미터 생성 실패:", error);
    return [];
  }
}

export const revalidate = 3000;

export const dynamicParams = false; // 빌드 시 모든 페이지 미리 생성

export async function generateMetadata({ params }: NotionPostPageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const post = await getPostDetail(resolvedParams.slug);

    if (!post) {
      return {
        title: "Post Not Found",
      };
    }

    return {
      title: `${post.title} | Blog`,
      description: post.description,
      openGraph: {
        title: post.title,
        description: post.description,
        images: post.thumbnail
          ? [
              {
                url: post.thumbnail,
                width: 1200,
                height: 630,
                alt: post.title,
              },
            ]
          : [
              {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: post.title,
              },
            ],
        type: "article",
        authors: ["@xuuno"],
        publishedTime: post.date,
        locale: "ko_KR",
        siteName: "Xperiences",
        url: `https://blog.xuuno.me/blog/${post.slug}`,
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.description,
        images: [post.thumbnail || "/og-image.png"],
        creator: "@xuuno",
      },
      authors: [{ name: "xuuno", url: "https://blog.xuuno.me" }],
      creator: "xuuno",
      publisher: "Xperiences",
      alternates: {
        canonical: `https://blog.xuuno.me/blog/${post.slug}`,
      },
      keywords: [post.title, ...(post.tags || []), ...(post.category ? [post.category] : []), "기술블로그", "개발"],
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Post Not Found",
    };
  }
}

export default async function NotionPostPage({ params }: NotionPostPageProps) {
  try {
    const resolvedParams = await params;
    const post = await getPostDetail(resolvedParams.slug);

    if (!post) {
      notFound();
    }

    return <NotionPostLayout post={post} />;
  } catch (error) {
    console.error("Stack trace:", error instanceof Error ? error.stack : "No stack");
    notFound();
  }
}
