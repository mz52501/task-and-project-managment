import { User } from "./auth";

export type ProjectStatus = "planning" | "active" | "on_hold" | "completed" | "archived";
export type MemberRole = "owner" | "developer" | "client";

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  deadline?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: MemberRole;
  user?: User;
}

export interface ProjectMemberInput {
  user_id: string;
  role: MemberRole;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  status?: ProjectStatus;
  deadline?: string;
  start_date?: string;
  members?: ProjectMemberInput[];
  tags?: string[];
}

export interface Tag {
  id: string;
  project_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface WorkflowStage {
  id: string;
  project_id: string;
  name: string;
  position: number;
  created_at: string;
}
