export default interface Tweet {
  id: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  likeCount: number;
  likedByMe: boolean;
  user: { id: string; image: string | null; name: string | null };
}
