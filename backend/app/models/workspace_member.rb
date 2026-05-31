class WorkspaceMember < ApplicationRecord
  belongs_to :workspace
  belongs_to :user

  enum :role, { admin: "admin", member: "member" }, default: "member"

  validates :user_id, uniqueness: { scope: :workspace_id }
end
