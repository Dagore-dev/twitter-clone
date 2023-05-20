import { type DetailedHTMLProps, type LabelHTMLAttributes } from "react";
import { BsImage } from "react-icons/bs";

export function ImageInput(
  props: DetailedHTMLProps<
    LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  >
) {
  return (
    <label {...props}>
      <input
        type="file"
        name="img"
        id="img"
        className="hidden"
        accept="image/*"
      />
      <BsImage className="h-6 w-6 cursor-pointer fill-blue-400" />
    </label>
  );
}
