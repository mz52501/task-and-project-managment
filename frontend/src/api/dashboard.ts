import client from "./client";

export interface QuickStats {
  active_projects: number;
  tasks_due_today: number;
  completed_tasks: number;
  team_members: number;
}

export interface TodayFocusTask {
  id: string;
  title: string;
  priority: string;
  due_date: string;
  project_name: string;
  project_id: string;
  stage_name: string;
}

export interface ProjectSnapshot {
  id: string;
  name: string;
  deadline: string | null;
  created_at: string;
  total_tasks: number;
  completed_tasks: number;
  team_members: number;
}

export interface WeeklyTimeDay {
  date: string;
  day: string;
  minutes: number;
}

export interface ActivityLogEntry {
  id: string;
  actor_name: string;
  activity_type: string;
  subject_name: string;
  subject_type: string;
  summary: string;
  occurred_at: string;
}

export interface DashboardData {
  stats: QuickStats;
  today_focus: TodayFocusTask[];
  project_snapshots: ProjectSnapshot[];
  weekly_time: WeeklyTimeDay[];
}

export const getDashboard = async (workspaceId: string): Promise<DashboardData> => {
  const res = await client.get<DashboardData>(`/workspaces/${workspaceId}/dashboard`);
  return res.data;
};

export const getActivityLogs = async (workspaceId: string): Promise<ActivityLogEntry[]> => {
  const res = await client.get<ActivityLogEntry[]>(`/workspaces/${workspaceId}/activity_logs`);
  return res.data;
};
