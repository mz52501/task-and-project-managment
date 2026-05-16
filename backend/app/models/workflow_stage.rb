class WorkflowStage < ApplicationRecord
  belongs_to :project
  has_many :tasks, dependent: :nullify

  validates :name, presence: true
  validates :position, presence: true, numericality: { only_integer: true }
end
