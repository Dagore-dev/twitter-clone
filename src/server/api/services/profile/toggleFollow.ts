import { z } from "zod";
import { protectedProcedure } from "../../trpc";

export const toggleFollow = protectedProcedure
  .input(z.object({ userId: z.string() }))
  .mutation(async ({ input: { userId }, ctx }) => {
    const currentUserId = ctx.session.user.id;
    const existingFollow = await ctx.prisma.user.findFirst({
      where: { id: userId, followers: { some: { id: currentUserId } } },
    });
    let addedFollow;

    if (existingFollow == null) {
      await ctx.prisma.user.update({
        where: { id: userId },
        data: { followers: { connect: { id: currentUserId } } },
      });
      addedFollow = true;
    } else {
      await ctx.prisma.user.update({
        where: { id: userId },
        data: { followers: { disconnect: { id: currentUserId } } },
      });
      addedFollow = false;
    }

    void ctx.revalidateSSG?.(`/profiles/${userId}`);
    void ctx.revalidateSSG?.(`/profiles/${currentUserId}`);

    return {
      addedFollow,
    };
  });
