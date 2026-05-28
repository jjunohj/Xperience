import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없어요",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
      <div className="relative inline-block">
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-logo bg-clip-text pr-3 font-mono text-8xl font-black italic leading-none text-transparent opacity-80 blur-2xl md:text-9xl"
        >
          404
        </span>
        <p className="text-primary relative inline-block pr-3 font-mono text-8xl font-black italic leading-none md:text-9xl">
          404
        </p>
      </div>
      <h1 className="text-primary mt-8 text-2xl font-semibold tracking-tight md:text-3xl">페이지를 찾을 수 없어요</h1>
      <p className="text-secondary mt-3 text-base leading-relaxed">
        주소가 잘못되었거나, 글이 옮겨졌거나, 더 이상 공개되지 않은 콘텐츠일 수 있어요.
      </p>
      <Link
        href="/"
        className="mt-10 rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
      >
        홈으로
      </Link>
    </section>
  );
}
