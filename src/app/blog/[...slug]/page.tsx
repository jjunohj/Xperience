import PostLayout from "@/src/components/layouts/PostLayout";
import { allPosts } from "contentlayer/generated";
import { Metadata, ResolvingMetadata } from "next";

type PostPageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata(props: PostPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params;
  const slug = `blog/${params.slug.join("/")}`;
  const post = allPosts.find((post) => post._raw.flattenedPath === slug);

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${post?.title} | Xperiences`,
    description: `${post?.description} ${post?.summary ? `- ${post?.summary}` : ""}`,
    openGraph: {
      title: post?.title,
      description: `${post?.description} ${post?.summary ? `- ${post?.summary}` : ""}`,
      images: [post?.thumbnail || "/og-image.png", ...previousImages],
      type: "article",
      authors: ["@xuuno"],
      publishedTime: post?.date,
      locale: "ko_KR",
      siteName: "Xperiences",
      modifiedTime: post?.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post?.title,
      description: `${post?.description} ${post?.summary ? `- ${post?.summary}` : ""}`,
      images: [post?.thumbnail || "/og-image.png"],
      creator: "@xuuno",
    },
    authors: [{ name: "xuuno", url: "https://blog.xuuno.me" }],
    creator: "xuuno",
    publisher: "Xperiences",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    other: {
      "application/ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post?.title,
        description: `${post?.description} ${post?.summary ? `- ${post?.summary}` : ""}`,
        image: post?.thumbnail || "/og-image.png",
        datePublished: post?.date,
        dateModified: post?.date,
        author: {
          "@type": "Person",
          name: "xuuno",
          url: "https://blog.xuuno.me",
        },
        publisher: {
          "@type": "Organization",
          name: "Xperiences",
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://blog.xuuno.me${post?.slug}`,
        },
        url: `https://blog.xuuno.me${post?.slug}`,
        keywords: post?.tags?.join(", "),
      }),
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const resolvedParams = await params;
  const slug = `blog/${resolvedParams.slug.join("/")}`;
  const post = allPosts.find((post) => post._raw.flattenedPath === slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  return <PostLayout post={post} />;
}
