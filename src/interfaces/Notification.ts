import { type Image } from "@prisma/client";

export default interface Notification {
  tweet: {
    id: string;
    image: Image | null;
    content: string;
  };
  notifier: {
    image: string | null;
    id: string;
    name: string | null;
  };
  id: string;
  createdAt: Date;
  read: boolean;
}
