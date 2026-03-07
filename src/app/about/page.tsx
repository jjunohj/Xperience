import { Metadata } from "next";
import Profile from "./_components/Profile";

export const metadata: Metadata = {
  title: "About",
  description: "AI를 활용해 서비스 전체 아키텍처를 최적화하고 비용 절감과 신규 기회 창출을 고민합니다.",
  openGraph: {
    title: "About | Xperiences",
    description: "AI를 활용해 서비스 전체 아키텍처를 최적화하고 비용 절감과 신규 기회 창출을 고민합니다.",
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
    description: "AI 기반 아키텍처 최적화와 비즈니스 가치 극대화에 집중합니다.",
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
            description: "AI를 활용해 서비스 전체 아키텍처를 최적화하고 비용 절감과 신규 기회 창출을 고민합니다.",
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
      <div id="about" className="w-full">
        <Profile />
      </div>
    </div>
  );
}
