import chalk = require("chalk");
import { Color } from "../definitions/colors";

interface Props {
  text: string;
  color?: Color;
  bold?: boolean;
}

export default function createText({ text, color, bold }: Props) {
  if (bold) {
    return chalk[color ?? "white"].bold(text) + "\n";
  }
  return chalk[color ?? "white"](text) + "\n";
}
