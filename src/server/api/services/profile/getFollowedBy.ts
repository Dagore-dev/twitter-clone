import { z } from "zod";
import { publicProcedure } from "../../trpc";

export const getFollowedBy = publicProcedure
.input(z.object({ userId: z.string() }))
.query(async ({ input: { userId }, ctx }) => {
  const currentUserId = ctx.session?.user.id;
  const profile = await ctx.prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      followers: true,
      follows: true,
    },
  });

  if (profile == null) return;

  return {
    name: profile.name,
    follows: await Promise.all(
      profile.follows.map(async (user) => ({
        ...user,
        followedByUser:
          currentUserId != null &&
          (await ctx.prisma.user.findFirst({
            where: {
              id: user.id,
              followers: { some: { id: currentUserId } },
            },
          })) != null,
      }))
    ),
  };
})
