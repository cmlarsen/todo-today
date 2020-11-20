import { saveToken } from "./../utils/token";
import { Command, flags } from "@oclif/command";

export default class Init extends Command {
  static description = `Connect to your Todoist account. You can find this in Todoist under Settings -> Integrations -> API token. It will look something like this: 9d95f4419a485ae8ba935b44b202ad38a64eaasd`;

  static examples = [`$ today init TOKEN`];

  static flags = {
    help: flags.help({ char: "h" }),
  };

  static args = [{ name: "token" }];

  async run() {
    const { args } = this.parse(Init);

    if (args.token) {
      saveToken(args.token, this.config.configDir);
    } else {
      throw new Error("You forgot to add your api token");
    }

    this.log(`Token saved!`);
  }
}
