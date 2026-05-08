import client from "./client";
import { Project, CreateProjectRequest } from "@/types";

export interface ProjectsResponse {
  owned: Project[];
  member: Project[];
}

export const getProjects = async (): Promise<ProjectsResponse> => {
  const response = await client.get<ProjectsResponse>("/projects");
  return response.data;
};

export const getProject = async (id: number): Promise<Project> => {
  const response = await client.get<Project>(`/projects/${id}`);
  return response.data;
};

export const createProject = async (data: CreateProjectRequest): Promise<Project> => {
  const response = await client.post<Project>("/projects", data);
  return response.data;
};

export const updateProject = async (id: number, data: Partial<CreateProjectRequest>): Promise<Project> => {
  const response = await client.patch<Project>(`/projects/${id}`, data);
  return response.data;
};

export const deleteProject = async (id: number): Promise<void> => {
  await client.delete(`/projects/${id}`);
};
