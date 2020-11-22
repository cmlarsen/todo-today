import { Color } from "../definitions/colors";
import createText from "./create-text";

interface Props {
  text: string;
  color: Color;
}
export default function createHeader({ text, color }: Props) {
  return createText({ text, color, bold: true });
}
