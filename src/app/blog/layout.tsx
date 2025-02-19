import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Xperiences",
  description: "프론트엔드 개발자의 기술 블로그 글 모음",
  openGraph: {
    title: "Blog | Xperiences",
    description: "프론트엔드 개발자의 기술 블로그 글 모음",
    url: "https://blog.xuuno.me/blog",
    type: "website",
    locale: "ko_KR",
    siteName: "Xperiences",
  },
  alternates: {
    canonical: "https://blog.xuuno.me/blog",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col items-center">
      <main className="relative mt-14 w-full sm:mt-[5.5rem]">{children}</main>
    </div>
  );
}
