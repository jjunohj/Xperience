"use client";

import { compareDesc } from "date-fns";
import { allPosts } from "contentlayer/generated";
import PostCard from "../components/PostCard";
import { motion } from "framer-motion";
import { staggerHalf } from "../constants/animations";

const PostCards = () => {
  const posts = allPosts.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date))
  );

  return (
    <motion.section variants={staggerHalf} initial="initial" animate="animate">
      <h2 className="text-4xl font-extrabold mt-12 mb-6 dark:text-white">
        Recent Posts
      </h2>

      <motion.div variants={staggerHalf} className="grid gap-6 md:grid-cols-4">
        {posts.map((post, idx) => (
          <PostCard key={idx} {...post} />
        ))}
      </motion.div>
    </motion.section>
  );
};

export default PostCards;
