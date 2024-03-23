import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "../components/layouts/Providers";
import HeaderNav from "../components/layouts/HeaderNav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <title>jjunohj</title>
        <link rel="icon" type="image/x-icon" href="/favicon.png" />
      </head>
      <body>
        <Providers>
          <div className="px-6 dark:bg-neutral-900 dark:text-neutral-100">
            <div className="mx-auto max-w-3xl px-6 lg:max-w-6xl lg:px-8">
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
