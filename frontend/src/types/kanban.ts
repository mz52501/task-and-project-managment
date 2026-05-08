export type Id = string | number;

export interface Column {
  id: Id;
  title: string;
}

export interface KanbanTask {
  id: Id;
  columnId: Id;
  content: string;
}
