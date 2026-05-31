import client from "./client";
import { Task, CreateTaskRequest, Comment, TimeEntry, User } from "@/types";

export interface TasksResponse {
  assigned: Task[];
  created: Task[];
}

export interface KanbanTaskFromApi extends Task {
  stage_name: string;
  assignees: { id: string; name: string; initials: string }[];
  tags: { id: string; name: string }[];
  subtask_count: number;
  comment_count: number;
  time_tracked: string | null;
}

const taskBase = (workspaceId: string) => `/workspaces/${workspaceId}/tasks`;

export const getTasks = async (workspaceId: string): Promise<TasksResponse> => {
  const response = await client.get<TasksResponse>(taskBase(workspaceId));
  return response.data;
};

export interface MyTasksGroup {
  project_id: string;
  project_name: string;
  tasks: {
    id: string;
    title: string;
    priority: string;
    due_date: string | null;
    stage_name: string | null;
    tags: { id: string; name: string }[];
  }[];
}

export const getMyTasks = async (workspaceId: string): Promise<MyTasksGroup[]> => {
  const response = await client.get<MyTasksGroup[]>(taskBase(workspaceId));
  return response.data;
};

export const getProjectTasks = async (workspaceId: string, projectId: string): Promise<KanbanTaskFromApi[]> => {
  const response = await client.get<KanbanTaskFromApi[]>(taskBase(workspaceId), {
    params: { project_id: projectId },
  });
  return response.data;
};

export const getTask = async (workspaceId: string, id: string): Promise<Task> => {
  const response = await client.get<Task>(`${taskBase(workspaceId)}/${id}`);
  return response.data;
};

export const createTask = async (workspaceId: string, data: CreateTaskRequest): Promise<Task> => {
  const response = await client.post<Task>(taskBase(workspaceId), data);
  return response.data;
};

export const updateTask = async (workspaceId: string, id: string, data: Partial<CreateTaskRequest>): Promise<Task> => {
  const response = await client.patch<Task>(`${taskBase(workspaceId)}/${id}`, data);
  return response.data;
};

export const deleteTask = async (workspaceId: string, id: string): Promise<void> => {
  await client.delete(`${taskBase(workspaceId)}/${id}`);
};

export const getComments = async (workspaceId: string, taskId: string): Promise<Comment[]> => {
  const response = await client.get<Comment[]>(`${taskBase(workspaceId)}/${taskId}/comments`);
  return response.data;
};

export const createComment = async (workspaceId: string, taskId: string, content: string): Promise<Comment> => {
  const response = await client.post<Comment>(`${taskBase(workspaceId)}/${taskId}/comments`, { content });
  return response.data;
};

export const getChildTasks = async (workspaceId: string, parentTaskId: string): Promise<Task[]> => {
  const response = await client.get<Task[]>(taskBase(workspaceId), { params: { parent_task_id: parentTaskId } });
  return response.data;
};

export const createChildTask = async (
  workspaceId: string,
  data: CreateTaskRequest & { parent_task_id: string }
): Promise<Task> => {
  const response = await client.post<Task>(taskBase(workspaceId), data);
  return response.data;
};

export const getTaskAssignees = async (workspaceId: string, taskId: string): Promise<User[]> => {
  const response = await client.get<User[]>(`${taskBase(workspaceId)}/${taskId}/assignments`);
  return response.data;
};

export const addTaskAssignee = async (workspaceId: string, taskId: string, userId: string): Promise<User[]> => {
  const response = await client.post<User[]>(`${taskBase(workspaceId)}/${taskId}/assignments`, { user_id: userId });
  return response.data;
};

export const removeTaskAssignee = async (workspaceId: string, taskId: string, userId: string): Promise<void> => {
  await client.delete(`${taskBase(workspaceId)}/${taskId}/assignments/${userId}`);
};

export const getTimeEntries = async (): Promise<TimeEntry[]> => {
  const response = await client.get<TimeEntry[]>("/time_entries");
  return response.data;
};

export const createTimeEntry = async (data: {
  task_id: string;
  duration_minutes: number;
  work_date: string;
  comment?: string;
}): Promise<TimeEntry> => {
  const response = await client.post<TimeEntry>("/time_entries", data);
  return response.data;
};

export const updateTimeEntry = async (
  id: string,
  data: { duration_minutes?: number; comment?: string; work_date?: string }
): Promise<TimeEntry> => {
  const response = await client.patch<TimeEntry>(`/time_entries/${id}`, data);
  return response.data;
};

export const deleteTimeEntry = async (id: string): Promise<void> => {
  await client.delete(`/time_entries/${id}`);
};

export const updateComment = async (id: string, content: string): Promise<Comment> => {
  const response = await client.patch<Comment>(`/comments/${id}`, { content });
  return response.data;
};

export const deleteCommentById = async (id: string): Promise<void> => {
  await client.delete(`/comments/${id}`);
};
