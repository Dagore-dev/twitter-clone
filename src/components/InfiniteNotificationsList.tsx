import InfiniteScroll from "react-infinite-scroll-component";
import type Notification from "~/interfaces/Notification";
import { LoadingSpinner } from "./LoadingSpinner";
import { LikeNotificationCard } from "./LikeNotificationCard";

interface Props {
  notifications?: Notification[];
  isError: boolean;
  isLoading: boolean;
  hasMore: boolean;
  fetchNewTweets: () => Promise<unknown>;
}

export function InfiniteNotificationsList({
  notifications,
  isError,
  isLoading,
  hasMore,
  fetchNewTweets,
}: Props) {
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <h1>Error</h1>;
  if (notifications == null || notifications.length === 0) {
    return (
      <h2 className="my-4 text-center text-2xl text-gray-500">
        No notifications
      </h2>
    );
  }

  return (
    <ul>
      <InfiniteScroll
        dataLength={notifications.length}
        next={fetchNewTweets}
        hasMore={hasMore}
        loader={<LoadingSpinner />}
      >
        {notifications.map((notification) => (
          <LikeNotificationCard key={notification.id} {...notification} />
        ))}
      </InfiniteScroll>
    </ul>
  );
}
