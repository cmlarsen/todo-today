import { TodoistProject, TodoistTask } from "./../utils/todoist";
import { Command, flags } from "@oclif/command";
import todoist from "../utils/todoist";
import * as moment from "moment";
import { cli } from "cli-ux";
import chalk = require("chalk");
// @ts-expect-error
import * as wrapText from "wrap-text";
import { readToken } from "../utils/token";
import { table } from "cli-ux/lib/styled/table";

interface Groupings {
  [key: string]: {
    name: string;
    items: TodoistTask[];
  };
}
export default class List extends Command {
  static aliases = ["l", "today"];

  static description = "Lists your tasks for today along with overdue items";

  static examples = [`$ today-todo list`, `$ today-todo list -ju`];

  static flags = {
    help: flags.help({ char: "h" }),
    justToday: flags.boolean({
      char: "j",
      description:
        "Only shows tasks that are due today. Hides overdue and other tasks not explicitly due today.",
    }),
    urls: flags.boolean({
      char: "u",
      description: "Displays the Todoist URLs for each task ",
    }),
  };

  async run() {
    const { flags } = this.parse(List);
    const showUrls = flags.urls;

    // TODO: Create parent class that hands us all the todoist data and keys
    // TODO: Refactor all of this nonesense.
    const token = readToken(this.config.configDir);
    cli.action.start("Hey Todoist, what's up");
    const { projects } = (await todoist.sync(token, [
      "projects",
      "sections",
      "labels",
    ])) as { projects: TodoistProject[] };
    const overdueItems =
      !flags.justToday && (await todoist.fetchOverdue(token));
    const items = await todoist.fetchToday(token);
    cli.action.stop("\n");

    const groupings = items.reduce((groups: Groupings, item) => {
      const project = projects.find((p: any) => p.id === item.project_id);
      if (!project) return groups;
      if (!groups[project.id]) {
        groups[project.id] = {
          name: project.name,
          items: [],
        };
      }
      groups[project.id].items.push(item);

      return groups;
    }, {});

    this.log(chalk.green.bold(`Today ${new Date().toLocaleDateString()}`));
    if (Object.entries(groupings).length === 0) {
      this.log(chalk.keyword("pink")("Nothing today!"));
    }
    Object.entries(groupings).forEach(([_, group]) => {
      this.log(chalk.blue.bold(group.name));
      const tableData = group.items.map((item) => ({
        ...item,
        status: item?.checked ? chalk.green("✔") : chalk.white("☐"),
      }));
      const cols: table.Columns<typeof tableData[number]> = {
        status: {},
        content: {
          minWidth: 55,
          get: (row) => {
            const dueTime = row.due?.datetime
              ? " @" + moment(row.due?.datetime).format("h:mma")
              : "";
            const text =
              chalk.yellow(wrapText(row.content, 55)) + chalk.white(dueTime);
            return text;
          },
        },
      };

      if (showUrls) {
        cols.urls = {
          get: (row) => chalk.gray(row.url),
        };
      }

      cli.table(tableData, cols, {
        sort: "order",
        "no-header": true,
      });
    });

    if (overdueItems) {
      this.log(chalk.red.bold("\nOverdue"));
      const overdueTableData = overdueItems.map((item) => ({
        ...item,
        projectName: projects.find(({ id }) => id === item.project_id)?.name,
      }));
      const overdueCols: table.Columns<typeof overdueTableData[number]> = {
        projectName: {
          minWidth: 10,
          get: (row) => chalk.keyword("gray")(row.projectName),
        },
        content: {
          minWidth: 55,
          get: (row) => chalk.keyword("lightgray")(wrapText(row.content, 55)),
        },
      };

      if (showUrls) {
        overdueCols.urls = {
          get: (row) => chalk.gray(row.url),
        };
      }
      cli.table(overdueTableData, overdueCols, {
        sort: "order",
        "no-header": true,
      });
    }
  }
}
