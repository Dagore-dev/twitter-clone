import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { DetailHeader } from "~/components/DetailHeader";
import Head from "next/head";
import { RecentNotifications } from "~/components/RecentNotifications";
import { NoContentHeading } from "~/components/NoContentHeading";

const NotificationsPage: NextPage = () => {
  const session = useSession();

  return (
    <>
      <Head>
        <title>Twitter clone / Notifications</title>
      </Head>

      <DetailHeader text="Notifications" />

      {session.status === "authenticated" ? (
        <RecentNotifications />
      ) : (
        <NoContentHeading>
          Seems that your are not authenticated. Try to&nbsp;
          <strong
            onClick={() => void signIn()}
            className="cursor-pointer md:hover:underline"
          >
            Log in
          </strong>
        </NoContentHeading>
      )}
    </>
  );
};

export default NotificationsPage;
