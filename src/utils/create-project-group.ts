import moment = require("moment");
import { TaskTableRowData } from "../components/create-task-table";
import { TodoistTask, TodoistProject } from "./todoist";

interface Group {
  name: string;
  id: number | string;
  items: TaskTableRowData[];
}

// If the parent exists then add a return and concat the child
// └
function nest(items: TaskTableRowData[]) {
  // find all items without parents
  // find all direct children of parents: repeat until done
  const topLevelItems = items.filter((i, _index, _items) => {
    const parentExists = Boolean(_items.find((_i) => _i.id === i.parentId));
    const hasParent = Boolean(i.parentId);
    return !parentExists || !hasParent;
  });

  function _nest(levelItems: any[], _items: any[]) {
    const kids = levelItems.map((item) => {
      let children = _items.filter((i) => i.parentId === item.id);

      if (children.length > 0) {
        children = _nest(children, _items);
      }
      return {
        ...item,
        children,
      };
    });

    return kids;
  }
  const nested = _nest(topLevelItems, items);

  function _createTitle(item: any[], deep = 0) {
    let title =
      item.title +
      (item.dueDatetime
        ? " @ " + moment(item.dueDatetime).format("h:mma")
        : "");

    if (item.children?.length) {
      title +=
        "\n" +
        "  ".repeat(deep) +
        "└ " +
        item.children
          .map((child) => {
            return _createTitle(child, deep + 1);
          })
          .join("\n" + "  ".repeat(deep) + "└ ");
    }
    return title;
  }
  nested.forEach((i) => {
    i.title = _createTitle(i);
  });

  return nested;
}
export default function createProjectGroup(
  items: TodoistTask[],
  projects: TodoistProject[],
  { nestSubTasks } = { nestSubTasks: false }
) {
  const projectGroups: Group[] = items.reduce((groups: Group[], item) => {
    const project = projects.find((p: any) => p.id === item.project_id);
    if (!project) return groups;
    let i = groups.findIndex((group) => group.id === project.id);
    // Create group if it is missing
    if (i === -1) {
      i =
        groups.push({
          name: project.name,
          id: project.id,
          items: [],
        }) - 1;
    }

    groups[i].items.push({
      id: item.id,
      priority: item.priority,
      createdDate: item.created,
      title: item.content,
      completed: item.completed,
      url: item.url,
      dueDate: item.due?.date,
      dueDatetime: item.due?.datetime,
      parentId: item.parent_id,
    });

    return groups;
  }, []);
  let result = projectGroups;
  if (nestSubTasks) {
    const nestedProjectGroups = projectGroups.map((g) => ({
      ...g,
      items: nest(g.items),
    }));
    result = nestedProjectGroups;
  }
  return result;
}
