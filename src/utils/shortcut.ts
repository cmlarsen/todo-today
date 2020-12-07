import * as Conf from "conf";
import { Shortcut } from "../commands/shortcuts/create";
const config = new Conf({ projectName: "todo-today-1" });

function set(shortcuts: Shortcut[]) {
  return config.set("shortcuts", shortcuts);
}
function get() {
  return config.get("shortcuts", []) as Shortcut[];
}
function remove(shortcutName: string) {
  const shortcuts = get();
  const shortcutIndex = shortcuts.findIndex((s) => s.name === shortcutName);
  if (shortcutIndex > -1) {
    shortcuts.splice(shortcutIndex, 1);
    set(shortcuts);
    return true;
  }
  return false;
}
export const Shortcuts = { set, get, remove };
