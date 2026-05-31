class ActivityLogsController < ApplicationController
  before_action :set_workspace

  def index
    workspace_project_ids = @workspace.projects.pluck(:id)
    user_project_ids = ProjectMember.where(user_id: current_user.id, project_id: workspace_project_ids).pluck(:project_id)
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
