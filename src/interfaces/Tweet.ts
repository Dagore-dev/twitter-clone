export default interface Tweet {
  id: string
  content: string
  createdAt: Date
  likeCount: number
  likedByMe: boolean
  user: { id: string, image: string | null, name: string | null }
}
