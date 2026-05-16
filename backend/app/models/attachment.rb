class Attachment < ApplicationRecord
  belongs_to :attachable, polymorphic: true
  belongs_to :uploaded_by, class_name: "User"

  validates :filename, :url, presence: true
end
