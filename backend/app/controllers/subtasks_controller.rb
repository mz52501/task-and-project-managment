class SubtasksController < ApplicationController
  def index
    task = Task.find(params[:task_id])
    render json: task.subtasks
  end

  def create
    task = Task.find(params[:task_id])
    subtask = task.subtasks.new(subtask_params)

    if subtask.save
      render json: subtask, status: :created
    else
      render json: { errors: subtask.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def subtask_params
    params.permit(:title, :status)
  end
end
