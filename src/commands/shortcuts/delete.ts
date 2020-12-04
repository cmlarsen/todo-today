import * as Conf from "conf";

import { Command, flags } from "@oclif/command";

import { Shortcut } from "./create";
import chalk = require("chalk");

const config = new Conf();

export default class ShortcutsDelete extends Command {
  static description = "Deletes a shortcut";

  static flags = {
    help: flags.help({ char: "h" }),
  };

  static args = [{ name: "shortcut-name" }];

  async run() {
    const { args } = this.parse(ShortcutsDelete);
    const shortcuts = config.get("shortcuts", []) as Shortcut[];
    const shortcutIndex = shortcuts.findIndex(
      (s) => s.name === args["shortcut-name"]
    );
    if (shortcutIndex > -1) {
      this.log(chalk.red.bold(`Shortcut ${args["shortcut-name"]} deleted.`));
      shortcuts.splice(shortcutIndex, 1);
      config.set("shortcuts", shortcuts);
    } else {
      this.log("No shortcut found to delete");
    }
  }
}
