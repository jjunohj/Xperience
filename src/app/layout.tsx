import "../styles/globals.css";
import Providers from "../components/layouts/Providers";
import HeaderNav from "../components/layouts/HeaderNav";
import { Metadata, Viewport } from "next";
import AuthorContacts from "../components/common/AuthorContacts";
import LinkExternal from "../components/common/LinkExternal";
import VisitorCounter from "../components/VisitorCounter";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { RSS_PATH, SITE_NAME } from "../data/constants/site";

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export const metadata: Metadata = {
  metadataBase: new URL("https://blog.xuuno.me"),
  title: { default: "Xperiences", template: "%s | Xperiences" },
  description: "프론트엔드 개발자의 실전 경험과 인사이트를 공유하는 기술 블로그",
  keywords: ["프론트엔드", "개발", "기술블로그", "노션블로그", "React", "Next.js", "웹개발"],
  icons: [
    { rel: "icon", url: "/favicon/logo-black.svg", media: "(prefers-color-scheme: light)" },
    { rel: "icon", url: "/favicon/logo-white.svg", media: "(prefers-color-scheme: dark)" },
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://blog.xuuno.me",
    siteName: "Xperiences",
    title: "Xperiences",
    description: "프론트엔드 개발자의 실전 경험과 인사이트를 공유하는 기술 블로그",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Xperiences 블로그" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Xperiences",
    description: "프론트엔드 개발자의 실전 경험과 인사이트를 공유하는 기술 블로그",
    images: ["/og-image.png"],
    creator: "@xuuno",
  },
  authors: [{ name: "jjunohj", url: "https://github.com/jjunohj" }],
  creator: "jjunohj",
  publisher: "Xperiences",
  // 네이버 서치어드바이저 사이트 소유 확인 (공개 무해 토큰)
  verification: {
    other: { "naver-site-verification": "79995699dc20b9f4c810a4088ff8d0934d46e62c" },
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <GoogleTagManager gtmId="GTM-KJ94CWP4" />
      <GoogleAnalytics gaId="G-TDVKJ04GVC" />
      <body suppressHydrationWarning>
        {/* RSS autodiscovery — 페이지별 metadata.alternates(canonical)가 루트 alternates.types를
            얕은 병합으로 덮어쓰므로, React가 head로 호이스팅하는 link 태그로 전 페이지에 싣는다 */}
        <link rel="alternate" type="application/rss+xml" title={SITE_NAME} href={RSS_PATH} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Xperiences",
              url: "https://blog.xuuno.me",
              description: "프론트엔드 개발자의 실전 경험과 인사이트를 공유하는 기술 블로그",
              author: {
                "@type": "Person",
                name: "jjunohj",
                url: "https://github.com/jjunohj",
                sameAs: ["https://github.com/jjunohj", "https://blog.xuuno.me/about"],
              },
              publisher: {
                "@type": "Organization",
                name: "Xperiences",
                url: "https://blog.xuuno.me",
                logo: { "@type": "ImageObject", url: "https://blog.xuuno.me/og-image.png", width: 1200, height: 630 },
              },
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://blog.xuuno.me/blog?search={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
              sameAs: ["https://github.com/jjunohj"],
            }),
          }}
        />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KJ94CWP4"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <Providers>
          <div className="max-w-screen min-h-screen dark:bg-neutral-900 dark:text-neutral-100">
            <div className="flex min-h-screen flex-col">
              <HeaderNav />
              <main className="relative grow pb-20">{children}</main>
              <footer className="pb-8 text-sm text-neutral-800 dark:text-neutral-400">
                <div className="flex flex-col items-center space-y-1">
                  <AuthorContacts />
                  <VisitorCounter />
                  <p className="text-xs text-neutral-500 dark:text-neutral-500">
                    <span>© 2026 </span>
                    <LinkExternal href="https://github.com/jjunohj">jjunohj</LinkExternal>
                    <span> Powered by Next 15 & Notion </span>
                  </p>
                </div>
              </footer>
            </div>
          </div>
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
