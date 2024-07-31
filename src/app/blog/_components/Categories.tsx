"use client";

import { fadeInSlideToLeft, staggerOne } from "@/src/constants/animations";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Categories({ categories }) {
  return (
    <motion.div
      className="flex w-full max-w-6xl items-center space-x-4 overflow-scroll no-scrollbar sm:-mx-4 sm:-my-6 sm:px-4 sm:py-6 lg:space-x-6"
      variants={staggerOne}
    >
      <AnimatePresence mode="wait">
        {categories.map((category) => (
          <motion.div key={category.slug} variants={fadeInSlideToLeft}>
            <Link
              href={category.slug}
              className="flex items-center gap-2 rounded-2xl py-2"
            >
              <div className="md:w-54 relative h-20 w-32 flex-shrink-0 select-none overflow-hidden rounded-xl shadow-sm transition-all hover:scale-[1.02] sm:h-28 sm:w-44 sm:shadow-lg md:h-32 md:w-52 lg:h-48 lg:w-72">
                <Image
                  src={category.thumbnail}
                  alt={category.title}
                  width={320}
                  height={224}
                  className="h-full w-full scale-150 object-cover dark:brightness-75 sm:scale-100"
                />
              </div>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
