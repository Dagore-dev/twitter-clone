import { useSession } from "next-auth/react";
import { VscAccount, VscBell, VscHome } from "react-icons/vsc";
import { SideNavItem } from "./SideNavItem";
import { SingInOut } from "./SingInOut";

export function SideNav() {
  const session = useSession();
  const user = session.data?.user;

  return (
    <nav className="fixed bottom-0 z-10 w-full bg-white px-2 py-1 md:sticky md:top-0 md:w-auto md:py-4">
      <ul className="flex items-start justify-evenly gap-2 whitespace-nowrap md:flex-col">
        <SideNavItem href="/" Icon={VscHome} name="Home" />
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
        <SingInOut />
      </ul>
    </nav>
  );
}
