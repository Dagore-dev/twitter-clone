import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { NewTweetForm } from "~/components/NewTweetForm";
import { RecentTweets } from "~/components/RecentTweets";
import { Tabs } from "~/components/Tabs";
import { type TABS } from "~/utils/TABS";

const Home: NextPage = () => {
  const [selectedTab, setSelectedTab] = useState<typeof TABS[number]>('Recent')
  const session = useSession()
  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-white pt-2">
        <h1 className="mb-2 px-4 text-lg font-bold">Home</h1>
        {session.status === 'authenticated' && <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />}
      </header>

      <NewTweetForm />
      <RecentTweets />
    </>
  );
};

export default Home;
