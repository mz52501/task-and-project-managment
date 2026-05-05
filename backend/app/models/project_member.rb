class ProjectMember < ApplicationRecord
  enum :role, { owner: 0, developer: 1, client: 2 }, default: :developer

  belongs_to :user
  belongs_to :project

  validates :user_id, uniqueness: { scope: :project_id }
end
