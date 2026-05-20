class ActivityLogsController < ApplicationController
  def index
    user_project_ids = ProjectMember.where(user_id: @current_user.id).pluck(:project_id)
    user_task_ids = Task.where(project_id: user_project_ids, deleted_at: nil).pluck(:id)

    logs = ActivityLog
      .where(
        "(subject_type = 'Project' AND subject_id IN (?)) OR (subject_type = 'Task' AND subject_id IN (?))",
        user_project_ids,
        user_task_ids
      )
      .order(occurred_at: :desc)
      .limit(20)

    render json: logs.map { |l|
      {
        id: l.id,
        actor_name: l.actor_name,
        activity_type: l.activity_type,
        subject_name: l.subject_name,
        subject_type: l.subject_type,
        summary: l.summary,
        occurred_at: l.occurred_at
      }
    }
  end
end
