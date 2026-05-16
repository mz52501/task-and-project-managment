class TasksController < ApplicationController
  before_action :set_task, only: [ :show, :update, :destroy ]

  def index
    if params[:parent_task_id]
      tasks = Task.where(parent_task_id: params[:parent_task_id])
      render json: tasks
    else
      assigned = Task.where(assigned_to_id: @current_user.id)
      created = Task.where(created_by_id: @current_user.id)
      render json: { assigned: assigned, created: created }
    end
  end

  def show
    render json: @task
  end

  def create
    task = Task.new(task_params)
    task.created_by = @current_user

    if task.save
      render json: task, status: :created
    else
      render json: { errors: task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @task.update(task_params)
      render json: @task
    else
      render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @task.destroy
    head :no_content
  end

  private

  def set_task
    @task = Task.find(params[:id])
  end

  def task_params
    params.permit(:title, :description, :status, :priority, :due_date, :project_id, :parent_task_id, :workflow_stage_id)
  end
end
