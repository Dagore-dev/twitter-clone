import Link from "next/link";
import { IconHoverEffect } from "./IconHoverEffect";
import { type IconType } from "react-icons/lib";

export function SideNavItem({
  href,
  Icon,
  name,
}: {
  href: string;
  Icon: IconType;
  name: string;
}) {
  return (
    <li>
      <Link href={href}>
        <IconHoverEffect red={false}>
          <span className="flex items-center gap-4">
            <Icon className="h-8 w-8" />
            <span className="hidden text-lg md:inline">{name}</span>
          </span>
        </IconHoverEffect>
      </Link>
    </li>
  );
}
