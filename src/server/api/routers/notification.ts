import { getAll } from "../services/notification/getAll";
import { createTRPCRouter } from "../trpc";

export const notificationRouter = createTRPCRouter({
  getAll
});
