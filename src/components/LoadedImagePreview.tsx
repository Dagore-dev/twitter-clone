import { type Dispatch, type SetStateAction } from "react";
import { VscChromeClose } from "react-icons/vsc";

export function LoadedImagePreview({
  imageSrc,
  setImageSrc,
  loading,
  className,
}: {
  imageSrc: string;
  setImageSrc: Dispatch<SetStateAction<string | undefined>>;
  loading: boolean;
  className?: string;
}) {
  return (
    <div className={`mt-8 max-w-[250px] md:max-w-xs ${className ?? ""}`}>
      {!loading && (
        <VscChromeClose
          className="-m-8 h-8 w-8 cursor-pointer"
          onClick={() => {
            const fileInput = document.getElementById(
              "img"
            ) as HTMLInputElement;
            fileInput.value = "";
            setImageSrc(undefined);
          }}
        />
      )}
      <img className="max-w-full" src={imageSrc} alt="upload candidate" />
      <div className="m-3">
        <label htmlFor="altText" className="hidden">
          Image alternative text
        </label>
        <input
          type="text"
          id="altText"
          name="altText"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          placeholder="Alternative text"
          readOnly={loading}
        />
      </div>
    </div>
  );
}
