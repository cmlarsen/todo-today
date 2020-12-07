import * as inquirer from "inquirer";

import { Command, flags } from "@oclif/command";

import List from "../list";
import { cli } from "cli-ux";
import createText from "../../components/create-text";
import log from "../../utils/log";

import chalk = require("chalk");
import { Shortcuts } from "../../utils/shortcut";

export interface Shortcut {
  name: string;
  command: string;
  flags: string[];
}
export default class CreateShortcut extends Command {
  static description = `Creates a shortcut to a list view`;

  static aliases = ["shortcut:create"];

  static flags = {
    help: flags.help({ char: "h" }),
  };

  // static args = [{ name: "name" }, { name: "flags" }];

  async run() {
    // const { args } = this.parse(Create);
    this.log(
      "You can create or update a custom view by selecting the flags to run the `list` command with."
    );
    const name = await cli.prompt("Shortcut name?");

    const options: any = await inquirer.prompt([
      {
        name: "flags",
        message: "Flags to include",
        type: "checkbox",
        choices: Object.keys(List.flags)
          .filter((k) => !["help", "sort", "length"].includes(k))
          .map((k) => ({
            name: k,
          })),
      },
    ]);

    const sortBy: any = await inquirer.prompt([
      {
        name: "sort",
        message: "Sort By",
        type: "list",
        choices: List.flags.sort.options,
      },
    ]);

    if (name && options.flags.length > 0) {
      const newShortcut = {
        name,
        command: "list",
        flags: ["--sort=" + sortBy.sort, ...options.flags],
      };

      const shortcuts = Shortcuts.get();
      this.log("\n");
      const shortcutIndex = shortcuts.findIndex((s) => s.name === name);
      if (shortcutIndex > -1) {
        shortcuts[shortcutIndex] = newShortcut;
      } else {
        shortcuts.push(newShortcut);
      }
      Shortcuts.set(shortcuts);

      log(
        [
          createText({
            text: `Shortcut created! Try it out by typing ${chalk.yellow.bold(
              `todo-today ${newShortcut.name}`
            )} `,
          }),
          "\n",
          createText({
            color: "white",
            text: `See all of your shortcuts with ${createText({
              text: `todo-today shortcuts:list`,
              color: "yellow",
              bold: true,
            })}`,
          }),
        ].join("")
      );
    } else {
      this.log("Custom view not created");
    }
  }
}
