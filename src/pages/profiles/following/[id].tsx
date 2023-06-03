import {
  type GetStaticPaths,
  type GetStaticPropsContext,
  type InferGetStaticPropsType,
  type NextPage,
} from "next";
import Head from "next/head";
import { DetailHeader } from "~/components/DetailHeader";
import { ssgHelper } from "~/server/api/ssgHelper";
import { api } from "~/utils/api";
import ErrorPage from "next/error";
import { UserCard } from "~/components/UserCard";

const FollowersPage: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ id }) => {
  const { data: profile } = api.profile.getFollowedBy.useQuery({ userId: id });

  if (profile == null || profile.name == null)
    return <ErrorPage statusCode={404} />;

  return (
    <>
      <Head>
        <title>{`People followed by ${profile.name}`}</title>
      </Head>
      <DetailHeader text={profile.name} />
      <main>
        {
          profile.follows.length === 0
          ? <h2 className="my-4 text-center text-2xl text-gray-500">No follows</h2>
          :         <ul>
          {profile.follows.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
          </ul>
        }
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
  await ssg.profile.getFollowedBy.prefetch({ userId: id });

  return {
    props: {
      id,
      trpcState: ssg.dehydrate(),
    },
  };
}

export default FollowersPage;
