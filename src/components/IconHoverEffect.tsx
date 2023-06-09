import { type ReactNode } from "react";

interface Props {
  children: ReactNode;
  red: boolean;
}

export function IconHoverEffect({ children, red = false }: Props) {
  const colorClasses = red
    ? "outline-red-400 md:hover:bg-red-200 md:group-hover:bg-red-200 md:focus-visible:bg-red-200 md:group-focus-visible:bg-red-200"
    : "outline-gray-400 md:hover:bg-gray-200 md:group-hover:bg-gray-200 md:focus-visible:bg-gray-200 md:group-focus-visible:bg-gray-200";

  return (
    <div
      className={`rounded-full p-2 md:transition-colors md:duration-200 ${colorClasses}`}
    >
      {children}
    </div>
  );
}
