import chalk = require("chalk");
import { cli } from "cli-ux";
import { table } from "cli-ux/lib/styled/table";
import createHeader from "./create-header";

export interface TaskTableRowData {
  title: string;
  completed?: boolean;
  url?: string;
  dueDate?: string | Date;
  dueDatetime?: string | Date;
}

export interface TaskTableProps {
  title: string;
  tasks: TaskTableRowData[];
  columns?: (keyof TaskTableRowData)[];
}

// Allows us to provide a custom format based on the column name
const customFormat: {
  [key: string]: table.Columns<TaskTableRowData>[string];
} = {
  completed: {
    get: ({ completed }: TaskTableRowData) => {
      return completed ? chalk.green("✔") : chalk.white("☐");
    },
  },
};

function createTaskTable({ tasks, title, columns }: TaskTableProps) {
  let output = "";
  output = createHeader({ text: title, color: "blue" });

  const cols: table.Columns<typeof tasks[number]> = {};

  columns &&
    columns.forEach((column: keyof TaskTableRowData) => {
      cols[column] = customFormat[column] ?? {};
    });
  cli.table(tasks, cols, {
    "no-header": true,
    printLine: (t: string) => {
      output += t + "\n";
    },
  });
  return output;
}

export default createTaskTable;
