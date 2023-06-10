import { IconHoverEffect } from "./IconHoverEffect";
import { VscArrowLeft } from "react-icons/vsc";
import { useRouter } from "next/router";

export function DetailHeader({
  text,
  sub,
  isNested = false,
}: {
  text: string;
  sub?: string;
  isNested?: boolean;
}) {
  const router = useRouter();
  const sharedClasses = "flex items-center border-b bg-white px-4 py-2";
  const content = (
    <>
      <button aria-label="Back" onClick={() => router.back()} className="mr-2">
        <IconHoverEffect red={false}>
          <VscArrowLeft className="h-6 w-6" />
        </IconHoverEffect>
      </button>
      <div className="ml-2 flex-grow">
        <h1 className="text-lg font-bold">{text}</h1>
        {sub && <small className="text-sm text-gray-500">{sub}</small>}
      </div>
    </>
  );

  if (isNested) {
    return <div className={sharedClasses}>{content}</div>;
  }

  return (
    <header className={`sticky top-0 z-10 ${sharedClasses}`}>{content}</header>
  );
}
