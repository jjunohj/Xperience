import LinkButton from "@/src/components/LinkButton";
import GithubIcon from "@/src/components/icons/GithubIcon";
import MailIcon from "@/src/components/icons/MailIcon";
import Image from "next/image";

const Profile = () => {
  return (
    <section className="flex h-fit w-full flex-col-reverse items-center justify-between p-4 sm:p-8 sm:pb-0 lg:flex-row">
      <div className="flex w-full flex-col items-start justify-start gap-6 lg:w-2/3">
        <div className="mt-4 space-y-1 sm:mt-8 lg:mt-0 lg:space-y-2">
          <h1 className="text-xl font-extralight dark:text-white sm:text-4xl lg:text-5xl">
            안녕하세요,
          </h1>
          <h1 className="text-primary text-xl font-normal dark:text-white sm:text-4xl lg:text-5xl">
            사용자 중심 프론트엔드 개발자,
          </h1>
          <h1 className="text-2xl font-extralight dark:text-white sm:text-4xl lg:text-5xl">
            <b className="font-semibold text-point">정준호</b>입니다.
          </h1>
        </div>
        <div className="h-0.5 w-full bg-point"></div>
        <div className="flex flex-col gap-2 text-sm sm:text-base lg:text-base">
          <span>
            조금이라도 더 <b className="font-semibold">상식적인 UI/UX</b>를
            제공하는 것에 보람을 느낍니다.
          </span>
          <span>
            <b className="font-semibold">불가능한 것은 없다</b>고 여기며, 항상{" "}
            <b>최선</b>을 찾습니다.
          </span>
          <span>
            프로덕트의 <b className="font-semibold">가장 열렬한 사용자</b>
            입니다.
          </span>
          <span>
            디자이너와 <b className="font-semibold">원활한 소통</b>이
            가능합니다.
          </span>
          <span>
            지식은 <b className="font-semibold">공유될 때 가치가 있다</b>고
            생각하며, 팀과 함께 성장합니다.
          </span>
          <div className="flex items-center gap-2">
            <LinkButton
              href="https://github.com/jjunohj"
              className="h-10 w-10 p-2"
            >
              <GithubIcon className="w-full text-black dark:text-white" />
            </LinkButton>
            <LinkButton
              href="mailto:jjunohj@gmail.com"
              className="h-10 w-10 p-2"
            >
              <MailIcon className="w-full text-red-500" />
            </LinkButton>
          </div>
        </div>
      </div>
      <div>
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
};

export default Profile;
