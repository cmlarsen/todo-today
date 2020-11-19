todo-today
==========

What to do today

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/todo-today.svg)](https://npmjs.org/package/todo-today)
[![Downloads/week](https://img.shields.io/npm/dw/todo-today.svg)](https://npmjs.org/package/todo-today)
[![License](https://img.shields.io/npm/l/todo-today.svg)](https://github.com/cmlarsen/todo-today/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g todo-today
$ today COMMAND
running command...
$ today (-v|--version|version)
todo-today/0.2.0 darwin-x64 node-v15.2.1
$ today --help [COMMAND]
USAGE
  $ today COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`today help [COMMAND]`](#today-help-command)
* [`today init [TOKEN]`](#today-init-token)
* [`today list [FILE]`](#today-list-file)

## `today help [COMMAND]`

display help for today

```
USAGE
  $ today help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_

## `today init [TOKEN]`

Connect to your Todoist account. You can find this in Todoist under Settings -> Integrations -> API token. It will look something like this: 9d95f4419a485ae8ba935b44b202ad38a64eaasd

```
USAGE
  $ today init [TOKEN]

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ today init [Your Key Here]
```

_See code: [src/commands/init.ts](https://github.com/cmlarsen/todo-today/blob/v0.2.0/src/commands/init.ts)_

## `today list [FILE]`

Lists your todos for today

```
USAGE
  $ today list [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ today todo
```

_See code: [src/commands/list.ts](https://github.com/cmlarsen/todo-today/blob/v0.2.0/src/commands/list.ts)_
<!-- commandsstop -->
