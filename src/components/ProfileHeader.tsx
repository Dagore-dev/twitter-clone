import { type Image as ImageType } from "@prisma/client";
import { ProfileImage } from "./ProfileImage";
import { getPlural } from "~/utils/getPlural";
import { FollowButton } from "./FollowButton";
import { api } from "~/utils/api";
import { DetailHeader } from "./DetailHeader";
import Image from "next/image";
import { EditProfileButton } from "./EditProfileButton";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Anchorme } from "react-anchorme";
import { AnchormeLink } from "./AnchormeLink";

export function ProfileHeader({
  id,
  profile,
}: {
  id: string;
  profile: {
    name: string | null;
    image: string | null;
    bio: string;
    background: ImageType | null;
    followersCount: number;
    followsCount: number;
    tweetsCount: number;
    isFollowing: boolean;
  };
}) {
  const session = useSession();
  const trpcUtils = api.useContext();
  const toggleFollow = api.profile.toggleFollow.useMutation({
    onSuccess: ({ addedFollow }) => {
      trpcUtils.profile.getById.setData({ id }, (oldData) => {
        if (oldData == null) return;

        const countModifier = addedFollow ? 1 : -1;
        return {
          ...oldData,
          isFollowing: addedFollow,
          followersCount: oldData.followersCount + countModifier,
        };
      });
    },
  });

  return (
    <div className="sticky top-0 z-10 bg-white">
      <DetailHeader
        text={profile.name ?? ""}
        sub={`${profile.tweetsCount} ${getPlural(
          profile.tweetsCount,
          "Tweet",
          "Tweets"
        )}`}
        isNested={true}
      />
      <div className="h-[110px] md:h-[200px]">
        {profile.background == null ? (
          <Image
            className="max-h-full"
            width={1920}
            height={1200}
            alt="background"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src="https://res.cloudinary.com/dmhvmoqu2/image/upload/v1684694355/tweets/ahrsbbel0zllalpx7az4.jpg"
          />
        ) : (
          <Image
            className="max-h-full"
            width={profile.background.width}
            height={profile.background.height}
            alt="background"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={profile.background.secureUrl}
          />
        )}
      </div>
      <header className="border-b px-4 py-2">
        <ProfileImage
          src={profile.image}
          className="-mt-8 md:-mt-[89px] md:h-[133.5px] md:w-[133.5px]"
        />
        <div className="flex items-center">
          <div className="ml-2 flex-grow">
            <h1 className="text-lg font-bold">{profile?.name}</h1>
            <div>
              <p className="relative break-words">
                {profile.bio.length === 0 ? (
                  "Welcome to my profile!"
                ) : (
                  <Anchorme
                    target="_blank"
                    rel="noreferrer noopener"
                    linkComponent={AnchormeLink}
                  >
                    {profile.bio}
                  </Anchorme>
                )}
              </p>
              <span className="text-gray-500">
                <Link href={`/profiles/followers/${id}`}>
                  {profile.followersCount}{" "}
                  {getPlural(profile.followersCount, "Follower", "Followers")}
                </Link>
                <Link href={`/profiles/following/${id}`}>
                  {" "}
                  - {profile.followsCount} Following
                </Link>
              </span>
            </div>
          </div>
          {session.data?.user.id !== id && (
            <FollowButton
              onClick={() => toggleFollow.mutate({ userId: id })}
              isLoading={toggleFollow.isLoading}
              isFollowing={profile.isFollowing}
            />
          )}
          <EditProfileButton userId={id} />
        </div>
      </header>
    </div>
  );
}
