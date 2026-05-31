class TasksController < ApplicationController
  wrap_parameters false
  before_action :set_workspace
  before_action :set_task, only: [:show, :update, :destroy]

  def index
    workspace_project_ids = @workspace.projects.pluck(:id)

    if params[:parent_task_id]
      tasks = Task.where(parent_task_id: params[:parent_task_id])
                  .includes(:workflow_stage, :assignees, :tags, :child_tasks, :time_entries)
      render json: tasks.map { |t| serialize_task(t) }
    elsif params[:project_id]
      tasks = Task.where(project_id: params[:project_id])
                  .includes(:workflow_stage, :assignees, :tags, :child_tasks, :time_entries)
      render json: tasks.map { |t| serialize_task(t) }
    else
      assigned_task_ids = TaskAssignment.where(user_id: current_user.id).pluck(:task_id)
      tasks = Task.includes(:workflow_stage, :project, :tags)
                  .where(project_id: workspace_project_ids, id: assigned_task_ids)
                  .order("due_date ASC NULLS LAST, created_at DESC")

      grouped = tasks.group_by { |t| t.project }
      result = grouped.map do |project, project_tasks|
        {
          project_id:   project.id,
          project_name: project.name,
          tasks: project_tasks.map { |t|
            {
              id:          t.id,
              title:       t.title,
              priority:    t.priority,
              due_date:    t.due_date,
              stage_name:  t.workflow_stage&.name,
              tags:        t.tags.map { |tag| { id: tag.id, name: tag.name } }
            }
          }
        }
      end
      render json: result
    end
  end

  def show
    task = Task.includes(:workflow_stage, :assignees, :tags, :child_tasks, :time_entries, :created_by)
               .find(params[:id])
    stages = WorkflowStage.where(project_id: task.project_id).order(:position)
                          .map { |s| { id: s.id, name: s.name, position: s.position } }
    render json: serialize_task(task).merge(
      project_name: task.project.name,
      created_by_name: "#{task.created_by.first_name} #{task.created_by.last_name}",
      stages: stages
    )
  end

  def create
    task = Task.new(task_params)
    task.created_by = current_user

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
    params.permit(:title, :description, :status, :priority, :due_date, :project_id, :parent_task_id, :workflow_stage_id, :estimated_minutes)
  end

  def serialize_task(t)
    total_minutes = t.time_entries.sum(:duration_minutes)
    hours = total_minutes / 60
    minutes = total_minutes % 60
    time_tracked = total_minutes > 0 ? "#{hours}h #{minutes}m" : nil

    total_stages = WorkflowStage.where(project_id: t.project_id).count

    t.as_json.merge(
      stage_name: t.workflow_stage&.name,
      stage_position: t.workflow_stage&.position,
      total_stages: total_stages,
      assignees: t.assignees.map { |u|
        { id: u.id, name: "#{u.first_name} #{u.last_name}",
          initials: "#{u.first_name[0]}#{u.last_name[0]}" }
      },
      tags: t.tags.map { |tag| { id: tag.id, name: tag.name, color: tag.color } },
      subtask_count: t.child_tasks.count,
      comment_count: t.comments.count,
      time_tracked: time_tracked
    )
  end
end
