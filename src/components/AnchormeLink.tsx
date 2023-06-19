import { type LinkComponentProps } from "react-anchorme";

export function AnchormeLink(props: LinkComponentProps) {
  return <a className="text-blue-600 underline" {...props}></a>;
}
