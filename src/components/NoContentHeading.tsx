import { type ReactNode } from "react";

export function NoContentHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="my-4 text-center text-2xl text-gray-500">{children}</h2>
  );
}
