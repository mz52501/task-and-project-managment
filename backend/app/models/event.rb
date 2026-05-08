class Event < ApplicationRecord
  belongs_to :creator, class_name: "User"
  belongs_to :project, optional: true
  has_many :event_attendees, dependent: :destroy
  has_many :attendees, through: :event_attendees, source: :user

  validates :title, presence: true
  validates :event_date, :start_time, presence: true
end
