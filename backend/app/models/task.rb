class Task < ApplicationRecord
  include Discard::Model

  enum :priority, { low: "low", medium: "medium", high: "high" }, default: "medium"

  belongs_to :project
  belongs_to :created_by, class_name: "User", foreign_key: :created_by_id
  belongs_to :parent_task, class_name: "Task", optional: true
  belongs_to :workflow_stage

  has_many :task_assignments, dependent: :destroy
  has_many :assignees, through: :task_assignments, source: :user
  has_many :child_tasks, class_name: "Task", foreign_key: :parent_task_id, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :time_entries, dependent: :destroy
  has_many :task_tags, dependent: :destroy
  has_many :tags, through: :task_tags
  has_many :mentions, as: :mentionable, dependent: :destroy
  has_many :attachments, as: :attachable, dependent: :destroy

  validates :title, presence: true
end
