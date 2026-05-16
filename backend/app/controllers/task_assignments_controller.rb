class TaskAssignmentsController < ApplicationController
  before_action :set_task

  def index
    render json: @task.assignees
  end

  def create
    assignment = @task.task_assignments.new(user_id: params[:user_id])

    if assignment.save
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
end
