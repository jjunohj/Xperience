import "../styles/globals.css";
import Providers from "../components/layouts/Providers";
import HeaderNav from "../components/layouts/HeaderNav";
import { Metadata } from "next";
import AuthorContacts from "../components/common/AuthorContacts";
import LinkExternal from "../components/common/LinkExternal";

export const metadata: Metadata = {
  title: "perience",
  description: "프론트엔드 개발자의 실전 경험과 인사이트를 공유하는 공간",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Xperiences",
    description: "프론트엔드 개발자의 실전 경험과 인사이트를 공유하는 공간",
    url: "https://blog.xuuno.me",
    siteName: "Xperiences",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Xperience",
    description: "내 경험을 공유하는 공간",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <div className="max-w-screen h-full dark:bg-neutral-900 dark:text-neutral-100">
            <div className="flex flex-col">
              <HeaderNav />
              <main className="relative pb-20">{children}</main>
              <footer className="pb-8 text-sm text-neutral-800 dark:text-neutral-400">
                <div className="flex flex-col items-center space-y-1">
                  <AuthorContacts />
                  <p>
                    <span className="text-gray-600 dark:text-gray-400">
                      © 2024{" "}
                    </span>
                    <LinkExternal href="https://github.com/jjunohj">
                      jjunohj
                    </LinkExternal>
                    <span className="text-gray-600 dark:text-gray-400">
                      {" "}
                      Powered by{" "}
                    </span>
                    <LinkExternal href="https://nextjs.org/">
                      Next 14
                    </LinkExternal>
                  </p>
                </div>
              </footer>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
