class Workspace < ApplicationRecord
  has_many :workspace_members, dependent: :destroy
  has_many :members, through: :workspace_members, source: :user
  has_many :projects, dependent: :destroy
  has_many :workspace_invites, dependent: :destroy

  validates :name, presence: true
end
