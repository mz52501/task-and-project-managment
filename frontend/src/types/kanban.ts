export type Id = string | number;

export interface Column {
  id: Id;
  title: string;
  position?: number;
}

export interface KanbanTaskAssignee {
  id: string;
  initials: string;
  color?: string;
}

export interface KanbanTaskTag {
  id: string;
  name: string;
}

export interface KanbanTask {
  id: Id;
  columnId: Id;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  due_date?: string;
  assignees?: KanbanTaskAssignee[];
  time_tracked?: string;
  subtask_count?: number;
  comment_count?: number;
  tags?: KanbanTaskTag[];
}

export interface TaskDragData {
  type: "Task";
  task: KanbanTask;
}

export interface ColumnDragData {
  type: "Column";
  columnId: Id;
}
