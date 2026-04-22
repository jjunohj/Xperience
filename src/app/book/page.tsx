import { Metadata } from "next";
import BookShelfClient from "./_components/BookShelfClient";
import { getBookShelfMetadata } from "@/src/libs/notion";

const BOOK_DESCRIPTION = "책을 통해 얻은 배움과 삶의 변화를 기록합니다.";

export const metadata: Metadata = {
  title: "Book",
  description: BOOK_DESCRIPTION,
  openGraph: {
    title: "Book | Xperiences",
    description: BOOK_DESCRIPTION,
    url: "https://blog.xuuno.me/book",
    siteName: "Xperiences",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Xperiences Book Archive",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book | Xperiences",
    description: BOOK_DESCRIPTION,
    images: ["/og-image.png"],
    creator: "@xuuno",
  },
  alternates: {
    canonical: "https://blog.xuuno.me/book",
  },
  keywords: ["도서 리뷰", "독서 노트", "책 요약", "book review", "서평"],
};

export const revalidate = 3000;

export default async function BookPage() {
  const books = await getBookShelfMetadata();
  const uploadedBooks = books.filter((book) => book.status === "Upload");

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 p-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Book",
            description: BOOK_DESCRIPTION,
            url: "https://blog.xuuno.me/book",
            isPartOf: {
              "@type": "WebSite",
              name: "Xperiences",
              url: "https://blog.xuuno.me",
            },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: uploadedBooks.length,
              itemListElement: uploadedBooks.slice(0, 10).map((book, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `https://blog.xuuno.me/book/${book.slug}`,
                name: book.title,
              })),
            },
          }),
        }}
      />

      <div className="mb-4">
        <h1 className="mb-3 text-4xl font-extrabold lg:text-5xl">Books</h1>
        <span className="pl-1 text-sm font-light text-neutral-600 dark:text-neutral-400">
          기억은 지적인 노동을 수행한 자에게만 주어지는 보상이다.
        </span>
      </div>

      <BookShelfClient books={books} />
    </div>
  );
}
