import { useSession } from "next-auth/react";
import { Button } from "./Button";
import { useRouter } from "next/router";

export function EditProfileButton({ userId }: { userId: string }) {
  const session = useSession();
  const router = useRouter();

  if (session.status !== "authenticated" || session.data.user.id !== userId)
    return null;

  return (
    <Button
      aria-label="Edit profile"
      onClick={() => void router.push(`/profiles/edit/${userId}`)}
      small
      className="min-w-fit"
    >
      Edit profile
    </Button>
  );
}
