import { z } from "zod";
import { protectedProcedure } from "../../trpc";

export const toggleLike = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ input: { id }, ctx }) => {
    const data = { tweetId: id, userId: ctx.session.user.id };
    const existingLike = await ctx.prisma.like.findUnique({
      where: { userId_tweetId: data },
    });
    const tweetAuthor = await ctx.prisma.tweet.findUnique({
      where: { id },
    });

    if (existingLike == null) {
      await ctx.prisma.like.create({ data });
      await ctx.prisma.notification.create({
        data: {
          type: "LIKE",
          tweet: {
            connect: { id },
          },
          notifier: {
            connect: { id: data.userId },
          },
          notified: {
            connect: { id: tweetAuthor?.userId },
          },
        },
      });
      return { addedLike: true };
    } else {
      await ctx.prisma.like.delete({ where: { userId_tweetId: data } });
      return { addedLike: false };
    }
  });
