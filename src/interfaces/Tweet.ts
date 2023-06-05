export default interface Tweet {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: Date;
  likeCount: number;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  image: {
    width: number;
    height: number;
    secureUrl: string;
    alt: string;
  } | null
  likedByMe: boolean;
}
