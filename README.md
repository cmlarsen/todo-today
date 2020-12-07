# todo-today

This is a very bare bones interface for Todoist. You will need your Todoist API token, found in `Todoist Settings -> Integrations -> Api Token`

**Note:** This is under active development and commands will likely change.

---

**Note:** If this is your first time installing a global NPM package you may see an error that looks like this:

```sh-session
checkPermissions Missing write access to /usr/local/lib/node_modules
...
```

To fix this you can run `sudo chown -R $USER /usr/local/lib/node_modules` then try the install again.

---

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/todo-today.svg)](https://npmjs.org/package/todo-today)
[![Downloads/week](https://img.shields.io/npm/dw/todo-today.svg)](https://npmjs.org/package/todo-today)
[![License](https://img.shields.io/npm/l/todo-today.svg)](https://github.com/cmlarsen/todo-today/blob/master/package.json)

<!-- toc -->
* [todo-today](#todo-today)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g todo-today
$ todo-today COMMAND
running command...
$ todo-today (-v|--version|version)
todo-today/0.5.0 darwin-x64 node-v15.2.1
$ todo-today --help [COMMAND]
USAGE
  $ todo-today COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`todo-today help [COMMAND]`](#todo-today-help-command)
* [`todo-today init [TOKEN]`](#todo-today-init-token)
* [`todo-today list [FILE]`](#todo-today-list-file)
* [`todo-today shortcuts:create`](#todo-today-shortcutscreate)
* [`todo-today shortcuts:delete [SHORTCUT-NAME]`](#todo-today-shortcutsdelete-shortcut-name)
* [`todo-today shortcuts:list`](#todo-today-shortcutslist)

## `todo-today help [COMMAND]`

display help for todo-today

```
USAGE
  $ todo-today help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_

## `todo-today init [TOKEN]`

Connect to your Todoist account. You can find this in Todoist under Settings -> Integrations -> API token. It will look something like this: 9d95f4419a485ae8ba935b44b202ad38a64eaasd

```
USAGE
  $ todo-today init [TOKEN]

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ today init TOKEN
```

_See code: [src/commands/init.ts](https://github.com/cmlarsen/todo-today/blob/v0.5.0/src/commands/init.ts)_

## `todo-today list [FILE]`

Lists your tasks due today.

```
USAGE
  $ todo-today list [FILE]

OPTIONS
  -b, --nest-sub-tasks                    Show sub-tasks as a nested tree rather than at the top level.
  -c, --copy-to-clipboard                 Copies the output to the clipboard.
  -h, --help                              show CLI help
  -o, --show-overdue                      Include overdue items.
  -p, --show-priority                     Show when the item priority
  -s, --sort=priority|due|alphabetically  Table sorting
  -u, --show-urls                         Displays the Todoist URLs for each task.
  -w, --wrap                              Wraps the text instead of truncating it to fit on one line.

ALIASES
  $ todo-today l
  $ todo-today today

EXAMPLES
  $ today-todo list
  $ today-todo list -oc
  $ today-todo list -wrap
```

_See code: [src/commands/list.ts](https://github.com/cmlarsen/todo-today/blob/v0.5.0/src/commands/list.ts)_

## `todo-today shortcuts:create`

Creates a shortcut to a list view

```
USAGE
  $ todo-today shortcuts:create

OPTIONS
  -h, --help  show CLI help

ALIASES
  $ todo-today shortcut:create
```

_See code: [src/commands/shortcuts/create.ts](https://github.com/cmlarsen/todo-today/blob/v0.5.0/src/commands/shortcuts/create.ts)_

## `todo-today shortcuts:delete [SHORTCUT-NAME]`

Deletes a shortcut

```
USAGE
  $ todo-today shortcuts:delete [SHORTCUT-NAME]

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/shortcuts/delete.ts](https://github.com/cmlarsen/todo-today/blob/v0.5.0/src/commands/shortcuts/delete.ts)_

## `todo-today shortcuts:list`

Lists shortcuts

```
USAGE
  $ todo-today shortcuts:list

OPTIONS
  -h, --help  show CLI help

ALIASES
  $ todo-today shortcut:list
```

_See code: [src/commands/shortcuts/list.ts](https://github.com/cmlarsen/todo-today/blob/v0.5.0/src/commands/shortcuts/list.ts)_
<!-- commandsstop -->
