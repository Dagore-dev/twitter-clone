import { z } from "zod";
import { publicProcedure } from "../../trpc";

export const getById = publicProcedure
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
  });
