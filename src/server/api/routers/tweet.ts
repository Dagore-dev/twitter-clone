import { type Prisma } from "@prisma/client";
import { type inferAsyncReturnType } from "@trpc/server";
import { z } from "zod";

import {
  type createTRPCContext,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const tweetRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ content: z.string(), image: z.object({ secureUrl: z.string(), width: z.number(), height: z.number(), alt: z.string().optional() }).optional() }))
    .mutation(async ({ input, ctx }) => {
      void ctx.revalidateSSG?.(`/profiles/${ctx.session.user.id}`);
      const userId = ctx.session.user.id;

      if (input.image == null) {
        return await ctx.prisma.tweet.create({
          data: { content: input.content, userId },
          select: {
            id: true,
            content: true,
            imageUrl: true,
            createdAt: true,
            image: {
              select: {
                width: true,
                height: true,
                secureUrl: true,
                alt: true
              }
            }
          }
        });
      }

      return await ctx.prisma.tweet.create({
        data: {
          content: input.content,
          user: { connect: {
            id: userId
          } },
          image: {
            create: {
              width: input.image.width,
              height: input.image.height,
              secureUrl: input.image.secureUrl,
              alt: input.image.alt
            }
          }
        },
        select: {
          id: true,
          content: true,
          imageUrl: true,
          createdAt: true,
          image: {
            select: {
              width: true,
              height: true,
              secureUrl: true,
              alt: true
            }
          }
        }
      })
    }),
  infiniteFeed: publicProcedure
    .input(
      z.object({
        onlyFollowing: z.boolean().optional(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(
      async ({ input: { onlyFollowing = false, limit = 10, cursor }, ctx }) => {
        const currentUserId = ctx.session?.user.id;
        return await getInfinityTweets({
          limit,
          cursor,
          ctx,
          whereClause:
            currentUserId == null || !onlyFollowing
              ? undefined
              : { user: { followers: { some: { id: currentUserId } } } },
        });
      }
    ),
  infiniteProfileFeed: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(async ({ input: { userId, limit = 10, cursor }, ctx }) => {
      return await getInfinityTweets({
        limit,
        cursor,
        ctx,
        whereClause: { userId },
      });
    }),
  toggleLike: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {
      const data = { tweetId: id, userId: ctx.session.user.id };
      const existingLike = await ctx.prisma.like.findUnique({
        where: { userId_tweetId: data },
      });

      if (existingLike == null) {
        await ctx.prisma.like.create({ data });
        return { addedLike: true };
      } else {
        await ctx.prisma.like.delete({ where: { userId_tweetId: data } });
        return { addedLike: false };
      }
    }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      const currentUserId = ctx.session?.user.id;
      const tweet = await ctx.prisma.tweet.findUnique({
        where: { id },
        select: {
          id: true,
          content: true,
          imageUrl: true,
          createdAt: true,
          _count: { select: { likes: true } },
          likes:
            currentUserId == null
              ? false
              : { where: { userId: currentUserId } },
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
              alt: true
            }
          }
        },
      });
      if (tweet == null) return;

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
});

async function getInfinityTweets({
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
          alt: true
        }
      }
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
