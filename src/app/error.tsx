"use client";

import Link from "next/link";
import { useEffect } from "react";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
      <div className="relative inline-block">
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-logo bg-clip-text pr-3 font-mono text-8xl font-black italic leading-none text-transparent opacity-80 blur-2xl md:text-9xl"
        >
          500
        </span>
        <p className="text-primary relative inline-block pr-3 font-mono text-8xl font-black italic leading-none md:text-9xl">
          500
        </p>
      </div>
      <h1 className="text-primary mt-8 text-2xl font-semibold tracking-tight md:text-3xl">
        일시적인 문제가 발생했어요
      </h1>
      <p className="text-secondary mt-3 text-base leading-relaxed">
        콘텐츠를 불러오는 중에 오류가 났어요. 잠시 후에 다시 시도해 주세요.
      </p>
      {error.digest && <p className="text-mute mt-2 font-mono text-xs">디버그 ID: {error.digest}</p>}
      <Link
        href="/"
        className="mt-10 rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
      >
        홈으로
      </Link>
    </section>
  );
}
