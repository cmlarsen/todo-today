const util_1 = require("util");
// Copied from @oclif/command/lib/command.js
export default function log(message = "", ...args: any[]) {
  // tslint:disable-next-line strict-type-predicates
  message = typeof message === "string" ? message : util_1.inspect(message);
  process.stdout.write(util_1.format(message, ...args) + "\n");
}
