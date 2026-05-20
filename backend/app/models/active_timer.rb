class ActiveTimer < ApplicationRecord
  belongs_to :user
  belongs_to :task

  validates :started_at, presence: true
end
