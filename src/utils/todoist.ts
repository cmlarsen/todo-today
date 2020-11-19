import axios from "axios";

const todoistSyncUrl = "https://api.todoist.com/sync/v8/sync";
const todoistRESTUrl = "https://api.todoist.com/rest/v1";
export interface TodoistProject {
  child_order: number;
  collapsed: number;
  color: number;
  id: number;
  is_archived: 1 | 0;
  is_deleted: 1 | 0;
  is_favorite: 1 | 0;
  name: string;
  parent_id: null | number;
  shared: boolean;
  sync_id: null | number;
}
export interface TodoistTask {
  assignee: number;
  comment_count: number;
  completed: boolean;
  content: string;
  creator?: number;
  due: {
    date: string;
    recurring: boolean;
    datetime: string;
    string?: string;
    timezone?: string;
  };
  id: number;
  label_ids: number[];
  order: number;
  priority: 1;
  project_id: number;
  section_id: number;
  parent_id?: number;
  url: string;
  checked: 1 | 0;
}
export type TodoistResource =
  | "all"
  | "labels"
  | "projects"
  | "items"
  | "notes"
  | "sections"
  | "filters"
  | "reminders"
  | "locations"
  | "user"
  | "live_notifications"
  | "collaborators"
  | "user_settings"
  | "notification_settings"
  | "user_plan_limits";

// Note: get all completed items: https://developer.todoist.com/sync/v8/#get-all-completed-items
// only available to premium users

async function sync(token: string, resources: TodoistResource[]) {
  const res = await axios.post(todoistSyncUrl, {
    token,
    sync_token: "*",
    resource_types: JSON.stringify(resources),
  });

  return res.data;
}

async function fetchToday(token: string): Promise<TodoistTask[]> {
  const res = await axios.get(todoistRESTUrl + "/tasks", {
    headers: { Authorization: "Bearer " + token },
    params: {
      filter: "today ",
    },
  });

  return res.data;
}
async function fetchOverdue(token: string): Promise<TodoistTask[]> {
  const res = await axios.get(todoistRESTUrl + "/tasks", {
    headers: { Authorization: "Bearer " + token },
    params: {
      filter: "overdue",
    },
  });

  return res.data;
}
export default {
  sync,
  fetchToday,
  fetchOverdue,
};
