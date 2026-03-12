import { Metadata } from "next";
import { notFound } from "next/navigation";
import BookPostLayout from "../_components/BookPostLayout";
import { getAllBookMetadata, getBookDetail } from "@/src/libs/notion";

type BookPostPageProps = {
  params: Promise<{ slug: string }>;
};

const SITE_ORIGIN = "https://blog.xuuno.me";

function getBookCanonicalUrl(slug: string): string {
  return `${SITE_ORIGIN}/book/${encodeURIComponent(slug)}`;
}

export async function generateStaticParams() {
  try {
    const books = await getAllBookMetadata();
    return books.map((book) => ({ slug: book.slug }));
  } catch (error) {
    console.error("Book 정적 파라미터 생성 실패:", error);
    return [];
  }
}

export const revalidate = 3000;
export const dynamicParams = true;

export async function generateMetadata({ params }: BookPostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const canonicalUrl = getBookCanonicalUrl(resolvedParams.slug);

  try {
    const book = await getBookDetail(resolvedParams.slug);

    if (!book) {
      return {
        title: "Book Not Found",
        alternates: { canonical: canonicalUrl },
        robots: { index: false, follow: false },
      };
    }

    return {
      title: `${book.title} | Book`,
      description: book.description,
      openGraph: {
        title: book.title,
        description: book.description,
        images: [
          {
            url: book.cover || "/og-image.png",
            width: 1200,
            height: 630,
            alt: book.title,
          },
        ],
        type: "article",
        locale: "ko_KR",
        siteName: "Xperiences",
        url: canonicalUrl,
      },
      twitter: {
        card: "summary_large_image",
        title: book.title,
        description: book.description,
        images: [book.cover || "/og-image.png"],
        creator: "@xuuno",
      },
      alternates: { canonical: canonicalUrl },
      keywords: [book.title, book.author, book.category || "book review", "독서 기록", "서평"],
    };
  } catch (error) {
    console.error("Book metadata 생성 실패:", error);
    return {
      title: "Book Not Found",
      alternates: { canonical: canonicalUrl },
    };
  }
}

export default async function BookPostPage({ params }: BookPostPageProps) {
  try {
    const resolvedParams = await params;
    const book = await getBookDetail(resolvedParams.slug);

    if (!book) {
      notFound();
    }

    return <BookPostLayout book={book} />;
  } catch (error) {
    console.error("Book 상세 페이지 로드 실패:", error);
    notFound();
  }
}
