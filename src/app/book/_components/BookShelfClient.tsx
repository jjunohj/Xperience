"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp, staggerOne } from "@/src/data/constants/animations";
import { BookMetadata } from "@/src/data/types/notion";
import BookCard from "./BookCard";
import SearchInput from "@/src/app/blog/_components/SearchInput";

interface BookShelfClientProps {
  books: BookMetadata[];
}

export default function BookShelfClient({ books }: BookShelfClientProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      if (!searchTerm.trim()) return true;

      const keyword = searchTerm.toLowerCase();
      const searchableText = [book.title, book.author, book.description, book.category || ""].join(" ").toLowerCase();

      return searchableText.includes(keyword);
    });
  }, [books, searchTerm]);

  return (
    <div className="space-y-8">
      <section className="border-b border-neutral-200 pb-6 dark:border-neutral-700">
        <div className="mb-4">
          <div className="w-full">
            <SearchInput value={searchTerm} onChangeAction={setSearchTerm} placeholder="제목이나 내용으로 검색..." />
          </div>
        </div>
      </section>

      {filteredBooks.length > 0 ? (
        <motion.section
          className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerOne}
          initial="initial"
          animate="animate"
        >
          {filteredBooks.map((book) => (
            <motion.div key={book.id} variants={fadeInUp}>
              <BookCard book={book} />
            </motion.div>
          ))}
        </motion.section>
      ) : (
        <div className="border border-neutral-300 py-20 text-center dark:border-neutral-700">
          <p className="text-lg font-semibold text-neutral-700 dark:text-neutral-200">조건에 맞는 책이 없습니다.</p>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">검색어 또는 카테고리 필터를 바꿔보세요.</p>
        </div>
      )}
    </div>
  );
}
