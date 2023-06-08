import { z } from "zod";
import { protectedProcedure } from "../../trpc";

export const toggleLike = protectedProcedure
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
})
