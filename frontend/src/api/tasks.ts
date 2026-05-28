import client from "./client";
import { Task, CreateTaskRequest, Comment, TimeEntry, User } from "@/types";

export interface TasksResponse {
  assigned: Task[];
  created: Task[];
}

export interface KanbanTaskFromApi extends Task {
  stage_name: string;
  assignees: { id: string; name: string; initials: string }[];
  tags: { id: string; name: string; color: string }[];
  subtask_count: number;
  comment_count: number;
  time_tracked: string | null;
}

export const getTasks = async (): Promise<TasksResponse> => {
  const response = await client.get<TasksResponse>("/tasks");
  return response.data;
};

export const getProjectTasks = async (projectId: string): Promise<KanbanTaskFromApi[]> => {
  const response = await client.get<KanbanTaskFromApi[]>("/tasks", {
    params: { project_id: projectId },
  });
  return response.data;
};

export const getTask = async (id: string): Promise<Task> => {
  const response = await client.get<Task>(`/tasks/${id}`);
  return response.data;
};

export const createTask = async (data: CreateTaskRequest): Promise<Task> => {
  const response = await client.post<Task>("/tasks", data);
  return response.data;
};

export const updateTask = async (id: string, data: Partial<CreateTaskRequest>): Promise<Task> => {
  const response = await client.patch<Task>(`/tasks/${id}`, data);
  return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await client.delete(`/tasks/${id}`);
};

export const getComments = async (taskId: string): Promise<Comment[]> => {
  const response = await client.get<Comment[]>(`/tasks/${taskId}/comments`);
  return response.data;
};

export const createComment = async (taskId: string, content: string): Promise<Comment> => {
  const response = await client.post<Comment>(`/tasks/${taskId}/comments`, { content });
  return response.data;
};

export const getChildTasks = async (parentTaskId: string): Promise<Task[]> => {
  const response = await client.get<Task[]>("/tasks", { params: { parent_task_id: parentTaskId } });
  return response.data;
};

export const createChildTask = async (
  data: CreateTaskRequest & { parent_task_id: string }
): Promise<Task> => {
  const response = await client.post<Task>("/tasks", data);
  return response.data;
};

export const getTaskAssignees = async (taskId: string): Promise<User[]> => {
  const response = await client.get<User[]>(`/tasks/${taskId}/assignments`);
  return response.data;
};

export const addTaskAssignee = async (taskId: string, userId: string): Promise<User[]> => {
  const response = await client.post<User[]>(`/tasks/${taskId}/assignments`, { user_id: userId });
  return response.data;
};

export const removeTaskAssignee = async (taskId: string, userId: string): Promise<void> => {
  await client.delete(`/tasks/${taskId}/assignments/${userId}`);
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
