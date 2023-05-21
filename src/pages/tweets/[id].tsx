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
import Link from "next/link";
import { IconHoverEffect } from "~/components/IconHoverEffect";
import { VscArrowLeft } from "react-icons/vsc";

const TweetDetails: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ id }) => {
  const { data: tweet } = api.tweet.getById.useQuery({ id });
  if (tweet == null) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      <header className="sticky top-0 z-10 flex items-center border-b bg-white px-4 py-2">
        <Link href=".." className="mr-2">
          <IconHoverEffect red={false}>
            <VscArrowLeft className="h-6 w-6" />
          </IconHoverEffect>
        </Link>
        <div className="ml-2 flex-grow">
          <h1 className="text-lg font-bold">Tweet</h1>
        </div>
      </header>

      <ul>
        <TweetCard
          content={tweet.content}
          imageUrl={tweet.imageUrl}
          createdAt={tweet.createdAt}
          id={tweet.id}
          likeCount={tweet.likeCount}
          likedByMe={tweet.likedByMe}
          user={tweet.user}
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
