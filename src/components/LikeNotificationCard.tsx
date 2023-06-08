import { VscHeartFilled } from "react-icons/vsc"
import type Notification from "~/interfaces/Notification"
import { ProfileImage } from "./ProfileImage"
import Link from "next/link"
import { LinkOverlay } from "./LinkOverlay"

export function LikeNotificationCard ({
  notifier,
  read,
  tweet
}: Notification) {
  return (
    <li>
      <LinkOverlay href={`/tweets/${tweet.id}`} isDetail={false} >
        <div className="flex">
          <VscHeartFilled className="fill-red-500 w-9 h-9 m-3" />
          <div className="flex flex-col">
            <Link href={`/profiles/${notifier.id}`}>
              <ProfileImage src={notifier.image} className="w-9 h-9 m-3" />
            </Link>
            <p className="mx-3">
              <Link href={`/profiles/${notifier.id}`}><strong className="hover:underline">{notifier.name}</strong></Link> liked your tweet
            </p>
            <p className="mx-3 font-light text-gray-500">
              {tweet.content} {tweet.image?.secureUrl.substring(8)}
            </p>
          </div>
        </div>
      </LinkOverlay>
    </li>
  )
}
