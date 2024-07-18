import { Post } from "contentlayer/generated";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import Image from "next/image";
import CalenderIcon from "./icons/CalenderIcon";
import { fadeInUp } from "../constants/animations";
import IconText from "./common/IconText";
import Pill from "./common/Pill";

const PostCard = (post: Post) => {
  return (
    <motion.a
      href={post.slug}
      className="w-full overflow-hidden rounded-xl shadow-sm drop-shadow-sm dark:bg-neutral-800 sm:bg-neutral-200 sm:shadow-sm sm:drop-shadow-xl"
      variants={fadeInUp}
      whileHover={{ scale: 1.05, transformOrigin: "center" }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative h-20 w-full rounded-2xl sm:h-60 sm:w-40 md:h-72 md:w-56">
        <Image
          src={post.thumbnail}
          alt={post.title}
          width={224}
          height={288}
          draggable={false}
          className="h-24 w-1/4 object-cover dark:brightness-75 dark:contrast-125 dark:grayscale sm:h-60 sm:w-40 md:h-72 md:w-56"
        />
        <div className="absolute inset-0 w-1/4 bg-gradient-to-r from-transparent to-white opacity-50 dark:to-black sm:hidden" />
        <div className="absolute inset-0 dark:bg-black dark:bg-opacity-20" />

        <div className="absolute bottom-0 right-0 flex h-full w-3/4 flex-col items-start justify-start gap-1 overflow-hidden bg-white bg-opacity-60 px-4 py-2 dark:bg-black dark:bg-opacity-30 sm:left-0 sm:h-[156px] sm:w-full sm:gap-2 sm:p-4">
          <IconText
            Icon={CalenderIcon}
            text={format(parseISO(post.date), "yyyy.MM.dd")}
          />

          <h2 className="flex-wrap overflow-x-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-black dark:text-white sm:overflow-x-auto sm:text-clip sm:whitespace-normal sm:break-words sm:text-base">
            [{post.category}] {post.title}
          </h2>
          <div className="flex gap-2 text-xs opacity-90 sm:hidden">
            {post.tags.map((tag) => (
              <Pill key={tag} className="bg-secondary font-light">
                {tag}
              </Pill>
            ))}
          </div>
        </div>

        <div className="absolute bottom-4 left-4 hidden w-full sm:block">
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
