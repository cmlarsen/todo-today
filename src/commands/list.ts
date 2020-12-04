import { Command, flags } from "@oclif/command";
import createTaskTable, {
  TaskTableProps,
} from "../components/create-task-table";

import { TodoistProject } from "./../utils/todoist";
import { cli } from "cli-ux";
import copyToClipboard from "../utils/copy-to-clipboard";
import createHeader from "../components/create-header";
import createProjectGroup from "../utils/create-project-group";
import createText from "../components/create-text";
import log from "../utils/log";
import { readToken } from "../utils/token";
import todoist from "../utils/todoist";
import _ = require("lodash");

export default class List extends Command {
  static aliases = ["l", "today"];

  static description = "Lists your tasks due today.";

  static examples = [
    `$ today-todo list`,
    `$ today-todo list -oc`,
    "$ today-todo list -wrap ",
  ];

  static args = [{ name: "file" }];

  static flags = {
    help: flags.help({ char: "h" }),
    "show-overdue": flags.boolean({
      char: "o",
      description: "Include overdue items.",
    }),
    "show-urls": flags.boolean({
      char: "u",
      description: "Displays the Todoist URLs for each task.",
    }),
    "copy-to-clipboard": flags.boolean({
      char: "c",
      description: "Copies the output to the clipboard.",
    }),
    wrap: flags.boolean({
      char: "w",
      description:
        "Wraps the text instead of truncating it to fit on one line.",
    }),
    // "show-when-due": flags.boolean({
    //   char: "d",
    //   description: "Show when an item is due",
    // }),
    "show-priority": flags.boolean({
      char: "p",
      description: "Show when the item priority",
    }),
    "nest-sub-tasks": flags.boolean({
      char: "b",
      description:
        "Show sub-tasks as a nested tree rather than at the top level.",
    }),
    sort: flags.string({
      char: "s",
      options: ["priority", "due", "alphabetically"],
      description: "Table sorting", // help description for flag
    }),
  };

  async run() {
    const { flags } = this.parse(List);

    let output = "";

    const token = readToken(this.config.configDir);

    cli.action.start("Hey Todoist, what's up");
    const { projects } = (await todoist.sync(token, [
      "projects",
      "sections",
      "labels",
    ])) as { projects: TodoistProject[] };

    const overdueTasks = flags["show-overdue"]
      ? await todoist.fetchOverdue(token)
      : [];
    const todayTasks = await todoist.fetchToday(token);
    cli.action.stop("\n");

    // output += createHeader({ text: `Today`, color: "green" });
    const todayTableData = createProjectGroup(todayTasks, projects, {
      nestSubTasks: flags["nest-sub-tasks"],
    });
    if (todayTableData.length === 0) {
      output += createText({ text: "Nothing today!", color: "red" });
    }

    todayTableData.forEach((group) => {
      const columns: TaskTableProps["columns"] = ["completed", "title"];
      if (flags["show-urls"]) {
        columns.push("url");
      }
      // if (flags["show-when-due"]) {
      //   columns.push("dueDatetime");
      // }

      if (flags.sort) {
        if (flags.sort === "alphabetically") {
          group.items = _.sortBy(group.items, ["title"]);
        }
        if (flags.sort === "due") {
          group.items = _.sortBy(group.items, ["dueDatetime"]);
        }
        if (flags.sort === "priority") {
          group.items = _.sortBy(group.items, ["priority"]);
        }
      } else {
        group.items = _.sortBy(group.items, ["createdDate"]);
      }

      output += createTaskTable({
        title: group.name,
        tasks: group.items,
        columns,
        wrap: flags.wrap,
      });
    });

    if (overdueTasks.length > 0) {
      // TODO create "OverdueTaskTable" component to make custom formatting a thing
      const overdueTableData = createProjectGroup(overdueTasks, projects);
      output += "\r";
      output += createHeader({ text: `Overdue`, color: "red" });
      overdueTableData.forEach((group) => {
        const columns: TaskTableProps["columns"] = ["title"];
        if (flags["show-urls"]) {
          columns.push("url");
        }
        // if (flags["show-when-due"]) {
        //   columns.push("dueDatetime");
        // }
        output += createTaskTable({
          title: group.name,
          tasks: group.items,
          columns,
          wrap: flags.wrap,
        });
      });
    }

    log(output);

    if (flags["copy-to-clipboard"]) {
      copyToClipboard(output);
    }
  }
}
