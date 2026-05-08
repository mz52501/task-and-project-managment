import client from "./client";
import { Task, CreateTaskRequest, Comment, Subtask, TimeEntry } from "@/types";

export interface TasksResponse {
  assigned: Task[];
  created: Task[];
}

export const getTasks = async (): Promise<TasksResponse> => {
  const response = await client.get<TasksResponse>("/tasks");
  return response.data;
};

export const getTask = async (id: number): Promise<Task> => {
  const response = await client.get<Task>(`/tasks/${id}`);
  return response.data;
};

export const createTask = async (data: CreateTaskRequest): Promise<Task> => {
  const response = await client.post<Task>("/tasks", data);
  return response.data;
};

export const updateTask = async (id: number, data: Partial<CreateTaskRequest>): Promise<Task> => {
  const response = await client.patch<Task>(`/tasks/${id}`, data);
  return response.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await client.delete(`/tasks/${id}`);
};

export const getComments = async (taskId: number): Promise<Comment[]> => {
  const response = await client.get<Comment[]>(`/tasks/${taskId}/comments`);
  return response.data;
};

export const createComment = async (taskId: number, content: string): Promise<Comment> => {
  const response = await client.post<Comment>(`/tasks/${taskId}/comments`, { content });
  return response.data;
};

export const getSubtasks = async (taskId: number): Promise<Subtask[]> => {
  const response = await client.get<Subtask[]>(`/tasks/${taskId}/subtasks`);
  return response.data;
};

export const createSubtask = async (taskId: number, title: string): Promise<Subtask> => {
  const response = await client.post<Subtask>(`/tasks/${taskId}/subtasks`, { title });
  return response.data;
};

export const getTimeEntries = async (): Promise<TimeEntry[]> => {
  const response = await client.get<TimeEntry[]>("/time_entries");
  return response.data;
};

export const createTimeEntry = async (data: {
  task_id: number;
  duration_minutes: number;
  work_date: string;
  comment?: string;
}): Promise<TimeEntry> => {
  const response = await client.post<TimeEntry>("/time_entries", data);
  return response.data;
};
