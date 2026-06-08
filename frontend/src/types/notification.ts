export type NotificationType =
  | "task_assigned"
  | "task_status_changed"
  | "task_due_soon"
  | "task_overdue"
  | "task_completed"
  | "comment_added"
  | "mention"
  | "workspace_invite"
  | "workspace_role_changed";

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  notification_type: NotificationType;
  read: boolean;
  created_at: string;
  updated_at: string;
}
