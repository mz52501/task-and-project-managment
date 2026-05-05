class TimeEntry < ApplicationRecord
  belongs_to :task
  belongs_to :user

  validates :duration_minutes, presence: true, numericality: { greater_than: 0 }
  validates :work_date, presence: true
end
