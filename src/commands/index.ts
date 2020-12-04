import * as Conf from "conf";

import { readToken, saveToken } from "../utils/token";

import { Command } from "@oclif/command";
import CustomHelp from "../help";
import List from "./list";
import { Shortcut } from "./shortcuts/create";
import { cli } from "cli-ux";
import createHeader from "../components/create-header";
import createText from "../components/create-text";

import chalk = require("chalk");
const config = new Conf();

// console.log(`hello ${JSON.stringify(config.get("customCommand"), null, 2)}!`);

export default class TodoToday extends Command {
  static hidden = true;

  static args = [{ name: "shortcut" }];

  static description = "When run without options will return today";

  // TODO add default behavior here

  async run() {
    const token = readToken(this.config.configDir);
    // console.log(JSON.stringify(this.config.commands, null, 2));
    // console.log(JSON.stringify(this.config.plugins, null, 2));

    if (!token) {
      // TODO: use inquirer for more complex interaction
      this.log(
        [
          createHeader({ text: "Todo Today", color: "green" }),
          createText({ text: "We need to connect to your Todoist account." }),
          createText({
            text: `You can find this in Todoist under  ${chalk.yellow(
              "Settings -> Integrations -> API token"
            )}.`,
          }),
        ].join("")
      );

      const inputToken = await cli.prompt("Todoist Api Token");
      saveToken(inputToken, this.config.configDir);
    }

    const { args, flags } = this.parse(TodoToday);

    // TODO: we can use this pattern to have a saved command and pass its flags onward.
    // console.log(`hello ${JSON.stringify(config.get("customCommand"), null, 2)}!`);
    if (args.shortcut) {
      const shortcuts = config.get("shortcuts", []) as Shortcut[];

      const shortcut = shortcuts.find((s) => s.name === args.shortcut);
      if (args.shortcut) {
        if (shortcut?.command === "list") {
          await List.run(shortcut.flags.map((f) => "--" + f));
        }
      } else {
        this.log("Can't find shortcut");
      }
    } else {
      const h = new CustomHelp(this.config);

      // TODO extend help to show shortcuts & expose showRootHelp
      h.showRootHelp();
    }
  }
}
