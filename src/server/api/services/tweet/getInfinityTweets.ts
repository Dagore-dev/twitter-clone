import { type Prisma } from "@prisma/client";
import { type inferAsyncReturnType } from "@trpc/server";
import { type createTRPCContext } from "../../trpc";

export default async function getInfinityTweets({
  whereClause,
  limit,
  cursor,
  ctx,
}: {
  whereClause?: Prisma.TweetWhereInput;
  limit: number;
  cursor: { id: string; createdAt: Date } | undefined;
  ctx: inferAsyncReturnType<typeof createTRPCContext>;
}) {
  const currentUserId = ctx.session?.user.id;

  const tweets = await ctx.prisma.tweet.findMany({
    take: limit + 1,
    cursor: cursor ? { createdAt_id: cursor } : undefined,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    where: whereClause,
    select: {
      id: true,
      content: true,
      imageUrl: true,
      createdAt: true,
      _count: { select: { likes: true } },
      likes:
        currentUserId == null ? false : { where: { userId: currentUserId } },
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      image: {
        select: {
          width: true,
          height: true,
          secureUrl: true,
          alt: true,
        },
      },
    },
  });

  let nextCursor: typeof cursor | undefined;
  if (tweets.length > limit) {
    const nextTweet = tweets.pop();
    if (nextTweet != null) {
      nextCursor = {
        id: nextTweet.id,
        createdAt: nextTweet.createdAt,
      };
    }
  }

  return {
    nextCursor,
    tweets: tweets.map((tweet) => {
      return {
        id: tweet.id,
        content: tweet.content,
        imageUrl: tweet.imageUrl,
        createdAt: tweet.createdAt,
        likeCount: tweet._count.likes,
        user: tweet.user,
        image: tweet.image,
        likedByMe: tweet.likes?.length > 0,
      };
    }),
  };
}
