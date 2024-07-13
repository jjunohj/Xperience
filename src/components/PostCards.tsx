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
      className="flex w-full flex-col items-center gap-3 sm:w-fit"
    >
      <motion.div
        variants={staggerHalf}
        className="flex w-full flex-col sm:grid sm:grid-cols-3 sm:gap-6 md:grid-cols-4"
      >
        {posts.map((post, idx) => (
          <PostCard key={idx} {...post} />
        ))}
      </motion.div>
    </motion.section>
  );
};

export default PostCards;
