import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { DetailHeader } from "~/components/DetailHeader";
import ErrorPage from "next/error";
import Head from "next/head";
import { RecentNotifications } from "~/components/RecentNotifications";

const NotificationsPage: NextPage = () => {
  const session = useSession();

  if (session.status !== "authenticated") {
    return <ErrorPage statusCode={401} />;
  }

  return (
    <>
      <Head>
        <title>Twitter clone / Notifications</title>
      </Head>

      <DetailHeader text="Notifications" />

      <main>
        <RecentNotifications />
      </main>
    </>
  );
};

export default NotificationsPage;
