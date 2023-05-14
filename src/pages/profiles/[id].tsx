import { type GetStaticPaths, type GetStaticPropsContext, type InferGetStaticPropsType, type NextPage } from "next"
import Head from "next/head"
import { ssgHelper } from "~/server/api/ssgHelper"
import { api } from "~/utils/api"
import ErrorPage from 'next/error'
import Link from "next/link"
import { IconHoverEffect } from "~/components/IconHoverEffect"
import { VscArrowLeft } from "react-icons/vsc"
import { ProfileImage } from "~/components/ProfileImage"
import { getPlural } from "~/utils/getPlural"
import { FollowButton } from "~/components/FollowButton"
import { InfiniteTweetList } from "~/components/InfiniteTweetList"

const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ id }) => {
  // No loading state since we made this query on getStaticProps
  const { data: profile } = api.profile.getById.useQuery({ id })
  const tweetsQuery = api.tweet.infiniteProfileFeed.useInfiniteQuery({ userId: id }, {
    getNextPageParam: lastPage => lastPage.nextCursor
  })
  
  if (profile == null || profile.name == null) return <ErrorPage statusCode={404} />

  return (
    <>
      <Head>
        <title>{`Twitter clone / ${profile.name}`}</title>
      </Head>
      <header className="sticky top-0 z-10 flex items-center border-b bg-white px-4 py-2">
        <Link href=".." className="mr-2">
          <IconHoverEffect red={false}>
            <VscArrowLeft className="w-6 h-6" />
          </IconHoverEffect>
        </Link>
        <ProfileImage src={profile.image} className="flex-shrink-0" />
        <div className="ml-2 flex-grow">
          <h1 className="text-lg font-bold">{profile.name}</h1>
          <div className="text-gray-500">
            {profile.tweetsCount}{' '}
            {getPlural(profile.tweetsCount, 'Tweet', 'Tweets')} -{' '}

            {profile.followersCount}{' '}
            {getPlural(profile.followersCount, 'Follower', 'Followers')} -{' '}

            {profile.followsCount}
            {' '}
            Following
          </div>
        </div>
        <FollowButton
          userId={id}
          onClick={() => console.log('click')}
          isFollowing={profile.isFollowing}
        />
      </header>
      <main>
        <InfiniteTweetList
          tweets={tweetsQuery.data?.pages.flatMap(page => page.tweets)}
          isError={tweetsQuery.isError}
          isLoading={tweetsQuery.isLoading}
          hasMore={tweetsQuery.hasNextPage ?? false}
          fetchNewTweets={tweetsQuery.fetchNextPage}
        />
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export async function getStaticProps (context: GetStaticPropsContext<{ id: string }>) {
  const id = context.params?.id
  if (id == null) {
    return {
      redirect: {
        destination: '/'
      }
    }
  }

  const ssg = ssgHelper()
  await ssg.profile.getById.prefetch({ id })

  return {
    props: {
      id,
      trpcState: ssg.dehydrate()
    }
  }
}

export default ProfilePage
