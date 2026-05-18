class Notification < ApplicationRecord
  belongs_to :user

  validates :message, presence: true

  scope :unread, -> { where(read: false) }

  after_create_commit :broadcast_to_user

  private

  def broadcast_to_user
    NotificationsChannel.broadcast_to(user, {
      id: id,
      message: message,
      read: read,
      created_at: created_at
    })
  end
end
