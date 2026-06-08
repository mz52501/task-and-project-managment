class TaskAssignmentsController < ApplicationController
  before_action :set_task

  def index
    render json: @task.assignees
  end

  def create
    assignment = @task.task_assignments.new(user_id: params[:user_id])

    if assignment.save
      notify_task_assigned(assignment.user)
      render json: @task.assignees, status: :created
    else
      render json: { errors: assignment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    assignment = @task.task_assignments.find_by!(user_id: params[:id])
    assignment.destroy
    head :no_content
  end

  private

  def set_task
    @task = Task.find(params[:task_id])
  end

  def notify_task_assigned(user)
    return if user.id == current_user.id
    Notification.create!(
      user: user,
      message: "#{current_user.first_name} #{current_user.last_name} assigned you to \"#{@task.title}\"",
      notification_type: "task_assigned"
    )
  rescue => e
    Rails.logger.error("Notification failed: #{e.message}")
  end
end
