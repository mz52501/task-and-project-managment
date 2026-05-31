class UsersController < ApplicationController
  wrap_parameters false

  before_action :set_workspace, only: [:index]

  def index
    users = @workspace.members.select(:id, :first_name, :last_name, :email, :role)
    render json: users
  end

  def show
    user = User.find(params[:id])
    render json: user.slice(:id, :first_name, :last_name, :email, :role)
  end

  def me
    render json: me_payload(current_user)
  end

  def update_me
    if current_user.update(me_params)
      render json: me_payload(current_user)
    else
      render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def me_params
    params.permit(:first_name, :last_name, :email, :current_workspace_id)
  end

  def me_payload(user)
    projects_count = ProjectMember.where(user_id: user.id).count
    tasks_completed = Task.joins(:workflow_stage)
                          .where(workflow_stages: { name: "Done" })
                          .where(id: TaskAssignment.where(user_id: user.id).select(:task_id))
                          .count
    hours_logged = TimeEntry.where(user_id: user.id).sum(:duration_minutes) / 60.0

    {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      current_workspace_id: user.current_workspace_id,
      member_since: user.created_at.strftime("%B %d, %Y"),
      projects_count: projects_count,
      tasks_completed: tasks_completed,
      hours_logged: hours_logged.round(1),
    }
  end
end
