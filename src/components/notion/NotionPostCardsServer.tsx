import { getAllPageMetadata } from "~/libs/notion";
import NotionPostCard from "./NotionPostCard";

export default async function NotionPostCardsServer() {
  const posts = await getAllPageMetadata();
  const recentPosts = posts.slice(0, 4);

  if (recentPosts.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {recentPosts.map((post) => (
        <NotionPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
