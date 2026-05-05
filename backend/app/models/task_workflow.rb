class TaskWorkflow < ApplicationRecord
  belongs_to :project
  has_many :workflow_stages, dependent: :destroy

  validates :name, presence: true
end
