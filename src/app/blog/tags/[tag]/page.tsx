import PostListItem from "@/src/components/PostListItem";
import { allBlogPosts } from "@/src/constants/dataset";

export default async function TagPage(props: { params: Promise<{ tag: string }> }) {
  const params = await props.params;
  const filteredPosts = allBlogPosts.filter((post) => {
    return post.tags.includes(params.tag);
  });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 p-4">
      <h1 className="text-2xl font-extrabold sm:text-3xl lg:text-4xl">
        Tags: {params.tag} ({filteredPosts.length})
      </h1>
      {filteredPosts.map((post) => (
        <PostListItem key={post.slug} post={post} />
      ))}
    </div>
  );
}
