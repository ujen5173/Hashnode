import Link from "next/link";
import { useContext } from "react";
import { api } from "~/utils/api";
import { C, type ContextValue } from "~/utils/context";
import BookmarkCard from "./Cards/BookmarkCard";

export interface BookmarkInterface {
  id: string;
  title: string;
  slug: string;
  read_time: number;
  user: {
    name: string;
  };
}

const Bookmarks = () => {
  const { bookmarks } = useContext(C) as ContextValue;
  const { data: bookmarksData } = api.posts.getBookmarks.useQuery(
    {
      ids: bookmarks,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  return (
    <div className="my-4 rounded-md border border-border-light bg-white p-4 dark:border-border dark:bg-primary">
      <header className="flex items-center justify-between border-b border-border-light py-2 dark:border-border">
        <h1 className="text-xl font-bold text-gray-700 dark:text-text-secondary">
          Bookmarks ({bookmarksData?.length})
        </h1>
        <Link href={`/bookmarks`}>
          <button
            aria-label="view all the saved bookmarks"
            role="button"
            className="btn-outline-small"
          >
            See all
          </button>
        </Link>
      </header>

      <div>
        {bookmarksData && bookmarksData.length > 0 ? (
          bookmarksData?.map((bookmark) => (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} />
          ))
        ) : (
          <div className="py-8">
            <p className="text-center text-gray-700 dark:text-text-secondary">
              You don&apos;t have any bookmarks yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
