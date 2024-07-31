import dayjs from "dayjs";
import Link from "next/link";

import { $ } from "~/libs/core";
import { ReducedPost } from "~/libs/types";

import CalenderIcon from "./icons/CalenderIcon";
import ClockIcon from "./icons/ClockIcon";
import IconText from "~/components/common/IconText";
import Tag from "~/components/common/Tag";
import Pill from "./common/Pill";

export default function PostListItem({ post }: { post: ReducedPost }) {
  const href = `/blog/[...slug]`;

  return (
    <div className={$("text-ye group w-full py-2 hover:drop-shadow-base")}>
      <Link as={post.slug} href={href} className="hover:drop-shadow-base">
        <p className="text-base font-bold sm:text-xl">{post.title}</p>
        <p className="text-tertiary mt-1 text-sm sm:text-base">
          {post.description}
        </p>
      </Link>
      <div className="mt-2 inline-flex w-full items-start gap-2 text-sm">
        <div className="hidden flex-wrap items-center gap-2 sm:flex">
          {post.tags.map((tag, i) => (
            <Tag key={i} tag={tag} />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:hidden">
          {post.tags.slice(0, 2).map((tag, i) => (
            <Tag key={i} tag={tag} />
          ))}
          {post.tags.length - 2 > 0 && (
            <Pill className="bg-neutral-50 text-xs font-light dark:bg-neutral-800">
              + {post.tags.length - 2}
            </Pill>
          )}
        </div>

        <div className="ml-auto flex gap-2 whitespace-nowrap group-hover:drop-shadow-base-bold">
          <IconText
            Icon={CalenderIcon}
            text={dayjs(post.date).format("YY.MM.DD")}
          />
          <IconText Icon={ClockIcon} text={`${post.readingMinutes}분`} />
        </div>
      </div>
    </div>
  );
}
