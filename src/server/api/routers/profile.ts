import { createTRPCRouter } from "../trpc";
import { getById } from "../services/profile/getById";
import { toggleFollow } from "../services/profile/toggleFollow";
import { update } from "../services/profile/update";
import { getFollowersOf } from "../services/profile/getFollowersOf";
import { getFollowedBy } from "../services/profile/getFollowedBy";

export const profileRouter = createTRPCRouter({
  getById,
  toggleFollow,
  updateProfile: update,
  getFollowersOf,
  getFollowedBy,
});
