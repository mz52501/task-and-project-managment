class Comment < ApplicationRecord
  belongs_to :task
  belongs_to :user

  has_many :mentions, as: :mentionable, dependent: :destroy
  has_many :attachments, as: :attachable, dependent: :destroy

  validates :content, presence: true
end
