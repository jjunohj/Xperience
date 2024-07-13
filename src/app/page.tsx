import Link from "next/link";
import Image from "next/image";
import PostCards from "../components/PostCards";

export default function HomePage() {
  return (
    <div className="mx-auto flex h-full max-w-6xl flex-col p-4 sm:px-8 sm:py-4 lg:px-0 lg:py-8">
      <section className="mb-4 flex items-center justify-center gap-6 sm:mb-8 sm:gap-6 lg:gap-10">
        <Image
          src="/images/profile.png"
          alt="Profile"
          width={200}
          height={200}
          priority
          className="h-20 w-20 rounded-full object-cover shadow-2xl shadow-transparent sm:h-[160px] sm:w-[160px] lg:h-[200px] lg:w-[200px]"
        />
        <div className="flex w-fit flex-col justify-center">
          <h1 className="text-lg font-semibold dark:text-white sm:mb-1 sm:text-3xl sm:font-extrabold lg:mb-4 lg:text-4xl">
            정준호
          </h1>
          <h3 className="text-base font-light text-black dark:text-white sm:mb-1 sm:text-lg sm:font-semibold lg:mb-2">
            유저의 눈을 가진 프론트엔드 개발자입니다.
          </h3>
          <p className="hidden font-light text-gray-600 dark:text-gray-400 sm:block">
            문제를 발견하고 해결하는 것에 재미를 느끼며, 불가능한 것은 없다고
            생각합니다.
          </p>
          <p className="hidden font-light text-gray-600 dark:text-gray-400 sm:mb-2 sm:block lg:mb-4">
            과정이 아무리 험난해도, 유저가 상식적이고 편리한 경험을 갖도록 하는
            것이 더욱 중요하다고 생각합니다.
          </p>
          <Link
            href="/about"
            className="text-sm font-light text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 sm:text-base"
          >
            More about me &rarr;
          </Link>
        </div>
      </section>

      <PostCards />
    </div>
  );
}
