import React, { type FC, useState, useEffect, useContext } from "react";
import { Filter, Fire, Clock } from "~/svgs";
import type { DetailedTag } from "~/types";
import { api } from "~/utils/api";
import { C, type ContextValue } from "~/utils/context";
import ArticleCard from "./Cards/ArticleCard";
import ArticleLoading from "./Loading/ArticleLoading";
import type { FilterData } from "./MainBodyHeader";
import Select from "./Select";
import TagPageHeader from "./TagPageHeader";
import Tags from "./Tags";

const MainTagBody: FC<{ tagDetails: DetailedTag }> = ({ tagDetails }) => {
  const [following, setFollowing] = useState<boolean>(false);
  const { data: tags, isLoading } = api.posts.getArticlesUsingTag.useQuery({
    name: tagDetails.name,
  });
  const { mutate: followToggle } = api.tags.followTagToggle.useMutation();
  const { user } = useContext(C) as ContextValue;

  const [filter, setFilter] = useState<FilterData>({
    status: false,
    data: {
      read_time: null,
      tags: [],
    },
  });

  const clearFilter = () => {
    setFilter({
      ...filter,
      data: {
        read_time: null,
        tags: [],
      },
    });
  };

  const applyFilter = () => {
    setFilter({
      ...filter,
      status: false,
    });
  };

  const followTag = (name: string) => {
    setFollowing((prev) => !prev);
    followToggle({
      name: name,
    });
  };

  useEffect(() => {
    if (tagDetails && user) {
      const isFollowing = tagDetails.followers.find(
        (follower) => follower.id === user.user.id
      );
      if (isFollowing) {
        setFollowing(true);
      } else {
        setFollowing(false);
      }
    }
  }, [tagDetails, user]);

  return (
    <section className="container-main my-4 min-h-screen w-full">
      <TagPageHeader
        tagDetails={tagDetails}
        following={following}
        followTag={followTag}
      />

      <main className="flex flex-col items-center justify-center rounded-md border border-border-light bg-white dark:border-border dark:bg-primary">
        <div className="flex w-full flex-col items-end justify-between gap-2 pt-2">
          <div className="flex w-full items-end justify-between border-b border-border-light px-2 dark:border-border">
            <div className="flex w-full items-center gap-2">
              <button aria-label="icon" role="button" className="btn-tab">
                <Fire className="h-4 w-4 fill-gray-700 dark:fill-text-primary" />
                <span className={`${""} text-sm font-semibold`}>Hot</span>
              </button>
              <button aria-label="icon" role="button" className="btn-tab">
                <Clock className="h-4 w-4 fill-none stroke-gray-700 dark:stroke-text-primary" />
                <span className={`${""} text-sm font-semibold`}>New</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div
                onClick={() => {
                  setFilter((prev) => ({
                    ...prev,
                    status: !prev.status,
                  }));
                }}
                className="btn-tab cursor-pointer"
              >
                <button
                  aria-label="icon"
                  role="button"
                  className="relative flex items-center justify-center"
                >
                  <Filter
                    className={`h-4 w-4 ${
                      filter.data.read_time !== null ||
                      filter.data.tags.length > 0
                        ? "fill-secondary stroke-secondary"
                        : ""
                    } fill-gray-700 dark:fill-text-primary`}
                  />
                </button>
                <span
                  className={`${
                    filter.data.read_time !== null ||
                    filter.data.tags.length > 0
                      ? "text-secondary"
                      : "text-gray-700 dark:text-text-primary"
                  }`}
                >
                  Filter
                </span>
              </div>
            </div>
          </div>

          {filter.status && (
            <section className="relative flex w-full flex-col justify-between gap-4 border-b border-border-light p-4 dark:border-border md:flex-row lg:flex-col xl:flex-row">
              <div className="flex w-full flex-col gap-4 sm:flex-row md:w-8/12 lg:w-full xl:w-8/12">
                <div className="w-full md:w-auto">
                  <label
                    className="mb-2 inline-block text-gray-700 dark:text-text-secondary"
                    htmlFor="read_time"
                  >
                    Read Time
                  </label>
                  <Select
                    defaultText={"Select read time"}
                    options={["Under 5 min", "5 min", "Over 5 min"]}
                  />
                </div>
                <div className="w-full md:w-auto">
                  <label
                    className="mb-2 inline-block text-gray-700 dark:text-text-secondary"
                    htmlFor="read_time"
                  >
                    Tags
                  </label>
                  <Tags filter={filter} setFilter={setFilter} />
                </div>
              </div>
              <div className="mt-0 flex items-start gap-2 md:mt-8 lg:mt-0 xl:mt-8">
                <button onClick={applyFilter} className="btn-outline">
                  Apply
                </button>
                <button onClick={clearFilter} className="btn-subtle">
                  Clear Filter
                </button>
              </div>
            </section>
          )}
        </div>

        {isLoading ? (
          <div className="w-full">
            <ArticleLoading />
            <ArticleLoading />
            <ArticleLoading />
            <ArticleLoading />
            <ArticleLoading />
          </div>
        ) : (
          tags?.map((article) => (
            <ArticleCard card={article} key={article.id} />
          ))
        )}
      </main>
    </section>
  );
};

export default MainTagBody;
