class User < ApplicationRecord
  has_secure_password

  enum :role, { admin: 0, developer: 1, client: 2 }, default: :developer

  has_many :project_members, dependent: :destroy
  has_many :projects, through: :project_members
  has_many :assigned_tasks, class_name: "Task", foreign_key: :assigned_to_id, dependent: :nullify
  has_many :created_tasks, class_name: "Task", foreign_key: :created_by_id, dependent: :nullify
  has_many :comments, dependent: :destroy
  has_many :time_entries, dependent: :destroy
  has_many :notifications, dependent: :destroy
  has_many :activity_logs, dependent: :destroy

  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :first_name, :last_name, presence: true
  validates :password, length: { minimum: 6 }, if: -> { password.present? }
end
