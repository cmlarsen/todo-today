import { TodoistProject, TodoistTask } from "./../utils/todoist";
import { Command, flags } from "@oclif/command";
import todoist from "../utils/todoist";
import * as moment from "moment";
import { cli } from "cli-ux";
import chalk = require("chalk");
//@ts-ignore
import * as wrapText from "wrap-text";

interface Groupings {
  [key: string]: {
    name: string;
    items: TodoistTask[];
  };
}
export default class List extends Command {
  static description = "Lists your todos for today";

  static examples = [`$ today todo`];

  static flags = {
    help: flags.help({ char: "h" }),
  };

  async run() {
    const { args, flags } = this.parse(List);
    cli.action.start("Fetching todos");
    const { projects } = (await todoist.sync([
      "projects",
      "sections",
      "labels",
    ])) as { projects: TodoistProject[] };
    const overdueItems = await todoist.fetchOverdue();
    const items = await todoist.fetchToday();
    cli.action.stop();

    const groupings = items.reduce((groups: Groupings, item) => {
      const project = projects.find((p: any) => p.id === item.project_id);
      if (!project) return groups;
      if (!groups.hasOwnProperty(project.id)) {
        groups[project.id] = {
          name: project.name,
          items: [],
        };
      }
      groups[project.id].items.push(item);

      return groups;
    }, {});

    this.log(chalk.green.bold(`Today ${new Date().toLocaleDateString()}`));
    Object.entries(groupings).forEach(([_, group]) => {
      this.log(chalk.blue.bold(group.name));
      cli.table(
        group.items.map((item) => ({
          ...item,
          status: item?.checked ? chalk.green("✔") : chalk.white("☐"),
        })),
        {
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
          url: {
            get: (row) => chalk.gray(row.url),
          },
        },
        {
          sort: "priority",
          "no-header": true,
        }
      );
    });

    this.log(chalk.red.bold("\nOverdue"));
    cli.table(
      overdueItems.map((item) => ({
        ...item,
        projectName: projects.find(({ id }) => id === item.project_id)?.name,
      })),
      {
        projectName: {
          minWidth: 10,
          get: (row) => chalk.keyword("gray")(row.projectName),
        },
        content: {
          minWidth: 55,
          get: (row) => chalk.keyword("lightgray")(wrapText(row.content, 55)), //+ chalk.gray(` (${row.url})`),
        },
        url: {
          get: (row) => chalk.keyword("gray")(row.url),
        },
      },
      {
        sort: "priority",
        "no-header": true,
      }
    );

    // const name = flags.name ?? "world";

    // this.log(`hello ${name} from ./src/commands/hello.ts`);
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`);
    }
  }
}
