import Link from "next/link";
import Image from "next/image";
import PostCards from "../components/PostCards";
import Pill from "../components/common/Pill";

export default function HomePage() {
  return (
    <div className="flex h-full flex-col items-center">
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
              사용자 중심 개발자
              <span className="ml-2 text-sm font-extralight text-neutral-400">
                @xuuno
              </span>
            </h3>
            <h1 className="mb-2 text-3xl font-extrabold sm:mb-4 sm:text-6xl">
              CHEONG JUNHO
            </h1>
            <p className="hidden font-extralight text-gray-600 dark:text-gray-400 sm:block">
              사용자가 아주 상식적이고 쾌적한 경험을 갖는 그 작고 당연한 가치를
              최우선으로 여깁니다.
            </p>
            <p className="hidden font-extralight text-gray-600 dark:text-gray-400 sm:mb-2 sm:block lg:mb-6">
              비효율적인 개발 환경과 프로세스를 파악하고 개선하며, 개발의
              생산성에 대해 늘 고민합니다.
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
      <PostCards />
    </div>
  );
}
