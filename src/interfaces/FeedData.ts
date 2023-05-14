import { type InfiniteData } from "@tanstack/react-query";

export type FeedData = InfiniteData<{
  nextCursor: {
      id: string;
      createdAt: Date;
  } | undefined;
  tweets: {
      id: string;
      content: string;
      createdAt: Date;
      likeCount: number;
      user: {
          id: string;
          name: string | null;
          image: string | null;
      };
      likedByMe: boolean;
  }[];
}> | undefined
