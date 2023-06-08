import { z } from "zod";
import { publicProcedure } from "../../trpc";
import getInfinityTweets from "./getInfinityTweets";

export const infiniteProfileFeed = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      limit: z.number().optional(),
      cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
    })
  )
  .query(async ({ input: { userId, limit = 10, cursor }, ctx }) => {
    return await getInfinityTweets({
      limit,
      cursor,
      ctx,
      whereClause: { userId },
    });
  });
