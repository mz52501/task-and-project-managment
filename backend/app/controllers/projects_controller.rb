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
      { id: t.id, name: t.name }
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
    ActiveRecord::Base.transaction do
      project.save!
      project.project_members.create!(user: @current_user, role: "owner")

      Array(params[:members]).each do |m|
        user_id = m[:user_id] || m["user_id"]
        role = m[:role] || m["role"] || "developer"
        next if user_id.blank? || user_id.to_s == @current_user.id.to_s
        user = User.find_by(id: user_id)
        project.project_members.create!(user: user, role: role) if user
      end

      Array(params[:tags]).reject(&:blank?).each do |tag_name|
        project.tags.create!(name: tag_name)
      end
    end
    render json: project, status: :created
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
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
    params.permit(:name, :description, :status, :deadline, :start_date)
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
