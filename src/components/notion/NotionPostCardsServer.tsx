import { getAllPageMetadata } from "~/libs/notion";
import NotionPostCard from "./NotionPostCard";

export default async function NotionPostCardsServer() {
  const posts = await getAllPageMetadata();
  const recentPosts = posts.slice(0, 4);

  if (recentPosts.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 flex w-full flex-col items-center gap-3 sm:mt-16 sm:w-fit">
      <h2 className="text-base font-semibold sm:mb-4 sm:text-2xl sm:tracking-tight">RECENT POSTS</h2>
      <div className="flex w-full flex-col gap-4">
        {recentPosts.map((post) => (
          <NotionPostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
