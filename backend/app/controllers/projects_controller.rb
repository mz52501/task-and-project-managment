class ProjectsController < ApplicationController
  before_action :set_project, only: [ :show, :update, :destroy ]

  def index
    owned = Project.joins(:project_members)
                   .where(project_members: { user_id: @current_user.id, role: "owner" })
    member = Project.joins(:project_members)
                    .where(project_members: { user_id: @current_user.id })
                    .where.not(project_members: { role: "owner" })
    render json: { owned: owned, member: member }
  end

  def show
    render json: @project
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
end
