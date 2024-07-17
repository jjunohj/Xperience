import PostListItem from "@/src/components/PostListItem";
import { allBlogPosts } from "@/src/constants/dataset";

export default function TagPage({ params }: { params: { tag: string } }) {
  const filteredPosts = allBlogPosts.filter((post) => {
    return post.tags.includes(params.tag);
  });

  return (
    <div className="flex w-full flex-col items-center p-4">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2">
        <h1 className="text-2xl font-extrabold sm:text-3xl lg:text-4xl">
          Tags: {params.tag} ({filteredPosts.length})
        </h1>
        {filteredPosts.map((post) => (
          <PostListItem key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
