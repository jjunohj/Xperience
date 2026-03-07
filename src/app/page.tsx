import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import Pill from "../components/common/Pill";
import NotionPostCardsServer from "../components/notion/NotionPostCardsServer";

// ISR - 1시간마다 재검증
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Xperiences",
  description: "프론트엔드 개발자의 실전 경험과 인사이트를 공유하는 기술 블로그",
  alternates: {
    canonical: "https://blog.xuuno.me",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HomePage() {
  return (
    <div className="flex h-full flex-col items-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Xperiences 홈",
            url: "https://blog.xuuno.me",
            description: "프론트엔드 개발자의 실전 경험과 인사이트를 공유하는 기술 블로그",
            inLanguage: "ko-KR",
            isPartOf: {
              "@type": "WebSite",
              name: "Xperiences",
              url: "https://blog.xuuno.me",
            },
            author: {
              "@type": "Person",
              name: "정준호",
              alternateName: "jjunohj",
              url: "https://github.com/jjunohj",
              jobTitle: "Frontend Developer",
              sameAs: ["https://github.com/jjunohj", "https://blog.xuuno.me/about"],
            },
            publisher: {
              "@type": "Organization",
              name: "Xperiences",
              url: "https://blog.xuuno.me",
              logo: {
                "@type": "ImageObject",
                url: "https://blog.xuuno.me/og-image.png",
                width: 1200,
                height: 630,
              },
            },
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: "https://blog.xuuno.me/blog?search={search_term_string}",
              },
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />

      <section className="mx-auto mt-20 w-full max-w-6xl px-4 sm:hidden">
        <h1 className="text-3xl font-extrabold">CHEONG JUNHO</h1>
        <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
          AI를 활용해 서비스의 전체 아키텍처를 최적화하고 비즈니스의 비용을 절감하며 새로운 기회를 창출합니다.
        </p>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          복잡한 문제를 단순하고 확장 가능한 시스템으로 전환하는 과정을 즐깁니다.
        </p>
      </section>

      <section className="relative mb-4 hidden h-72 w-full items-center justify-center gap-4 p-4 sm:mb-8 sm:flex sm:h-[32rem] sm:gap-6 lg:gap-10">
        <Image
          src="/images/profile.png"
          alt="Profile"
          width={200}
          height={200}
          priority
          className="absolute left-0 h-full w-40 -translate-x-8 object-cover blur-[128px] brightness-150 dark:brightness-90 sm:w-96"
        />
        <div className="z-10 mt-16 flex w-full max-w-6xl items-center justify-center gap-6 sm:mt-28 sm:gap-12 md:gap-16 lg:gap-20">
          <Image
            src="/images/profile.png"
            alt="Profile"
            width={200}
            height={200}
            priority
            className="h-40 w-32 object-cover shadow-lg dark:brightness-90 sm:h-96 sm:w-72"
          />
          <div className="flex w-1/2 flex-col justify-center sm:w-fit">
            <h3 className="text-sm font-normal sm:mb-1 sm:text-xl lg:mb-2">
              Product-Led FE Engineer
              <span className="ml-2 text-sm font-extralight text-neutral-400">@xuuno</span>
            </h3>
            <h1 className="mb-2 text-3xl font-extrabold sm:mb-4 sm:text-6xl">CHEONG JUNHO</h1>
            <p className="hidden font-extralight text-neutral-600 dark:text-neutral-400 sm:block">
              AI를 활용해 서비스의 전체 아키텍처를 최적화하고 비즈니스의 비용을 절감하며 새로운 기회를 창출합니다.
            </p>
            <p className="hidden font-extralight text-neutral-600 dark:text-neutral-400 sm:mb-2 sm:block lg:mb-6">
              복잡한 문제를 단순하고 확장 가능한 시스템으로 전환하고, 효율적인 프로세스로 제품의 시장 가치를
              극대화합니다.
            </p>
            <Link href="/about" className="flex w-40 justify-start">
              <Pill className="rounded-full px-3 py-2 text-xs font-light text-neutral-600 dark:text-neutral-400 sm:px-4 sm:py-2 sm:text-sm">
                More about me &rarr;
              </Pill>
            </Link>
          </div>
        </div>
      </section>
      <div className="h-10 w-full sm:hidden" />
      <NotionPostCardsServer />
    </div>
  );
}
