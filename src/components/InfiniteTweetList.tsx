import InfiniteScroll from "react-infinite-scroll-component";
import type Tweet from "~/interfaces/Tweet";
import { TweetCard } from "./TweetCard";
import { LoadingSpinner } from "./LoadingSpinner";
import { NoContentHeading } from "./NoContentHeading";

interface Props {
  tweets?: Tweet[];
  isError: boolean;
  isLoading: boolean;
  hasMore: boolean;
  fetchNewTweets: () => Promise<unknown>;
}

export function InfiniteTweetList({
  tweets,
  isError,
  isLoading,
  hasMore,
  fetchNewTweets,
}: Props) {
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <h1>Error</h1>;
  if (tweets == null || tweets.length === 0) {
    return (
      <NoContentHeading>
        No tweets
      </NoContentHeading>
    );
  }

  return (
    <ul>
      <InfiniteScroll
        dataLength={tweets.length}
        next={fetchNewTweets}
        hasMore={hasMore}
        loader={<LoadingSpinner />}
      >
        {tweets.map((tweet) => (
          <TweetCard key={tweet.id} {...tweet} />
        ))}
      </InfiniteScroll>
    </ul>
  );
}
