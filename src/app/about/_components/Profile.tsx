import Image from "next/image";

const Profile = () => {
  return (
    <section className="w-full h-96 flex justify-between items-center px-8">
      <div className="w-[2/3] h-full flex-col flex items-start justify-start mt-12 gap-4 ">
        <h1 className="text-4xl font-extralight dark:text-white">
          안녕하세요,
        </h1>
        <h1 className="text-4xl font-normal dark:text-white">
          사용자 중심 프론트엔드 개발자,
        </h1>
        <h1 className="text-4xl font-extralight mb-4 dark:text-white">
          <span className="font-semibold">정준호</span>입니다.
        </h1>
        <div className="w-full h-0.5 bg-orange-400"></div>
        <div className="flex flex-col gap-2">
          <span>
            조금이라도 더{" "}
            <b className="font-semibold">상식적이고 쾌적한 UI/UX</b>를 제공하는
            것에 보람을 느끼는 개발자입니다.
          </span>
          <span>
            <b className="font-semibold">불가능한 것은 없다</b>고 생각하며, 항상{" "}
            <b>최선</b>을 찾는 개발자입니다.
          </span>
          <span>
            프로덕트의 <b className="font-semibold">가장 열렬한 사용자</b>이자
            개발자입니다.
          </span>
          <span>
            디자이너와 <b className="font-semibold">원활한 소통</b>이 가능한
            개발자입니다.
          </span>
          <span>
            지식은 <b className="font-semibold">공유될 때 가치가 있다</b>고
            생각하며, 팀과 함께 성장하는 개발자입니다.
          </span>
        </div>
      </div>
      <Image
        src="/images/profile.png"
        alt="Profile"
        width={360}
        height={360}
        priority
        className="rounded-full w-[360px]"
      />
    </section>
  );
};

export default Profile;
