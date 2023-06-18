import {
  type GetStaticPaths,
  type GetStaticPropsContext,
  type InferGetStaticPropsType,
  type NextPage,
} from "next";
import { api } from "~/utils/api";
import { TweetCard } from "~/components/TweetCard";
import { ssgHelper } from "~/server/api/ssgHelper";
import { DetailHeader } from "~/components/DetailHeader";
import Custom404 from "../404";
import Head from "next/head";

const TweetDetails: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ id }) => {
  const { data: tweet } = api.tweet.getById.useQuery({ id });
  if (tweet == null) {
    return <Custom404 />;
  }
  return (
    <>
      <Head>
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`Tweet of ${tweet.user?.name ?? "User"}`}
        />
        <meta name="twitter:card" content="summary" />
        <meta property="og:description" content={tweet.content} />
        {/* TODO: Images are not shown in preview */}
        <meta property="og:image" content={tweet.user?.image ?? ""} />
      </Head>
      <DetailHeader text="Tweet" />
      <ul>
        <TweetCard
          content={tweet.content}
          imageUrl={tweet.imageUrl}
          createdAt={tweet.createdAt}
          id={tweet.id}
          likeCount={tweet.likeCount}
          likedByMe={tweet.likedByMe}
          user={tweet.user}
          image={tweet.image}
          isDetail={true}
        />
      </ul>
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
  await ssg.tweet.getById.prefetch({ id });

  return {
    props: {
      id,
      trpcState: ssg.dehydrate(),
    },
  };
}

export default TweetDetails;
