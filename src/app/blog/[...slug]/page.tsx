import PostLayout from "@/src/components/layouts/PostLayout";
import { allPosts } from "contentlayer/generated";

export default function PostPage({ params }: { params: { slug: string[] } }) {
  const slug = `blog/${params.slug.join("/")}`;
  const post = allPosts.find((post) => post._raw.flattenedPath === slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  return <PostLayout post={post} />;
}
