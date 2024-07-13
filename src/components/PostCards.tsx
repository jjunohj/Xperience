"use client";

import { compareDesc } from "date-fns";
import { allPosts } from "contentlayer/generated";
import PostCard from "../components/PostCard";
import { motion } from "framer-motion";
import { staggerHalf } from "../constants/animations";

const PostCards = () => {
  const posts = allPosts.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date)),
  );

  return (
    <motion.section
      variants={staggerHalf}
      initial="initial"
      animate="animate"
      className="flex w-full flex-col items-center gap-3 p-8 sm:w-fit"
    >
      <h2 className="mt-6 w-full text-left text-2xl font-extrabold dark:text-white sm:mb-6 sm:mt-12 sm:text-4xl">
        Recent Posts
      </h2>

      <motion.div
        variants={staggerHalf}
        className="flex gap-6 sm:grid sm:grid-cols-3 md:grid-cols-4"
      >
        {posts.map((post, idx) => (
          <PostCard key={idx} {...post} />
        ))}
      </motion.div>
    </motion.section>
  );
};

export default PostCards;
