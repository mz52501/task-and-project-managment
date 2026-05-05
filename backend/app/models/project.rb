class Project < ApplicationRecord
  enum :status, { active: 0, on_hold: 1, completed: 2, archived: 3 }, default: :active

  has_many :project_members, dependent: :destroy
  has_many :users, through: :project_members
  has_many :tasks, dependent: :destroy
  has_many :task_workflows, dependent: :destroy
  has_many :activity_logs, dependent: :destroy

  validates :name, presence: true
end
