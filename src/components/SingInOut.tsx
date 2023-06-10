import { signIn, signOut, useSession } from "next-auth/react";
import { IconHoverEffect } from "./IconHoverEffect";
import { VscSignIn, VscSignOut } from "react-icons/vsc";

export function SingInOut() {
  const session = useSession();
  const user = session.data?.user;

  return (
    <>
      {user != null ? (
        <li>
          <button aria-label="Sign out" onClick={() => void signOut()}>
            <IconHoverEffect red>
              <span className="flex items-center gap-4">
                <VscSignOut className="h-8 w-8 fill-red-700" />
                <span className="hidden text-lg text-red-700 md:inline">
                  Logout
                </span>
              </span>
            </IconHoverEffect>
          </button>
        </li>
      ) : (
        <li>
          <button aria-label="Sign in" onClick={() => void signIn()}>
            <IconHoverEffect red={false}>
              <span className="flex items-center gap-4">
                <VscSignIn className="h-8 w-8 fill-green-700" />
                <span className="hidden text-lg text-green-700 md:inline">
                  Login
                </span>
              </span>
            </IconHoverEffect>
          </button>
        </li>
      )}
    </>
  );
}
