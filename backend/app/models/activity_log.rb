class ActivityLog < ApplicationRecord
  enum :activity_type, {
    created: "created",
    updated: "updated",
    deleted: "deleted",
    status_changed: "status_changed",
    assigned: "assigned",
    unassigned: "unassigned",
    commented: "commented",
    member_added: "member_added",
    member_removed: "member_removed",
    time_logged: "time_logged"
  }

  belongs_to :actor, class_name: "User"

  validates :actor_name, :activity_type, :subject_type, :subject_id,
            :subject_name, :summary, :occurred_at, presence: true
end
