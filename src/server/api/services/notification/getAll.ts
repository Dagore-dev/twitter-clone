import { z } from "zod";
import { protectedProcedure } from "../../trpc";

export const getAll = protectedProcedure
.input(z.object({
  limit: z.number().optional(),
  cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
}))
.query(async ({ input: { limit = 10, cursor }, ctx }) => {
  const currentUserId = ctx.session.user.id
  const notifications = await ctx.prisma.notification.findMany({
    where: { notifiedId: currentUserId },
    take: limit + 1,
    cursor: cursor ? { createdAt_id: cursor } : undefined,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    select: {
      id: true,
      read: true,
      createdAt: true,
      tweet: {
        select: {
          content: true,
          image: true
        }
      },
      notifier: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    }
  });

  let nextCursor: typeof cursor | undefined;
  if (notifications.length > limit) {
    const nextNotification = notifications.pop();
    if (nextNotification != null) {
      nextCursor = {
        id: nextNotification.id,
        createdAt: nextNotification.createdAt
      }
    }
  }

  return {
    nextCursor,
    notifications
  }
})
