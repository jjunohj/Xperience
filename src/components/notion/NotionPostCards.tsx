"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NotionPostCard from "./NotionPostCard";
import { PostDetail } from "@/src/data/types/notion";
import { staggerHalf } from "@/src/data/constants/animations";

export default function NotionPostCards() {
  const [posts, setPosts] = useState<PostDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/notion/posts");
        const data = await response.json();
        const postsArray = Array.isArray(data) ? data : [];
        setPosts(postsArray.slice(0, 4));
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <motion.section
        variants={staggerHalf}
        initial="initial"
        animate="animate"
        className="mt-8 flex w-full flex-col items-center gap-3 sm:mt-16 sm:w-fit"
      >
        <h2 className="text-base font-semibold sm:mb-4 sm:text-2xl sm:tracking-tight">RECENT POSTS</h2>
        <div className="flex w-full flex-col gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="h-72 w-full animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800 sm:h-96"
            />
          ))}
        </div>
      </motion.section>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <motion.section
      variants={staggerHalf}
      initial="initial"
      animate="animate"
      className="mt-8 flex w-full flex-col items-center gap-3 sm:mt-16 sm:w-fit"
    >
      <h2 className="text-base font-semibold sm:mb-4 sm:text-2xl sm:tracking-tight">RECENT POSTS</h2>
      <motion.div variants={staggerHalf} className="flex w-full flex-col gap-4">
        {posts.map((post, idx) => (
          <NotionPostCard key={post.id} post={post} />
        ))}
      </motion.div>
    </motion.section>
  );
}
