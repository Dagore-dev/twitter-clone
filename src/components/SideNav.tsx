import { signIn, signOut, useSession } from "next-auth/react";
import { IconHoverEffect } from "./IconHoverEffect";
import { VscAccount, VscBell, VscHome, VscSignIn, VscSignOut } from "react-icons/vsc";
import { SideNavItem } from "./SideNavItem";

export function SideNav() {
  const session = useSession();
  const user = session.data?.user;

  return (
    <nav className="fixed bottom-0 z-10 w-full bg-white px-2 py-1 md:sticky md:top-0 md:w-auto md:py-4">
      <ul className="flex items-start justify-evenly gap-2 whitespace-nowrap md:flex-col">
        <SideNavItem
          href="/"
          Icon={VscHome}
          name="Home"
        />
        {user != null && (
          <>
            <SideNavItem
              href={`/profiles/${user.id}`}
              Icon={VscAccount}
              name="Profile"
            />

            <SideNavItem
              href={`/notifications`}
              Icon={VscBell}
              name="Notifications"
            />
          </>
        )}
        {user != null ? (
          <li>
            <button onClick={() => void signOut()}>
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
            <button onClick={() => void signIn()}>
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
      </ul>
    </nav>
  );
}
