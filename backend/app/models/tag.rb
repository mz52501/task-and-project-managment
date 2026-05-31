class Tag < ApplicationRecord
  belongs_to :project
  has_many :task_tags, dependent: :destroy
  has_many :tasks, through: :task_tags

  validates :name, presence: true, uniqueness: { scope: :project_id }
end
