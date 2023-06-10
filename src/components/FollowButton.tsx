import { useSession } from "next-auth/react";
import { Button } from "./Button";

interface Props {
  isFollowing: boolean;
  onClick: () => void;
  isLoading: boolean;
}

export function FollowButton({ isFollowing, isLoading, onClick }: Props) {
  const session = useSession();

  if (session.status !== "authenticated") return null;

  return (
    <Button aria-label={isFollowing ? "Unfollow" : "Follow"} disabled={isLoading} onClick={onClick} small gray={isFollowing}>
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}
