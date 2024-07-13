import Image from "next/image";

const Profile = () => {
  return (
    <section className="w-full h-fit flex flex-col-reverse lg:flex-row justify-center items-center p-4">
      <div className="w-full lg:w-2/3 flex flex-col items-start justify-start gap-6">
        <div className="space-y-2 mt-4 sm:mt-8 lg:mt-0">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extralight dark:text-white">
            안녕하세요,
          </h1>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-normal text-primary dark:text-white">
            사용자 중심 프론트엔드 개발자,
          </h1>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extralight dark:text-white">
            <b className="font-semibold text-point">정준호</b>입니다.
          </h1>
        </div>
        <div className="w-full h-0.5 bg-point"></div>
        <div className="flex flex-col gap-2 text-sm sm:text-base lg:text-base">
          <span>
            조금이라도 더 <b className="font-semibold">상식적인 UI/UX</b>를
            제공하는 것에 보람을 느낍니다.
          </span>
          <span>
            <b className="font-semibold">불가능한 것은 없다</b>고 생각하며, 항상{" "}
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
        </div>
      </div>
      <div>
        <Image
          src="/images/profile.png"
          alt="Profile"
          width={360}
          height={360}
          priority
          className="rounded-full w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] lg:w-[320px] lg:h-[320px] object-cover shadow-2xl shadow-transparent lg:shadow-point lg:drop-shadow-md"
        />
      </div>
    </section>
  );
};

export default Profile;
