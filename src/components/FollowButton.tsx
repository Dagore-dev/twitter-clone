import { useSession } from "next-auth/react";
import { Button } from "./Button";

interface Props {
  userId: string;
  isFollowing: boolean;
  onClick: () => void;
  isLoading: boolean;
}

export function FollowButton({
  userId,
  isFollowing,
  isLoading,
  onClick,
}: Props) {
  const session = useSession();

  if (session.status !== "authenticated" || session.data.user.id === userId)
    return null;

  return (
    <Button disabled={isLoading} onClick={onClick} small gray={isFollowing}>
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}
