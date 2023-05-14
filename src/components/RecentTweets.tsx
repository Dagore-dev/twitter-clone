import { api } from "~/utils/api"
import { InfiniteTweetList } from "./InfiniteTweetList"

export function RecentTweets () {
  const tweetsQuery = api.tweet.infiniteFeed.useInfiniteQuery({}, { getNextPageParam: lastPage => lastPage.nextCursor })

  return (
    <InfiniteTweetList 
      tweets={tweetsQuery.data?.pages.flatMap(page => page.tweets)}
      isError={tweetsQuery.isError}
      isLoading={tweetsQuery.isLoading}
      hasMore={tweetsQuery.hasNextPage ?? false}
      fetchNewTweets={tweetsQuery.fetchNextPage}
    />
  )
}
