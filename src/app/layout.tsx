import "../styles/globals.css";
import Layout from "../components/layouts/Layout";
import { Toaster } from "react-hot-toast";
import Providers from "../components/layouts/Providers";

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
            <Layout>{children}</Layout>

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
