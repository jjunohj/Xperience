import Link from "next/link";
import Image from "next/image";
import PostCards from "../components/PostCards";
import Pill from "../components/common/Pill";

export default function HomePage() {
  return (
    <div className="flex h-full flex-col items-center">
      <section className="relative mb-4 flex h-[32rem] w-full items-center justify-center gap-4 sm:mb-8 sm:gap-6 lg:gap-10">
        <Image
          src="/images/profile.png"
          alt="Profile"
          width={200}
          height={200}
          priority
          className="absolute left-0 h-full w-96 -translate-x-8 object-cover blur-[128px] brightness-150 dark:brightness-90"
        />
        <div className="z-10 mt-28 flex w-full max-w-6xl items-center justify-center gap-24">
          <Image
            src="/images/profile.png"
            alt="Profile"
            width={200}
            height={200}
            priority
            className="h-96 w-72 object-cover shadow-lg dark:brightness-90"
          />
          <div className="flex w-fit flex-col justify-center">
            <h3 className="text-base font-normal text-black dark:text-white sm:mb-1 sm:text-xl lg:mb-2">
              사용자 중심 개발자, 정준호의
            </h3>
            <h1 className="text-lg font-semibold dark:text-white sm:mb-1 sm:text-3xl sm:font-extrabold lg:mb-4 lg:text-6xl">
              TECH BLOG
            </h1>
            <p className="hidden font-extralight text-gray-600 dark:text-gray-400 sm:block">
              문제를 발견하고 해결하는 것에 재미를 느끼며, 불가능한 것은 없다고
              생각합니다.
            </p>
            <p className="hidden font-extralight text-gray-600 dark:text-gray-400 sm:mb-2 sm:block lg:mb-6">
              과정이 아무리 험난해도, 유저가 상식적이고 편리한 경험을 갖도록
              하는 것이 더욱 중요하다고 생각합니다.
            </p>
            <Link href="/about" className="flex w-40 justify-start">
              <Pill className="rounded-full p-1 px-2 text-xs font-light text-neutral-600 dark:text-neutral-400 sm:px-4 sm:py-2 sm:text-sm">
                More about me &rarr;
              </Pill>
            </Link>
          </div>
        </div>
      </section>
      <PostCards />
    </div>
  );
}
