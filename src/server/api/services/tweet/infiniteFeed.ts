import { z } from "zod";
import { publicProcedure } from "../../trpc";
import getInfinityTweets from "./getInfinityTweets";

export const infiniteFeed = publicProcedure
  .input(
    z.object({
      onlyFollowing: z.boolean().optional(),
      limit: z.number().optional(),
      cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
    })
  )
  .query(
    async ({ input: { onlyFollowing = false, limit = 10, cursor }, ctx }) => {
      const currentUserId = ctx.session?.user.id;
      return await getInfinityTweets({
        limit,
        cursor,
        ctx,
        whereClause:
          currentUserId == null || !onlyFollowing
            ? undefined
            : { user: { followers: { some: { id: currentUserId } } } },
      });
    }
  );
