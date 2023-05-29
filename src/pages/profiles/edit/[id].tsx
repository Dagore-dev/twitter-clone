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
import { EditProfileForm } from "~/components/EditProfileForm";
import { useSession } from "next-auth/react";

const EditProfilePage: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ id }) => {
  // No loading state since we made this query on getStaticProps
  const { data: profile } = api.profile.getById.useQuery({ id });
  const session = useSession()

  if (profile == null || profile.name == null)
    return <ErrorPage statusCode={404} />;

  if (session.status !== 'authenticated' || session.data.user.id !== id) {
    return <ErrorPage statusCode={401} />
  }

  return (
    <>
      <Head>
        <title>{`Twitter clone / ${profile.name}`}</title>
      </Head>
      <DetailHeader text="Edit profile" />
      <main>
        <EditProfileForm background={profile.background} bio={profile.bio} />
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

export default EditProfilePage;
