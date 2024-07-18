"use client";

import { fadeInSlideToLeft, staggerOne } from "@/src/constants/animations";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Categories({ categories }) {
  return (
    <motion.div
      className="-mx-8 -my-12 flex w-full items-center space-x-4 overflow-scroll px-8 py-12 no-scrollbar lg:space-x-6"
      variants={staggerOne}
    >
      <AnimatePresence mode="wait">
        {categories.map((category) => (
          <motion.div key={category.slug} variants={fadeInSlideToLeft}>
            <Link
              href={category.slug}
              className="flex items-center gap-2 rounded-2xl py-2"
            >
              <div className="md:w-54 relative h-8 w-8 flex-shrink-0 select-none overflow-hidden rounded-xl shadow-sm transition-all hover:scale-[1.02] sm:h-28 sm:w-44 sm:shadow-lg md:h-32 md:w-52 lg:h-48 lg:w-72">
                <Image
                  src={category.thumbnail}
                  alt={category.title}
                  width={320}
                  height={224}
                  className="h-full w-full object-cover dark:brightness-75"
                />
              </div>

              <span className="w-full text-start text-base font-light dark:text-white sm:hidden">
                {category.title}
              </span>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
