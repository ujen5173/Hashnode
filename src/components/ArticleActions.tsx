import { TRPCClientError } from "@trpc/client";
import { useContext, useEffect, useState, FC } from "react";
import { toast } from "react-toastify";
import { Bookmarkplus, Comment, Dots, Heart, Share } from "~/svgs";
import Bookmarked from "~/svgs/Bookmarked";
import type { Article } from "~/types";
import { api } from "~/utils/api";
import { C, ContextValue } from "~/utils/context";
import ShareMenu from "./ShareMenu"; // Import the ShareMenu component

const ArticleActions: FC<{
  article: Article;
  setCommentsModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ article, setCommentsModal }) => {
  const { user, bookmarks, updateBookmark } = useContext(C) as ContextValue;
  const { mutate: LikeArticle } = api.likes.likeArticle.useMutation();
  const [like, setLike] = useState({
    hasLiked: false,
    likesCount: article.likesCount,
  });

  const [shareMenuOpen, setShareMenuOpen] = useState(false); // State to manage share menu visibility

  useEffect(() => {
    if (!user?.user.id) {
      return setLike({
        hasLiked: false,
        likesCount: article.likesCount,
      });
    }

    const hasLiked = article.likes.find((like) => like.id === user?.user.id)
      ? true
      : false;

    setLike({
      hasLiked,
      likesCount: article.likesCount,
    });
  }, [user?.user.id]);

  const likeFunction = () => {
    if (!user?.user.id) {
      toast.error("You need to login to like an article");
      return;
    }

    try {
      setLike({
        hasLiked: !like.hasLiked,
        likesCount: like.hasLiked ? like.likesCount - 1 : like.likesCount + 1,
      });
      LikeArticle({
        articleId: article.id,
      });
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast.error(error.message);
      }
    }
  };

  const openShareMenu = () => {
    setShareMenuOpen(true);
  };

  const closeShareMenu = () => {
    setShareMenuOpen(false);
  };

  return (
    <div className="sticky bottom-4 left-0 flex w-full items-center justify-center gap-2 px-4 py-4">
      <div className="mx-auto flex items-center justify-between gap-2 rounded-full border border-border-light bg-light-bg px-4 py-1 dark:border-border dark:bg-primary-light sm:w-max">
        <button
          aria-label="icon"
          role="button"
          onClick={() => void likeFunction()}
          className="flex items-center gap-2 rounded-full p-2 text-gray-700 hover:bg-text-secondary dark:text-text-secondary dark:hover:bg-border"
        >
          <div className="flex items-center justify-center gap-2">
            <Heart
              className={`h-5 w-5 fill-none ${
                like.hasLiked
                  ? "fill-red stroke-red"
                  : "stroke-border dark:stroke-text-primary"
              }  md:h-6 md:w-6`}
            />
          </div>
          <span>{like.likesCount}</span>
        </button>
        {!article.disabledComments && (
          <>
            <div className="h-6 w-[2px] bg-border-light dark:bg-border"></div>
            <button
              aria-label="icon"
              role="button"
              onClick={() => setCommentsModal(true)}
              className="flex items-center gap-2 rounded-full p-2 text-gray-700 hover:bg-text-secondary dark:text-text-secondary dark:hover:bg-border"
            >
              <div className="flex items-center justify-center gap-2">
                <Comment className="h-5 w-5 fill-none stroke-border dark:stroke-text-primary md:h-6 md:w-6" />
              </div>
              <span>{article.commentsCount}</span>
            </button>
          </>
        )}

        <div className="h-6 w-[2px] bg-border-light dark:bg-border"></div>
        <button
          aria-label="icon"
          onClick={() => updateBookmark(article.id)}
          role="button"
          className={`${
            bookmarks.find((bookmark) => bookmark.id === article.id)
              ? "bg-secondary bg-opacity-20"
              : ""
          } btn-icon-large flex w-max items-center justify-center`}
        >
          {bookmarks.find((bookmark) => bookmark.id === article.id) ? (
            <Bookmarked className="h-5 w-5" />
          ) : (
            <Bookmarkplus className="h-5 w-5 fill-gray-700 dark:fill-text-primary" />
          )}
        </button>

        <div className="h-6 w-[2px] bg-border-light dark:bg-border"></div>
        <button
          aria-label="icon"
          role="button"
          className="flex items-center gap-2 rounded-full p-2 text-gray-700 hover:bg-text-secondary dark:text-text-secondary dark:hover:bg-border"
          onClick={openShareMenu} // Open the share menu
        >
          <div className="flex items-center justify-center gap-2">
            <Share className="h-5 w-5 fill-none stroke-border dark:stroke-text-primary md:h-6 md:w-6" />
          </div>
        </button>
        <div className="h-6 w-[2px] bg-border-light dark:bg-border"></div>
        <button
          aria-label="icon"
          role="button"
          className="flex items-center gap-2 rounded-full p-2 text-gray-700 hover:bg-text-secondary dark:text-text-secondary dark:hover:bg-border"
        >
          <div className="flex items-center justify-center gap-2">
            <Dots className="h-5 w-5 stroke-border dark:stroke-text-primary md:h-6 md:w-6" />
          </div>
        </button>

        {shareMenuOpen && (
          <ShareMenu onClose={closeShareMenu} /> // Render the share menu when shareMenuOpen is true
        )}
      </div>
    </div>
  );
};

export default ArticleActions;
