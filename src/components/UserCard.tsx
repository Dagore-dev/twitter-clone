import { type User } from "@prisma/client";
import Link from "next/link";
import { ProfileImage } from "./ProfileImage";
import { FollowButton } from "./FollowButton";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

export function UserCard({
  user,
}: {
  user: User & { followedByUser: boolean };
}) {
  const session = useSession();
  const toggleFollow = api.profile.toggleFollow.useMutation({
    onSuccess: () => (user.followedByUser = !user.followedByUser),
  });

  return (
    <li className="flex gap-4 border-b p-4">
      <Link href={`/profiles/${user.id}`}>
        <ProfileImage src={user.image} />
      </Link>

      <div className="flex flex-grow items-end justify-between">
        <div className="flex w-fit gap-1">
          <Link
            href={`/profiles/${user.id}`}
            className="font-bold outline-none hover:underline focus-visible:underline"
          >
            {user.name}
            <p className="font-normal">
              {user.bio.length === 0 ? "Welcome to my profile!" : user.bio}
            </p>
          </Link>
        </div>

        {session.status === "authenticated" && (
          <div>
            <FollowButton
              onClick={() => toggleFollow.mutate({ userId: user.id })}
              isLoading={false}
              isFollowing={user.followedByUser}
            />
          </div>
        )}
      </div>
    </li>
  );
}
