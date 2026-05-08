class Subtask < ApplicationRecord
  enum :status, { to_do: 0, in_progress: 1, done: 2 }, default: :to_do

  belongs_to :task

  validates :title, presence: true
end
