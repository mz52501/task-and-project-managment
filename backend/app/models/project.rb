class Project < ApplicationRecord
  enum :status, { active: "active", on_hold: "on_hold", completed: "completed", archived: "archived" }, default: "active"

  include Discard::Model

  has_many :project_members, dependent: :destroy
  has_many :users, through: :project_members
  has_many :tasks, dependent: :destroy
  has_many :workflow_stages, dependent: :destroy
  has_many :tags, dependent: :destroy
  has_many :attachments, as: :attachable, dependent: :destroy

  validates :name, presence: true

  after_create :create_default_stages

  private

  def create_default_stages
    workflow_stages.create!([
      { name: "To Do",       position: 1 },
      { name: "In Progress", position: 2 },
      { name: "Done",        position: 3 }
    ])
  end
end
