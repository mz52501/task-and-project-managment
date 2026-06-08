class Notification < ApplicationRecord
  TYPES = %w[
    task_assigned
    task_status_changed
    task_due_soon
    task_overdue
    task_completed
    comment_added
    mention
    workspace_invite
    workspace_role_changed
  ].freeze

  belongs_to :user

  validates :message, presence: true
  validates :notification_type, presence: true, inclusion: { in: TYPES }

  scope :unread, -> { where(read: false) }

  after_create_commit :broadcast_to_user

  private

  def broadcast_to_user
    NotificationsChannel.broadcast_to(user, {
      id: id,
      message: message,
      notification_type: notification_type,
      read: read,
      created_at: created_at
    })
  end
end
