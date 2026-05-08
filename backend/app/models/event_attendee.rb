class EventAttendee < ApplicationRecord
  enum :status, { invited: 0, accepted: 1, declined: 2 }, default: :invited

  belongs_to :event
  belongs_to :user

  validates :user_id, uniqueness: { scope: :event_id }
end
