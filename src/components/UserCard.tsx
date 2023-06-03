import { type User } from "@prisma/client";

export function UserCard({ user }: { user: User }) {
  return <li>{user.name}</li>;
}
