import Link from "next/link";
import Image from "next/image";
import PostCards from "../components/PostCards";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center py-8">
      <section className="mb-8 flex items-center justify-center gap-10">
        <Image
          src="/images/profile.png"
          alt="Profile"
          width={200}
          height={200}
          priority
          className="w-[200px] rounded-full"
        />
        <div className="flex w-full flex-col justify-center">
          <h1 className="mb-4 text-4xl font-extrabold dark:text-white">
            정준호
          </h1>
          <h3 className="mb-2 text-lg font-semibold text-black dark:text-white">
            유저의 눈을 가진 프론트엔드 개발자입니다.
          </h3>
          <p className="font-light text-gray-600 dark:text-gray-400">
            문제를 발견하고 해결하는 것에 재미를 느끼며, 불가능한 것은 없다고
            생각합니다.
          </p>
          <p className="mb-4 font-light text-gray-600 dark:text-gray-400">
            과정이 아무리 험난해도, 유저가 상식적이고 편리한 경험을 갖도록 하는
            것이 더욱 중요하다고 생각합니다.
          </p>
          <Link
            href="/about"
            className="font-light text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            More about me &rarr;
          </Link>
        </div>
      </section>

      <PostCards />
    </div>
  );
}
