import { createTRPCRouter } from "~/server/api/trpc";

import { create } from "../services/tweet/create";
import { infiniteFeed } from "../services/tweet/infiniteFeed";
import { infiniteProfileFeed } from "../services/tweet/infiniteProfileFeed";
import { toggleLike } from "../services/tweet/toggleLike";
import { getById } from "../services/tweet/getById";

export const tweetRouter = createTRPCRouter({
  create,
  infiniteFeed,
  infiniteProfileFeed,
  toggleLike,
  getById,
});
