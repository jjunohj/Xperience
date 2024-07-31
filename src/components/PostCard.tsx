import { Post } from "contentlayer/generated";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import Image from "next/image";
import CalenderIcon from "./icons/CalenderIcon";
import { fadeInSlideToRight } from "../constants/animations";
import IconText from "./common/IconText";
import Pill from "./common/Pill";

const PostCard = (post: Post) => {
  return (
    <motion.a
      href={post.slug}
      className="group h-56 w-full overflow-hidden p-4 sm:h-96"
      variants={fadeInSlideToRight}
      whileHover={{ scale: 0.98 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative h-full w-full">
        <Image
          src={post.thumbnail}
          alt={post.title}
          width={224}
          height={288}
          draggable={false}
          className="h-full w-full object-cover group-hover:drop-shadow-base-bold dark:brightness-90"
        />

        <div className="absolute bottom-0 left-0 right-0 flex h-[116px] w-full flex-col items-start justify-start gap-2 overflow-hidden bg-white bg-opacity-60 p-3 dark:bg-black dark:bg-opacity-30 sm:h-[128px] sm:p-4">
          <h2 className="flex-wrap overflow-x-hidden text-clip whitespace-normal break-words text-sm font-semibold group-hover:drop-shadow-base-bold sm:overflow-x-auto sm:text-xl">
            {post.title}
          </h2>
          <IconText
            className="gap-1 text-xs font-light group-hover:drop-shadow-base-bold sm:text-sm"
            Icon={CalenderIcon}
            text={format(parseISO(post.date), "yyyy년 MM월 dd일")}
          />
        </div>

        <div className="absolute bottom-3 left-3 block w-full sm:bottom-4 sm:left-4">
          <div className="flex flex-wrap gap-2 text-sm opacity-90">
            {post.tags.map((tag) => (
              <Pill
                key={tag}
                className="bg-neutral-50 px-1.5 py-0.5 text-xs font-light dark:bg-neutral-900"
              >
                {tag}
              </Pill>
            ))}
          </div>
        </div>
      </div>
    </motion.a>
  );
};

export default PostCard;
