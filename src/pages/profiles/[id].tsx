import {
  type GetStaticPaths,
  type GetStaticPropsContext,
  type InferGetStaticPropsType,
  type NextPage,
} from "next";
import Head from "next/head";
import { ssgHelper } from "~/server/api/ssgHelper";
import { api } from "~/utils/api";
import { InfiniteTweetList } from "~/components/InfiniteTweetList";
import { ProfileHeader } from "~/components/ProfileHeader";
import Custom404 from "../404";

const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  id,
}) => {
  // No loading state since we made this query on getStaticProps
  const { data: profile } = api.profile.getById.useQuery({ id });
  const tweetsQuery = api.tweet.infiniteProfileFeed.useInfiniteQuery(
    { userId: id },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  if (profile == null || profile.name == null) return <Custom404 />;

  return (
    <>
      <Head>
        <title>{`Twitter clone / ${profile.name}`}</title>
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`Profile of ${profile.name}`} />
        <meta name="twitter:card" content="summary" />
        <meta property="og:description" content={profile.bio} />
        <meta property="og:image" content={profile.image ?? ""} />
      </Head>
      <ProfileHeader id={id} profile={profile} />
      <main>
        <InfiniteTweetList
          tweets={tweetsQuery.data?.pages.flatMap((page) => page.tweets)}
          isError={tweetsQuery.isError}
          isLoading={tweetsQuery.isLoading}
          hasMore={tweetsQuery.hasNextPage ?? false}
          fetchNewTweets={tweetsQuery.fetchNextPage}
        />
      </main>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>
) {
  const id = context.params?.id;
  if (id == null) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  const ssg = ssgHelper();
  await ssg.profile.getById.prefetch({ id });

  return {
    props: {
      id,
      trpcState: ssg.dehydrate(),
    },
  };
}

export default ProfilePage;
