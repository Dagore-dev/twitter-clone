import Image from "next/image"

interface Props {
  src?: string | null
  className?: string
}

export function ProfileImage ({ src, className = '' }: Props) {
  return (
    <div className={`relative h-12 w-12 overflow-hidden rounded-full ${className}`}>
      {
        src == null
        ? null
        : <Image src={src} alt="Profile image" quality={100} fill />
      }
    </div>
  )
}
