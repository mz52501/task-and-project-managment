class TaskTagsController < ApplicationController
  before_action :set_task

  def create
    task_tag = @task.task_tags.new(tag_id: params[:tag_id])

    if task_tag.save
      render json: @task.tags, status: :created
    else
      render json: { errors: task_tag.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    task_tag = @task.task_tags.find_by!(tag_id: params[:id])
    task_tag.destroy
    head :no_content
  end

  private

  def set_task
    @task = Task.find(params[:task_id])
  end
end
