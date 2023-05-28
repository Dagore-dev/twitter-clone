import Link from "next/link";
import { type ReactNode } from "react";

export function LinkOverlay({
  href,
  children,
  isDetail = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  isDetail: boolean;
  className?: string;
}) {
  if (isDetail) {
    return <div className={className}>{children}</div>;
  }

  return (
    <>
      <style>
        {`
          .outer {
            position:relative;
          }
          
          .outer .overlay {
            position:absolute;
            left:0; top:0; bottom:0; right:0;
          }
          
          .outer .inner {
            position:relative;
            pointer-events: none;
            z-index: 1;
          }
          
          .outer .inner a {
            pointer-events: all;
          }
        `}
      </style>
      <div className={`outer ${className}`}>
        <Link href={href} className="overlay"></Link>
        <div className="inner">{children}</div>
      </div>
    </>
  );
}
