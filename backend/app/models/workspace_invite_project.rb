class WorkspaceInviteProject < ApplicationRecord
  belongs_to :workspace_invite
  belongs_to :project
end
