import { z } from "zod";
import { protectedProcedure } from "../../trpc";

export const update = protectedProcedure
.input(
  z.object({
    userId: z.string(),
    bio: z.string().optional(),
    background: z
      .object({
        width: z.number(),
        height: z.number(),
        secureUrl: z.string(),
        alt: z.string().optional(),
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
        background: {
          disconnect: true,
        },
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
})
