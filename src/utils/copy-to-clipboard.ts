import * as clipboardy from "clipboardy";
import { log } from "console";
const stripAnsi = require("strip-ansi");

export default function (text: string) {
  clipboardy.writeSync(stripAnsi(text));
  log("✨ Copied to clipboard ✨ ");
}
