import client from "./client";
import { Project, CreateProjectRequest, WorkflowStage, Tag } from "@/types";

export interface ProjectWithCounts extends Project {
  total_tasks: number;
  completed_tasks: number;
  team_members: number;
}

export interface ProjectMemberDetail {
  id: string;
  user_id: string;
  role: string;
  name: string;
  initials: string;
}

export interface ProjectDetail extends Project {
  members: ProjectMemberDetail[];
  stages: WorkflowStage[];
  tags: Tag[];
  total_tasks: number;
  completed_tasks: number;
}

export interface ProjectsResponse {
  owned: ProjectWithCounts[];
  member: ProjectWithCounts[];
}

export const getProjects = async (): Promise<ProjectsResponse> => {
  const response = await client.get<ProjectsResponse>("/projects");
  return response.data;
};

export const getProject = async (id: string): Promise<ProjectDetail> => {
  const response = await client.get<ProjectDetail>(`/projects/${id}`);
  return response.data;
};

export const createProject = async (data: CreateProjectRequest): Promise<Project> => {
  const response = await client.post<Project>("/projects", data);
  return response.data;
};

export const updateProject = async (
  id: string,
  data: Partial<CreateProjectRequest>
): Promise<Project> => {
  const response = await client.patch<Project>(`/projects/${id}`, data);
  return response.data;
};

export const deleteProject = async (id: string): Promise<void> => {
  await client.delete(`/projects/${id}`);
};
