import PostLayout from "@/src/components/layouts/PostLayout";
import { allPosts } from "contentlayer/generated";
import { Metadata } from "next";

interface PostPageProps {
  params: { slug: string[] };
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const slug = `blog/${params.slug.join("/")}`;
  const post = allPosts.find((post) => post._raw.flattenedPath === slug);

  return {
    title: `${post?.title} | Xperiences`,
    description: post?.description,
    openGraph: {
      title: post?.title,
      description: post?.description,
      images: [
        {
          url: post?.thumbnail || "/og-image.png",
          width: 1200,
          height: 630,
          alt: post?.title,
        },
      ],
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

export default function PostPage({ params }: { params: { slug: string[] } }) {
  const slug = `blog/${params.slug.join("/")}`;
  const post = allPosts.find((post) => post._raw.flattenedPath === slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  return <PostLayout post={post} />;
}
