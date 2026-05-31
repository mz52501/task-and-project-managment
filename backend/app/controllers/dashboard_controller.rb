class DashboardController < ApplicationController
  before_action :set_workspace

  def index
    workspace_project_ids = @workspace.projects.pluck(:id)
    user_project_ids = ProjectMember.where(user_id: current_user.id, project_id: workspace_project_ids).pluck(:project_id)
    assigned_task_ids = TaskAssignment.where(user_id: @current_user.id).pluck(:task_id)

    last_stage_ids = WorkflowStage
      .where(project_id: user_project_ids)
      .select("DISTINCT ON (project_id) id")
      .order("project_id, position DESC")
      .pluck(:id)

    render json: {
      stats: build_stats(user_project_ids, assigned_task_ids, last_stage_ids),
      today_focus: build_today_focus(assigned_task_ids, last_stage_ids),
      project_snapshots: build_project_snapshots(user_project_ids),
      weekly_time: build_weekly_time
    }
  end

  private

  def build_stats(user_project_ids, assigned_task_ids, last_stage_ids)
    active_projects = Project
      .where(id: user_project_ids, status: "active")
      .where(deleted_at: nil)
      .count

    tasks_due_soon = Task
      .where(id: assigned_task_ids)
      .where(deleted_at: nil)
      .where("due_date <= ?", Date.today + 7)
      .where.not(workflow_stage_id: last_stage_ids)
      .count

    completed_tasks = Task
      .where(id: assigned_task_ids)
      .where(deleted_at: nil)
      .where(workflow_stage_id: last_stage_ids)
      .count

    team_members = ProjectMember
      .where(project_id: user_project_ids)
      .distinct
      .count(:user_id)

    {
      active_projects: active_projects,
      tasks_due_today: tasks_due_soon,
      completed_tasks: completed_tasks,
      team_members: team_members
    }
  end

  def build_today_focus(assigned_task_ids, last_stage_ids)
    tasks = Task
      .includes(:project, :workflow_stage)
      .where(id: assigned_task_ids)
      .where(deleted_at: nil)
      .where.not(due_date: nil)
      .where.not(workflow_stage_id: last_stage_ids)
      .order(Arel.sql("CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 ELSE 4 END, due_date ASC"))
      .limit(5)

    tasks.map do |t|
      {
        id: t.id,
        title: t.title,
        priority: t.priority,
        due_date: t.due_date,
        project_name: t.project.name,
        project_id: t.project_id,
        stage_name: t.workflow_stage.name
      }
    end
  end

  def build_project_snapshots(user_project_ids)
    projects = Project
      .where(id: user_project_ids, status: "active")
      .where(deleted_at: nil)

    projects.map do |project|
      last_stage = project.workflow_stages.order(:position).last
      total_tasks = Task.where(project_id: project.id, deleted_at: nil).count
      completed_tasks = last_stage ? Task.where(project_id: project.id, workflow_stage_id: last_stage.id, deleted_at: nil).count : 0
      member_count = ProjectMember.where(project_id: project.id).count

      {
        id: project.id,
        name: project.name,
        deadline: project.deadline,
        created_at: project.created_at,
        total_tasks: total_tasks,
        completed_tasks: completed_tasks,
        team_members: member_count
      }
    end
  end

  def build_weekly_time
    today = Date.today
    week_start = today - ((today.wday == 0 ? 7 : today.wday) - 1)
    week_end = week_start + 6

    entries = TimeEntry
      .where(user_id: current_user.id)
      .where(work_date: week_start..week_end)
      .group(:work_date)
      .sum(:duration_minutes)

    day_names = %w[Mon Tue Wed Thu Fri Sat Sun]

    (0..6).map do |i|
      date = week_start + i
      { date: date.to_s, day: day_names[i], minutes: entries[date] || 0 }
    end
  end
end
