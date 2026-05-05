class ProjectMembersController < ApplicationController
  def create
    project = Project.find(params[:project_id])
    member = project.project_members.new(user_id: params[:user_id], role: params[:role] || "developer")

    if member.save
      render json: member, status: :created
    else
      render json: { errors: member.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    project = Project.find(params[:project_id])
    member = project.project_members.find_by!(user_id: params[:id])
    member.destroy
    head :no_content
  end
end
