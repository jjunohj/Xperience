import PostLayout from "@/src/components/layouts/PostLayout";
import { allPosts } from "contentlayer/generated";
import { Metadata, ResolvingMetadata } from "next";

type PostPageProps = {
  params: { slug: string[] };
};

export async function generateMetadata(
  { params }: PostPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const slug = `blog/${params.slug.join("/")}`;
  const post = allPosts.find((post) => post._raw.flattenedPath === slug);

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${post?.title} | Xperiences`,
    description: post?.description,
    openGraph: {
      title: post?.title,
      description: post?.description,
      images: [post?.thumbnail || "/og-image.png", ...previousImages],
      type: "article",
      authors: ["@xuuno"],
      publishedTime: post?.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post?.title,
      description: post?.description,
      images: [post?.thumbnail || "/og-image.png"],
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
