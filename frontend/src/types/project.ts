import { User } from "./auth";

export type ProjectStatus = "active" | "on_hold" | "completed" | "archived";
export type MemberRole = "owner" | "developer" | "client";

export interface Project {
  id: number;
  name: string;
  description?: string;
  status: ProjectStatus;
  deadline?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectMember {
  id: number;
  project_id: number;
  user_id: number;
  role: MemberRole;
  user?: User;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  status?: ProjectStatus;
  deadline?: string;
}
