import { TaskTableRowData } from "../components/create-task-table";
import { TodoistTask, TodoistProject } from "./todoist";

interface Group {
  name: string;
  id: number | string;
  items: TaskTableRowData[];
}

export default function createProjectGroup(
  items: TodoistTask[],
  projects: TodoistProject[]
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
      title: item.content,
      completed: item.completed,
      url: item.url,
      dueDate: item.due?.date,
      dueDatetime: item.due?.datetime,
    });

    return groups;
  }, []);
  return projectGroups;
}
