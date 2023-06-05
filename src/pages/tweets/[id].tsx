import {
  type GetStaticPaths,
  type GetStaticPropsContext,
  type InferGetStaticPropsType,
  type NextPage,
} from "next";
import { api } from "~/utils/api";
import ErrorPage from "next/error";
import { TweetCard } from "~/components/TweetCard";
import { ssgHelper } from "~/server/api/ssgHelper";
import { DetailHeader } from "~/components/DetailHeader";

const TweetDetails: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ id }) => {
  const { data: tweet } = api.tweet.getById.useQuery({ id });
  if (tweet == null) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
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
