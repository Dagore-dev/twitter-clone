import { type Image as ImageType } from "@prisma/client";
import { ProfileImage } from "./ProfileImage";
import { getPlural } from "~/utils/getPlural";
import { FollowButton } from "./FollowButton";
import { api } from "~/utils/api";
import { DetailHeader } from "./DetailHeader";
import Image from "next/image";
import { EditProfileButton } from "./EditProfileButton";

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
            src="https://res.cloudinary.com/dmhvmoqu2/image/upload/v1684694355/tweets/ahrsbbel0zllalpx7az4.jpg"
          />
        ) : (
          <Image
            className="max-h-full"
            width={profile.background.width}
            height={profile.background.height}
            alt="background"
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
              <p className="relative">
                {profile.bio.length === 0
                  ? "Welcome to my profile!"
                  : profile.bio}
              </p>
              <span className="text-gray-500">
                {profile.followersCount}{" "}
                {getPlural(profile.followersCount, "Follower", "Followers")} -{" "}
                {profile.followsCount} Following
              </span>
            </div>
          </div>
          <FollowButton
            userId={id}
            onClick={() => toggleFollow.mutate({ userId: id })}
            isLoading={toggleFollow.isLoading}
            isFollowing={profile.isFollowing}
          />
          <EditProfileButton userId={id} />
        </div>
      </header>
    </div>
  );
}
