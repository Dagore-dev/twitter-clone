import { z } from "zod";
import { protectedProcedure } from "../../trpc";

export const create = protectedProcedure
  .input(
    z.object({
      content: z.string(),
      image: z
        .object({
          secureUrl: z.string(),
          width: z.number(),
          height: z.number(),
          alt: z.string().optional(),
        })
        .optional(),
    })
  )
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
              alt: true,
            },
          },
        },
      });
    }

    return await ctx.prisma.tweet.create({
      data: {
        content: input.content,
        user: {
          connect: {
            id: userId,
          },
        },
        image: {
          create: {
            width: input.image.width,
            height: input.image.height,
            secureUrl: input.image.secureUrl,
            alt: input.image.alt,
          },
        },
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
            alt: true,
          },
        },
      },
    });
  });
