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

const base = (workspaceId: string) => `/workspaces/${workspaceId}/projects`;

export const getProjects = async (workspaceId: string): Promise<ProjectsResponse> => {
  const response = await client.get<ProjectsResponse>(base(workspaceId));
  return response.data;
};

export const getProject = async (workspaceId: string, id: string): Promise<ProjectDetail> => {
  const response = await client.get<ProjectDetail>(`${base(workspaceId)}/${id}`);
  return response.data;
};

export const createProject = async (
  workspaceId: string,
  data: CreateProjectRequest
): Promise<Project> => {
  const response = await client.post<Project>(base(workspaceId), data);
  return response.data;
};

export const updateProject = async (
  workspaceId: string,
  id: string,
  data: Partial<CreateProjectRequest>
): Promise<Project> => {
  const response = await client.patch<Project>(`${base(workspaceId)}/${id}`, data);
  return response.data;
};

export const deleteProject = async (workspaceId: string, id: string): Promise<void> => {
  await client.delete(`${base(workspaceId)}/${id}`);
};

export const addProjectMember = async (
  workspaceId: string,
  projectId: string,
  userId: string,
  role: string
): Promise<ProjectMemberDetail> => {
  const response = await client.post<ProjectMemberDetail>(
    `${base(workspaceId)}/${projectId}/members`,
    { user_id: userId, role }
  );
  return response.data;
};
