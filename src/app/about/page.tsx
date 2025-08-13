import { Metadata } from "next";
import Profile from "./_components/Profile";
import InfoSection from "./_components/InfoSection";
import TechStack from "./_components/TechStack";
import {
  techStacks,
  projects,
  activities,
  awards,
  educations,
  certifications,
  career,
} from "./_components/data";
import Project from "./_components/Project";
import Activity from "./_components/Activity";
import Career from "./_components/Career";

export const metadata: Metadata = {
  title: "About",
  description: "사용자 중심 프론트엔드 개발자 정준호입니다. React, Next.js, TypeScript를 활용한 웹 개발 전문가입니다.",
  openGraph: {
    title: "About | Xperiences",
    description: "사용자 중심 프론트엔드 개발자 정준호입니다. React, Next.js, TypeScript를 활용한 웹 개발 전문가입니다.",
    url: "https://blog.xuuno.me/about",
    siteName: "Xperiences",
    locale: "ko_KR",
    type: "profile",
    images: [
      {
        url: "/images/profile.png",
        width: 400,
        height: 400,
        alt: "정준호 프로필",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "About | Xperiences",
    description: "사용자 중심 프론트엔드 개발자 정준호입니다.",
    images: ["/images/profile.png"],
    creator: "@xuuno",
  },
  alternates: {
    canonical: "https://blog.xuuno.me/about",
  },
  keywords: ["프론트엔드 개발자", "정준호", "React", "Next.js", "TypeScript", "웹개발", "포트폴리오"],
};

export default function AboutPage() {
  return (
    <div className="mx-auto flex h-full w-full max-w-6xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "정준호",
            alternateName: "jjunohj",
            url: "https://blog.xuuno.me/about",
            image: "https://blog.xuuno.me/images/profile.png",
            jobTitle: "Frontend Developer",
            description: "사용자 중심 프론트엔드 개발자 정준호입니다. React, Next.js, TypeScript를 활용한 웹 개발 전문가입니다.",
            sameAs: [
              "https://github.com/jjunohj",
              "https://blog.xuuno.me",
            ],
            knowsAbout: ["React", "Next.js", "TypeScript", "JavaScript", "Web Development", "Frontend Development"],
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://blog.xuuno.me",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "About",
                  item: "https://blog.xuuno.me/about",
                },
              ],
            },
          }),
        }}
      />
      <div id="resume">
        <Profile />
        <InfoSection title={"기술"}>
          {techStacks.map((stack, index) => (
            <TechStack
              key={index}
              title={stack.title}
              elements={stack.elements}
            />
          ))}
        </InfoSection>
        <InfoSection title={"경력"}>
          {career.map((career, index) => (
            <Career key={index} {...career} />
          ))}
        </InfoSection>
        <InfoSection title={"프로젝트"}>
          {projects.map((project, index) => (
            <Project key={index} {...project} />
          ))}
        </InfoSection>
        <InfoSection title={"활동·교육"}>
          {activities.map((activity, index) => (
            <Activity key={index} {...activity} />
          ))}
        </InfoSection>
        <InfoSection title={"수상"}>
          {awards.map((award, index) => (
            <Activity key={index} {...award} />
          ))}
        </InfoSection>
        <InfoSection title={"자격·어학"}>
          {certifications.map((certification, index) => (
            <Activity key={index} {...certification} />
          ))}
        </InfoSection>
        <InfoSection title={"학력"}>
          {educations.map((education, index) => (
            <Activity key={index} {...education} />
          ))}
        </InfoSection>
      </div>
    </div>
  );
}
