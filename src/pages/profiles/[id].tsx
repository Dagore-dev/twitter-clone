interface Props {
  id: string
}

export default function ProfilePage({ id }: Props) {
  return (
    <h1>{id}</h1>
  )
}
