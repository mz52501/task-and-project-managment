class ProjectsController < ApplicationController
  before_action :set_project, only: [ :show, :update, :destroy ]

  def index
    owned = Project.joins(:project_members)
                   .where(project_members: { user_id: @current_user.id, role: "owner" })
    member = Project.joins(:project_members)
                    .where(project_members: { user_id: @current_user.id })
                    .where.not(project_members: { role: "owner" })
    render json: {
      owned: serialize_projects(owned),
      member: serialize_projects(member)
    }
  end

  def show
    members = @project.project_members.includes(:user).map do |pm|
      {
        id: pm.id,
        user_id: pm.user_id,
        role: pm.role,
        name: "#{pm.user.first_name} #{pm.user.last_name}",
        initials: "#{pm.user.first_name[0]}#{pm.user.last_name[0]}"
      }
    end

    stages = @project.workflow_stages.order(:position).map do |s|
      { id: s.id, name: s.name, position: s.position }
    end

    tags = @project.tags.map do |t|
      { id: t.id, name: t.name, color: t.color }
    end

    render json: @project.as_json.merge(
      members: members,
      stages: stages,
      tags: tags,
      total_tasks: @project.tasks.count,
      completed_tasks: @project.tasks.joins(:workflow_stage)
                                .where(workflow_stages: { name: "Done" }).count
    )
  end

  def create
    project = Project.new(project_params)
    if project.save
      project.project_members.create!(user: @current_user, role: "owner")
      render json: project, status: :created
    else
      render json: { errors: project.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @project.update(project_params)
      render json: @project
    else
      render json: { errors: @project.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @project.destroy
    head :no_content
  end

  private

  def set_project
    @project = Project.find(params[:id])
  end

  def project_params
    params.permit(:name, :description, :status, :deadline)
  end

  def serialize_projects(projects)
    projects.map do |p|
      p.as_json.merge(
        total_tasks: p.tasks.count,
        completed_tasks: p.tasks.joins(:workflow_stage)
                          .where(workflow_stages: { name: "Done" }).count,
        team_members: p.project_members.count
      )
    end
  end
end
