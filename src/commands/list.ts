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

export default class List extends Command {
  static aliases = ["l", "today"];

  static description = "Lists your tasks due today.";

  static examples = [`$ today-todo list`, `$ today-todo list -oc`];

  static args = [{ name: "file" }];

  static flags = {
    help: flags.help({ char: "h" }),
    overdue: flags.boolean({
      char: "o",
      description: "Include overdue items.",
    }),
    urls: flags.boolean({
      char: "u",
      description: "Displays the Todoist URLs for each task.",
    }),
    copy: flags.boolean({
      char: "c",
      description: "Copies the output to the clipboard.",
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

    const overdueTasks = flags.overdue ? await todoist.fetchOverdue(token) : [];
    const todayTasks = await todoist.fetchToday(token);
    cli.action.stop("\n");

    output += createHeader({ text: `Today`, color: "green" });
    const todayTableData = createProjectGroup(todayTasks, projects);
    if (todayTableData.length === 0) {
      output += createText({ text: "Nothing today!", color: "red" });
    }

    todayTableData.forEach((group) => {
      const columns: TaskTableProps["columns"] = ["completed", "title"];
      if (flags.urls) {
        columns.push("url");
      }
      output += createTaskTable({
        title: group.name,
        tasks: group.items,
        columns,
      });
    });

    if (overdueTasks.length > 0) {
      // TODO create "OverdueTaskTable" component to make custom formatting a thing
      const overdueTableData = createProjectGroup(overdueTasks, projects);
      output += "\r";
      output += createHeader({ text: `Overdue`, color: "red" });
      overdueTableData.forEach((group) => {
        const columns: TaskTableProps["columns"] = ["title"];
        if (flags.urls) {
          columns.push("url");
        }
        output += createTaskTable({
          title: group.name,
          tasks: group.items,
          columns,
        });
      });
    }

    log(output);

    if (flags.copy) {
      copyToClipboard(output);
    }
  }
}
