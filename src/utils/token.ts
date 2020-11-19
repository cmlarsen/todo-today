import * as fs from "fs";

const folder = "./cache";
const tokenPath = `${folder}/.todoist-token`;
let _token: undefined | string;
function saveToken(key: string) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }
    fs.writeFile(tokenPath, key, function (err: any) {
      if (err) {
        reject(new Error(err));
      }
      resolve();
    });
  });
}
function readToken() {
  if (!_token) {
    try {
      _token = fs.readFileSync(tokenPath, "utf8");
    } catch (e) {
      throw new Error(
        "Can't find your API key. Did you forget to run `today init` first?"
      );
    }
  }
  return _token;
}

export { saveToken, readToken, tokenPath };
