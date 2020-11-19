import * as fs from "fs";
import * as path from "path";

const tokenFile = `.todoist-token`;

let _token: undefined | string;
function saveToken(key: string, configDir: string) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir);
    }
    fs.writeFile(path.join(configDir, tokenFile), key, function (err: any) {
      if (err) {
        reject(new Error(err));
      }
      resolve();
    });
  });
}
function readToken(configDir: string) {
  if (!_token) {
    try {
      _token = fs.readFileSync(path.join(configDir, tokenFile), "utf8");
    } catch (error) {
      throw new Error(
        "Can't find your API key. Did you forget to run `todo-today init` first?"
      );
    }
  }
  return _token;
}

export { saveToken, readToken };
