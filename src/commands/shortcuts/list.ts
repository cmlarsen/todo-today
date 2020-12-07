import { Command, flags } from "@oclif/command";

import chalk = require("chalk");
import { Shortcuts } from "../../utils/shortcut";

export default class ListShortcuts extends Command {
  static description = `Lists shortcuts`;

  static aliases = ["shortcut:list"];

  static flags = {
    help: flags.help({ char: "h" }),
  };

  async run() {
    const shortcuts = Shortcuts.get();
    let output = "";
    const shortcutList = shortcuts
      .map((shortcut) => {
        return chalk.yellow.bold(
          shortcut.name +
            ": " +
            shortcut.command +
            " " +
            shortcut.flags.join(" --")
        );
      })
      .join("\n");

    if (shortcutList) {
      output += "Your shortcuts:\n";
      output += shortcutList;
    } else {
      output =
        "No shortcuts found.  You can create one with " +
        chalk.yellow.bold("todo-today shortcuts:create");
    }
    this.log(output);
  }
}
