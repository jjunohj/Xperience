import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "../components/layouts/Providers";
import HeaderNav from "../components/layouts/HeaderNav";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "J archive",
  description: "J archive",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <div className=" dark:bg-neutral-900 dark:text-neutral-100">
            <div className="sm:mx-auto max-w-4xl  lg:max-w-6xl lg:px-8">
              <HeaderNav />
              <main className="relative pb-16">{children}</main>
              <footer className="pb-8 text-sm text-neutral-800 dark:text-neutral-400"></footer>
            </div>
            <Toaster
              toastOptions={{
                className: "text-primary bg-secondary",
                position: "top-center",
              }}
            />
          </div>
        </Providers>
      </body>
    </html>
  );
}
