import chalk = require("chalk");
import { cli } from "cli-ux";
import { table } from "cli-ux/lib/styled/table";
import moment = require("moment");
import * as wrapAnsi from "wrap-ansi";
import createHeader from "./create-header";

export interface TaskTableRowData {
  id: number;
  priority: number;
  createdDate: string | Date;
  title: string;
  completed?: boolean;
  url?: string;
  dueDate?: string | Date;
  dueDatetime?: string | Date;
  parentId?: number;
  children?: TaskTableRowData[];
}

export interface TaskTableProps {
  title: string;
  tasks: TaskTableRowData[];
  columns?: (keyof TaskTableRowData)[];
  wrap?: boolean;
  wrapAt?: number;
}

// Allows us to provide a custom format based on the column name

const format = (column: string, { wrap = false, wrapAt = 60 }) => {
  const customFormat: {
    [key: string]: table.Columns<TaskTableRowData>[string];
  } = {
    dueDatetime: {
      get: ({ dueDatetime }) => {
        return dueDatetime ? moment(dueDatetime).format("h:mma") : "";
      },
    },
    title: {
      get: ({ title }: TaskTableRowData) => {
        return wrap ? wrapAnsi(title, wrapAt) : title;
      },
    },
    completed: {
      minWidth: 1,
      get: ({ completed }: TaskTableRowData) => {
        return completed ? chalk.green("✔") : chalk.white("•");
      },
    },
  };
  return customFormat[column];
};
function createTaskTable({
  tasks,
  title,
  columns,
  wrap = false,
  wrapAt = 60,
}: TaskTableProps) {
  let output = "";
  output = createHeader({ text: title, color: "blue" });

  const cols: table.Columns<typeof tasks[number]> = {};

  columns &&
    columns.forEach((column: keyof TaskTableRowData) => {
      cols[column] = format(column, { wrap, wrapAt }) ?? {};
    });
  cli.table(tasks, cols, {
    "no-truncate": true,
    "no-header": true,
    printLine: (t: string) => {
      output += t + "\n";
    },
  });
  return output;
}

export default createTaskTable;
