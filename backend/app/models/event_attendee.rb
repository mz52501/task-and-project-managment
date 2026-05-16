class EventAttendee < ApplicationRecord
  enum :status, { invited: "invited", accepted: "accepted", declined: "declined" }, default: "invited"

  belongs_to :event
  belongs_to :user

  validates :user_id, uniqueness: { scope: :event_id }
end
