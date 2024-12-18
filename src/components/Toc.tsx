"use client";

import { useEffect, useState } from "react";
import { getIntersectionObserver } from "../libs/observer";
import { $ } from "../libs/core";

export default function Toc() {
  const [currentId, setCurrentId] = useState<string>("");
  const [headings, setHeadings] = useState<Element[]>([]);

  useEffect(() => {
    const observer = getIntersectionObserver(setCurrentId);
    const headings = Array.from(document.querySelectorAll("h2, h3, h4"));

    setHeadings(headings);

    headings.map((heading) => {
      observer.observe(heading);
    });
  }, []);

  return (
    <aside className="absolute right-8 top-[30rem] hidden h-full lg:block xl:right-20 xl:top-[36rem] 2xl:right-32">
      <ul className="sticky top-52 z-10 w-40 rounded-lg border border-neutral-100 bg-white p-4 shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-neutral-800 xl:w-48">
        {headings.map((heading) => (
          <li key={heading.id} className="mb-2">
            <a
              href={`#${heading.id}`}
              className={$(
                "block text-xs font-light text-neutral-400 transition-all hover:scale-105",
                currentId === heading.id ? "text-primary font-semibold" : "",
                heading.tagName === "H3"
                  ? "ml-2"
                  : heading.tagName === "H4"
                    ? "ml-4"
                    : "",
              )}
            >
              {heading.textContent}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
