import PostLayout from "@/src/components/layouts/PostLayout";
import { allPosts } from "contentlayer/generated";
import { Metadata, ResolvingMetadata } from "next";

type PostPageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateStaticParams() {
  return allPosts
    .filter((post) => post._raw.flattenedPath.startsWith("blog/"))
    .map((post) => ({
      slug: post._raw.flattenedPath.replace("blog/", "").split("/"),
    }));
}

export async function generateMetadata(
  props: PostPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
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
      images: [
        {
          url: post?.thumbnail || "/og-image.png",
          width: 1200,
          height: 630,
          alt: post?.title || "Xperiences",
        },
        ...previousImages,
      ],
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
    alternates: {
      canonical: `https://blog.xuuno.me${post?.slug}`,
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
