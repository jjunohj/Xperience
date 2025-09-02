import { Post } from "contentlayer/generated";
import Link from "next/link";
import { cn } from "../libs/core";
import ArrowIcon from "./icons/ArrowIcon";

interface AdjacentPostProps extends React.ComponentProps<"button"> {
  post: Post;
  direction: "next" | "previous";
}

const AdjacentPost = ({ post, direction, className }: AdjacentPostProps) => {
  return (
    <Link href={post.slug} className="w-full min-w-0 sm:flex-1">
      <button
        className={cn(
          "flex w-full items-center justify-between p-2 py-4 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-neutral-800 sm:p-4 sm:py-6",
          direction === "next" ? "sm:flex-row-reverse" : "sm:flex-row",
          className,
        )}
      >
        <ArrowIcon
          direction={direction === "next" ? "right" : "left"}
          className="h-8 w-8 flex-shrink-0"
        />
        <div
          className={cn(
            "flex min-w-0 flex-1 flex-col gap-1 px-4",
            "text-left sm:text-left",
            direction === "next" ? "sm:text-right" : "sm:text-left",
          )}
        >
          <span className="whitespace-nowrap text-sm text-gray-500">
            {direction === "next" ? "다음 글" : "이전 글"}
          </span>
          <span className="truncate text-base">{post.title}</span>
        </div>
      </button>
    </Link>
  );
};

export default AdjacentPost;
