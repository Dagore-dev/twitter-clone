import Link from "next/link"
import type Tweet from "~/interfaces/Tweet"
import { ProfileImage } from "./ProfileImage"
import { dateTimeFormatter } from '../utils/dateTimeFormatter'
import { LikeButton } from "./LikeButton"

export function TweetCard ({ id, content, createdAt, likeCount, likedByMe, user }: Tweet) {
  return (
    <li className="flex gap-4 border-b p-4">
      <Link href={`/profiles/${user.id}`}>
        <ProfileImage src={user.image} />
      </Link>

      <div className="flex flex-grow flex-col ">
        <div className="flex gap-1">
          <Link
            href={`/profiles/${user.id}`}
            className="font-bold hover:underline focus-visible:underline outline-none"
          >
            {user.name}
          </Link>
          <span className="text-gray-400">-</span>
          <span className="text-gray-400">{dateTimeFormatter.format(createdAt)}</span>
        </div>

        <p className="whitespace-pre-wrap">{content}</p>

        <LikeButton likedByMe={likedByMe} likeCount={likeCount} />
      </div>
    </li>
  )
}
