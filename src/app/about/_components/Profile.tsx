import LinkButton from "@/src/components/LinkButton";
import GithubIcon from "@/src/components/icons/GithubIcon";
import MailIcon from "@/src/components/icons/MailIcon";
import Image from "next/image";

export default function Profile() {
  return (
    <section className="flex h-fit w-full flex-col-reverse items-center justify-between p-4 sm:p-8 sm:pb-0 lg:flex-row">
      <div className="flex w-full flex-col items-start justify-start gap-6 motion-safe:animate-profileReveal motion-safe:[animation-delay:40ms] motion-reduce:animate-none lg:w-2/3">
        <div className="mt-4 space-y-1 sm:mt-8 lg:mt-0 lg:space-y-2">
          <h1 className="text-xl font-extralight dark:text-white sm:text-4xl lg:text-5xl">안녕하세요,</h1>
          <h1 className="text-primary text-xl font-normal dark:text-white sm:text-4xl lg:text-5xl">
            비즈니스 가치를 만드는 개발자,
          </h1>
          <h1 className="text-2xl font-extralight dark:text-white sm:text-4xl lg:text-5xl">
            <b className="font-semibold text-point">정준호</b>입니다.
          </h1>
        </div>
        <div className="h-0.5 w-full bg-point"></div>
        <div className="flex flex-col gap-2 text-sm sm:text-base lg:text-base">
          <span>
            AI를 활용해 서비스의 전체 아키텍처를 최적화하고 비즈니스의 비용을 어떻게 절감하고 새로운 기회를 창출할 수
            있는지 고민합니다.
          </span>
          <span>
            복잡한 문제를 단순한 시스템으로 전환하고, 효율적인 프로세스를 구축하여 제품의 시장 가치를 극대화하는 과정을
            즐깁니다.
          </span>
          <span>
            I leverage AI to optimize end-to-end service architecture, reduce costs, and unlock new business
            opportunities.
          </span>
          <span>
            I enjoy transforming complex problems into simple, scalable systems and building efficient processes that
            maximize product value in the market.
          </span>
          <div className="flex items-center gap-2">
            <LinkButton href="https://github.com/jjunohj" className="h-10 w-10 p-2">
              <GithubIcon className="w-full text-black dark:text-white" />
            </LinkButton>
            <LinkButton href="mailto:jjunohj@gmail.com" className="h-10 w-10 p-2">
              <MailIcon className="w-full text-red-500" />
            </LinkButton>
          </div>
        </div>
      </div>
      <div className="motion-safe:animate-profileReveal motion-safe:[animation-delay:140ms] motion-reduce:animate-none">
        <Image
          src="/images/profile.png"
          alt="Profile"
          width={360}
          height={360}
          priority
          className="h-[160px] w-[160px] rounded-full object-cover shadow-2xl shadow-transparent sm:h-[280px] sm:w-[280px] lg:h-[320px] lg:w-[320px] "
        />
      </div>
    </section>
  );
}
