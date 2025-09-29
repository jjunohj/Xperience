import "../styles/globals.css";
import Providers from "../components/layouts/Providers";
import HeaderNav from "../components/layouts/HeaderNav";
import { Metadata, Viewport } from "next";
import AuthorContacts from "../components/common/AuthorContacts";
import LinkExternal from "../components/common/LinkExternal";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
  alternates: { canonical: "https://blog.xuuno.me" },
  robots: {
    index: true,
    follow: true,
    // nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <GoogleTagManager gtmId="GTM-KJ94CWP4" />
      <GoogleAnalytics gaId="G-TDVKJ04GVC" />
      <body suppressHydrationWarning>
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
          <div className="max-w-screen h-full dark:bg-neutral-900 dark:text-neutral-100">
            <div className="flex flex-col">
              <HeaderNav />
              <main className="relative pb-20">{children}</main>
              <footer className="pb-8 text-sm text-neutral-800 dark:text-neutral-400">
                <div className="flex flex-col items-center space-y-1">
                  <AuthorContacts />
                  <p>
                    <span className="text-neutral-600 dark:text-neutral-400">© 2025 </span>
                    <LinkExternal href="https://github.com/jjunohj">jjunohj</LinkExternal>
                    <span className="text-neutral-600 dark:text-neutral-400"> Powered by </span>
                    <LinkExternal href="https://nextjs.org/">Next 15 & Notion</LinkExternal>
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
