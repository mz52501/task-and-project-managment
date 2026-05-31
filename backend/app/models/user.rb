class User < ApplicationRecord
  include Discard::Model

  has_secure_password

  enum :role, { admin: "admin", developer: "developer", client: "client" }, default: "developer"

  has_many :workspace_members, dependent: :destroy
  has_many :workspaces, through: :workspace_members
  belongs_to :current_workspace, class_name: "Workspace", optional: true

  has_many :project_members, dependent: :destroy
  has_many :projects, through: :project_members
  has_many :created_tasks, class_name: "Task", foreign_key: :created_by_id, dependent: :nullify
  has_many :comments, dependent: :destroy
  has_many :time_entries, dependent: :destroy
  has_many :notifications, dependent: :destroy
  has_many :activity_logs, foreign_key: :actor_id, dependent: :destroy
  has_many :mentions, dependent: :destroy

  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :first_name, :last_name, presence: true
  validates :password, length: { minimum: 6 }, if: -> { password.present? }
end
