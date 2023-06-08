import { api } from "~/utils/api";
import { InfiniteNotificationsList } from "./InfiniteNotificationsList";

export function RecentNotifications() {
  const notificationsQuery = api.notification.getAll.useInfiniteQuery(
    {},
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  return (
    <InfiniteNotificationsList
      notifications={notificationsQuery.data?.pages.flatMap(
        (page) => page.notifications
      )}
      isError={notificationsQuery.isError}
      isLoading={notificationsQuery.isLoading}
      hasMore={notificationsQuery.hasNextPage ?? false}
      fetchNewTweets={notificationsQuery.fetchNextPage}
    />
  );
}
