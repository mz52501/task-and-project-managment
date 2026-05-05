class Task < ApplicationRecord
  enum :status, { to_do: 0, in_progress: 1, done: 2 }, default: :to_do
  enum :priority, { low: 0, medium: 1, high: 2 }, default: :medium

  belongs_to :project
  belongs_to :assigned_to, class_name: "User", foreign_key: :assigned_to_id, optional: true
  belongs_to :created_by, class_name: "User", foreign_key: :created_by_id
  belongs_to :parent_task, class_name: "Task", optional: true
  belongs_to :workflow_stage, optional: true

  has_many :subtasks, class_name: "Task", foreign_key: :parent_task_id, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :time_entries, dependent: :destroy

  validates :title, presence: true
end
