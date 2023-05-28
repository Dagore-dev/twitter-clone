import { useSession } from "next-auth/react";
import { Button } from "./Button";
import { useRouter } from "next/router";

export function EditProfileButton({ userId }: { userId: string }) {
  const session = useSession();
  const router = useRouter();

  if (session.status !== "authenticated") return null;

  return (
    <Button onClick={() => void router.push(`/profiles/edit/${userId}`)} small>
      Edit profile
    </Button>
  );
}
