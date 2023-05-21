import { type Dispatch, type SetStateAction } from "react";
import { VscChromeClose } from "react-icons/vsc";

export function LoadedImagePreview({
  imageSrc,
  setImageSrc,
  className,
}: {
  imageSrc: string;
  setImageSrc: Dispatch<SetStateAction<string | undefined>>;
  className?: string;
}) {
  return (
    <div className={`mt-8 max-w-[250px] md:max-w-xs ${className ?? ""}`}>
      <VscChromeClose
        className="-m-8 h-8 w-8 cursor-pointer"
        onClick={() => {
          const fileInput = document.getElementById("img") as HTMLInputElement;
          fileInput.value = null;
          setImageSrc(undefined);
        }}
      />
      <img className="max-w-full" src={imageSrc} alt="upload candidate" />
    </div>
  );
}
