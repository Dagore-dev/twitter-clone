import Link from "next/link";
import type Tweet from "~/interfaces/Tweet";
import { ProfileImage } from "./ProfileImage";
import { dateTimeFormatter } from "../utils/dateTimeFormatter";
import { LikeButton } from "./LikeButton";
import { api } from "~/utils/api";
import { type FeedData } from "~/interfaces/FeedData";

export function TweetCard({
  id,
  content,
  createdAt,
  likeCount,
  likedByMe,
  user,
  isDetail,
}: Tweet & { isDetail?: boolean }) {
  const trpcUtils = api.useContext();
  const toggleLike = api.tweet.toggleLike.useMutation({
    onSuccess: ({ addedLike }) => {
      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, (oldData) =>
        updateData(oldData, addedLike)
      );
      trpcUtils.tweet.infiniteFeed.setInfiniteData(
        { onlyFollowing: true },
        (oldData) => updateData(oldData, addedLike)
      );
      trpcUtils.tweet.infiniteProfileFeed.setInfiniteData(
        { userId: user.id },
        (oldData) => updateData(oldData, addedLike)
      );
    },
  });

  return (
    <li className="flex gap-4 border-b p-4">
      <Link href={`/profiles/${user.id}`}>
        <ProfileImage src={user.image} />
      </Link>

      <div className="flex flex-grow flex-col ">
        <div className="flex gap-1">
          <Link
            href={`/profiles/${user.id}`}
            className="font-bold outline-none hover:underline focus-visible:underline"
          >
            {user.name}
          </Link>
          <span className="text-gray-400">-</span>
          <span className="text-gray-400">
            {dateTimeFormatter.format(createdAt)}
          </span>
        </div>

        <div>
          {isDetail ? (
            <>
              <p className="whitespace-pre-wrap">{content}</p>

              <LikeButton
                onClick={handleToggleLike}
                isLoading={toggleLike.isLoading}
                likedByMe={likedByMe}
                likeCount={likeCount}
              />
            </>
          ) : (
            <Link href={`/tweets/${id}`}>
              <p className="whitespace-pre-wrap">{content}</p>

              <LikeButton
                onClick={handleToggleLike}
                isLoading={toggleLike.isLoading}
                likedByMe={likedByMe}
                likeCount={likeCount}
              />
            </Link>
          )}
        </div>
      </div>
    </li>
  );

  function handleToggleLike() {
    toggleLike.mutate({ id });
  }

  function updateData(oldData: FeedData, addedLike: boolean) {
    if (oldData == null) return;

    const countModifier = addedLike ? 1 : -1;
    return {
      ...oldData,
      // Updating the tweet likeCount and likedByMe properties and leaving the rest of the data without changes
      pages: oldData.pages.map((page) => {
        return {
          ...page,
          tweets: page.tweets.map((tweet) => {
            if (tweet.id === id) {
              return {
                ...tweet,
                likeCount: likeCount + countModifier,
                likedByMe: addedLike,
              };
            }
            return tweet;
          }),
        };
      }),
    };
  }
}
