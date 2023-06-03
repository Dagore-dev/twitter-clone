import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const profileRouter = createTRPCRouter({
  getById: publicProcedure
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
            currentUserId == null
              ? undefined
              : { where: { id: currentUserId } },
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
    }),
  toggleFollow: protectedProcedure
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
    }),
  updateProfile: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        bio: z.string().optional(),
        background: z
          .object({
            width: z.number(),
            height: z.number(),
            secureUrl: z.string(),
          })
          .optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (input.bio == null && input.background == null) {
        return;
      }

      if (input.background == null) {
        await ctx.prisma.user.update({
          where: {
            id: input.userId,
          },
          data: {
            bio: input.bio,
          },
        });
      } else {
        if (input.bio == null) {
          await ctx.prisma.user.update({
            where: {
              id: input.userId,
            },
            data: {
              background: {
                create: {
                  secureUrl: input.background.secureUrl,
                  height: input.background.height,
                  width: input.background.width,
                },
              },
            },
          });
        } else {
          await ctx.prisma.user.update({
            where: {
              id: input.userId,
            },
            data: {
              bio: input.bio,
              background: {
                create: {
                  secureUrl: input.background.secureUrl,
                  height: input.background.height,
                  width: input.background.width,
                },
              },
            },
          });
        }
      }

      void ctx.revalidateSSG?.(`/profiles/${input.userId}`);
    }),
  getFollowersOf: publicProcedure
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
        followers: profile.followers.map((user) => ({
          ...user,
          followedByUser:
            currentUserId != null &&
            profile.follows.findIndex((u) => u.id === user.id) !== -1,
        })),
      };
    }),
  getFollowedBy: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input: { userId }, ctx }) => {
      const currentUserId = ctx.session?.user.id;
      const profile = await ctx.prisma.user.findUnique({
        where: { id: userId },
        select: {
          name: true,
          follows: true,
        },
      });

      if (profile == null) return;

      return {
        name: profile.name,
        follows: profile.follows.map((user) => ({
          ...user,
          followedByUser:
            currentUserId != null &&
            profile.follows.findIndex((u) => u.id === user.id) !== -1,
        })),
      };
    }),
});
