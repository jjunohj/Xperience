import { Header } from "src/components/Header";
import "../styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <title>Contentlayer Next.js Example</title>
        <link rel="icon" type="image/x-icon" href="/favicon.png" />
      </head>
      <body>
        <Header />
        <div className="px-6">{children}</div>
      </body>
    </html>
  );
}
