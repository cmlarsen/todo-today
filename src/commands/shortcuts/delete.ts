import { Command, flags } from "@oclif/command";

import chalk = require("chalk");
import { Shortcuts } from "../../utils/shortcut";

export default class ShortcutsDelete extends Command {
  static description = "Deletes a shortcut";

  static flags = {
    help: flags.help({ char: "h" }),
  };

  static args = [{ name: "shortcut-name" }];

  async run() {
    const { args } = this.parse(ShortcutsDelete);
    const removed = Shortcuts.remove(args["shortcut-name"]);
    if (removed) {
      this.log(chalk.red.bold(`Shortcut ${args["shortcut-name"]} deleted.`));
    } else {
      this.log("No shortcut found to delete");
    }
  }
}
