export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  due_date?: string;
  project_id: string;
  created_by_id: string;
  parent_task_id?: string;
  workflow_stage_id: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface TimeEntry {
  id: string;
  task_id: string;
  user_id: string;
  duration_minutes: number;
  work_date: string;
  comment?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority?: TaskPriority;
  due_date?: string;
  project_id: string;
  workflow_stage_id: string;
  parent_task_id?: string;
}
