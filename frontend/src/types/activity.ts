export type ActivityType =
  | "created"
  | "updated"
  | "deleted"
  | "status_changed"
  | "assigned"
  | "unassigned"
  | "commented"
  | "member_added"
  | "member_removed"
  | "time_logged";

export interface ActivityLog {
  id: string;
  actor_id: string;
  actor_name: string;
  activity_type: ActivityType;
  subject_type: string;
  subject_id: string;
  subject_name: string;
  summary: string;
  link?: string;
  metadata: Record<string, unknown>;
  occurred_at: string;
  created_at: string;
}
