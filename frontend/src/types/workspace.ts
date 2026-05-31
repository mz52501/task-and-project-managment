export type WorkspaceRole = "admin" | "member";

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMembership {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
  role: WorkspaceRole;
}

export interface WorkspaceMemberDetail {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: WorkspaceRole;
  joined_at: string;
}

export interface WorkspaceInvite {
  id: string;
  email: string;
  role: WorkspaceRole;
  status: "pending" | "accepted" | "expired";
  expires_at: string;
  invite_url: string;
  project_ids: string[];
  invited_by_name: string;
}

export interface InvitePreview {
  workspace_name: string;
  invited_by_name: string;
  email: string;
  role: WorkspaceRole;
  existing_account: boolean;
}
