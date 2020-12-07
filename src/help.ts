import * as Conf from "conf";

import { Command, Topic } from "@oclif/config";

import Help from "@oclif/plugin-help";
import { Shortcut } from "./commands/shortcuts/create";
import { renderList } from "@oclif/plugin-help/lib/list";

import chalk = require("chalk");
import { Shortcuts } from "./utils/shortcut";

const { bold } = chalk;
const indent = require("indent-string");

//TODO expand help to show custom commands
export default class CustomHelp extends Help {
  // acts as a "router"
  // and based on the args it receives
  // calls one of showRootHelp, showTopicHelp,
  // or showCommandHelp
  // showHelp(args: string[]): void {}

  // display the root help of a CLI
  shortcuts = Shortcuts.get();

  showRootHelp(): void {
    let rootTopics = this.sortedTopics;
    let rootCommands = this.sortedCommands;
    const shortcuts = this.shortcuts as Shortcut[];

    console.log(this.formatRoot());
    console.log("");
    if (!this.opts.all) {
      rootTopics = rootTopics.filter((t) => !t.name.includes(":"));
      rootCommands = rootCommands.filter((c) => !c.id.includes(":"));
    }
    if (rootTopics.length > 0) {
      console.log(this.formatTopics(rootTopics));
      console.log("");
    }
    if (rootCommands.length > 0) {
      rootCommands = rootCommands.filter((c) => c.id);
      console.log(this.formatCommands(rootCommands));
      console.log("");
    }
    if (shortcuts.length > 0) {
      console.log(this.formatShortcuts(shortcuts));
      console.log("");
    }
  }

  formatShortcuts(shortcuts: Shortcut[]) {
    if (shortcuts.length === 0) return "";
    const body = renderList(
      shortcuts.map((s) => [
        s.name,
        s.flags &&
          this.render(s.command + " " + s.flags.map((f) => f).join(" --")),
      ]),
      {
        spacer: "\n",
        stripAnsi: this.opts.stripAnsi,
        maxWidth: this.opts.maxWidth - 2,
      }
    );
    return [
      bold("SHORTCUTS"),
      indent("Custom shortcuts that you have defined.\r", 0),
      indent(body, 2),
    ].join("\n");
  }
  // // display help for a topic
  // showTopicHelp(topic: Topic): void {}

  // // display help for a command
  // showCommandHelp(command: Command): void {}

  // // the default implementations of showRootHelp
  // // showTopicHelp and showCommandHelp
  // // will call various format methods that
  // // provide the formatting for their corresponding
  // // help sections;
  // // these can be overwritten as well

  // // the formatting responsible for the header
  // // displayed for the root help
  // formatRoot(): string {}

  // // the formatting for an individual topic
  // formatTopic(topic: Config.Topic): string {}

  // // the formatting for a list of topics
  // protected formatTopics(topics: Config.Topic[]): string {}

  // // the formatting for a list of commands
  // formatCommands(commands: Config.Command[]): string {}

  // // the formatting for an individual command
  // formatCommand(command: Config.Command): string {}
}
