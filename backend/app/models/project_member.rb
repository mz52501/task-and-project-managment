class ProjectMember < ApplicationRecord
  enum :role, { owner: "owner", developer: "developer", client: "client" }, default: "developer"

  belongs_to :user
  belongs_to :project

  validates :user_id, uniqueness: { scope: :project_id }
end
