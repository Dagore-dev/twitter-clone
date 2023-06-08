import { z } from "zod";
import { publicProcedure } from "../../trpc";

export const getById = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input: { id }, ctx }) => {
    const currentUserId = ctx.session?.user.id;
    const profile = await ctx.prisma.user.findUnique({
      where: { id },
      select: {
        name: true,
        image: true,
        bio: true,
        background: true,
        _count: { select: { followers: true, follows: true, tweets: true } },
        followers:
          currentUserId == null ? undefined : { where: { id: currentUserId } },
      },
    });

    if (profile == null) return;

    return {
      name: profile.name,
      image: profile.image,
      bio: profile.bio,
      background: profile.background,
      followersCount: profile._count.followers,
      followsCount: profile._count.follows,
      tweetsCount: profile._count.tweets,
      isFollowing: profile.followers.length > 0,
    };
  });
