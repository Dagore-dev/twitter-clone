import {
  type GetStaticPaths,
  type GetStaticPropsContext,
  type InferGetStaticPropsType,
  type NextPage,
} from "next";
import Head from "next/head";
import { ssgHelper } from "~/server/api/ssgHelper";
import { api } from "~/utils/api";
import ErrorPage from "next/error";
import { DetailHeader } from "~/components/DetailHeader";

const EditProfilePage: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ id }) => {
  // No loading state since we made this query on getStaticProps
  const { data: profile } = api.profile.getById.useQuery({ id });

  if (profile == null || profile.name == null)
    return <ErrorPage statusCode={404} />;

  return (
    <>
      <Head>
        <title>{`Twitter clone / ${profile.name}`}</title>
      </Head>
      <DetailHeader text="Edit profile" />
      <main></main>
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

export default EditProfilePage;
