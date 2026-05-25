import { getAllBookMetadata } from "~/libs/notion";
import NotionBookCard from "./NotionBookCard";

export default async function NotionBookCardsServer() {
  const books = await getAllBookMetadata();
  const recentBooks = books.slice(0, 4);

  if (recentBooks.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {recentBooks.map((book) => (
        <NotionBookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
