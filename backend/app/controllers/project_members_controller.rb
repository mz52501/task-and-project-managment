class ProjectMembersController < ApplicationController
  before_action :set_workspace
  before_action :set_project

  def create
    unless @workspace.workspace_members.exists?(user_id: params[:user_id])
      return render json: { error: "User is not a workspace member" }, status: :unprocessable_entity
    end

    member = @project.project_members.new(user_id: params[:user_id], role: params[:role] || "developer")

    if member.save
      render json: serialize_member(member), status: :created
    else
      render json: { errors: member.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    member = @project.project_members.find_by!(user_id: params[:id])
    member.destroy
    head :no_content
  end

  private

  def set_project
    @project = @workspace.projects.find(params[:project_id])
  end

  def serialize_member(pm)
    user = pm.user
    {
      id: pm.id,
      user_id: pm.user_id,
      role: pm.role,
      name: "#{user.first_name} #{user.last_name}",
      initials: "#{user.first_name[0]}#{user.last_name[0]}"
    }
  end
end
