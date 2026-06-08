import client from "./client";
import {
  WorkspaceMembership,
  WorkspaceMemberDetail,
  WorkspaceInvite,
  InvitePreview,
  Workspace,
} from "@/types";

export const getWorkspaces = async (): Promise<WorkspaceMembership[]> => {
  const response = await client.get<WorkspaceMembership[]>("/workspaces");
  return response.data;
};

export const createWorkspace = async (data: {
  name: string;
  description?: string;
  logo_url?: string;
}): Promise<WorkspaceMembership> => {
  const response = await client.post<WorkspaceMembership>("/workspaces", data);
  return response.data;
};

export const updateWorkspace = async (
  id: string,
  data: { name?: string; description?: string; logo_url?: string }
): Promise<Workspace> => {
  const response = await client.patch<Workspace>(`/workspaces/${id}`, data);
  return response.data;
};

export const deleteWorkspace = async (id: string): Promise<void> => {
  await client.delete(`/workspaces/${id}`);
};

export const getWorkspaceMembers = async (
  workspaceId: string
): Promise<WorkspaceMemberDetail[]> => {
  const response = await client.get<WorkspaceMemberDetail[]>(`/workspaces/${workspaceId}/members`);
  return response.data;
};

export const updateWorkspaceMemberRole = async (
  workspaceId: string,
  memberId: string,
  role: string
): Promise<WorkspaceMemberDetail> => {
  const response = await client.patch<WorkspaceMemberDetail>(
    `/workspaces/${workspaceId}/members/${memberId}`,
    { role }
  );
  return response.data;
};

export const removeWorkspaceMember = async (
  workspaceId: string,
  memberId: string
): Promise<void> => {
  await client.delete(`/workspaces/${workspaceId}/members/${memberId}`);
};

export const getWorkspaceInvites = async (workspaceId: string): Promise<WorkspaceInvite[]> => {
  const response = await client.get<WorkspaceInvite[]>(`/workspaces/${workspaceId}/invites`);
  return response.data;
};

export const createInvite = async (
  workspaceId: string,
  data: { email: string; role: string; project_ids?: string[] }
): Promise<WorkspaceInvite> => {
  const response = await client.post<WorkspaceInvite>(`/workspaces/${workspaceId}/invites`, data);
  return response.data;
};

export const revokeInvite = async (workspaceId: string, inviteId: string): Promise<void> => {
  await client.delete(`/workspaces/${workspaceId}/invites/${inviteId}`);
};

export const getInvitePreview = async (token: string): Promise<InvitePreview> => {
  const response = await client.get<InvitePreview>(`/invite/${token}`);
  return response.data;
};

export const acceptInvite = async (
  token: string,
  data:
    | { action_type: "login"; password: string }
    | { action_type: "register"; first_name: string; last_name: string; password: string }
    | { action_type: "join" }
): Promise<{
  token: string;
  user: { id: string; first_name: string; last_name: string; email: string; role: string };
  workspace: { id: string; name: string };
}> => {
  const response = await client.post(`/invite/${token}/accept`, data);
  return response.data;
};
