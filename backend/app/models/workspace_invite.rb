class WorkspaceInvite < ApplicationRecord
  belongs_to :workspace
  belongs_to :invited_by, class_name: "User"
  has_many :workspace_invite_projects, dependent: :destroy
  has_many :projects, through: :workspace_invite_projects

  enum :status, { pending: "pending", accepted: "accepted", expired: "expired" }, default: "pending"

  validates :email, :token, :expires_at, presence: true
  validates :token, uniqueness: true

  before_validation :generate_token, on: :create

  scope :active, -> { pending.where("expires_at > ?", Time.current) }

  private

  def generate_token
    self.token ||= SecureRandom.urlsafe_base64(32)
  end
end
