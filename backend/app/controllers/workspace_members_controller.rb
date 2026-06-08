class WorkspaceMembersController < ApplicationController
  before_action :set_workspace

  def index
    members = @workspace.workspace_members.includes(:user).map do |wm|
      {
        id: wm.id,
        user_id: wm.user_id,
        role: wm.role,
        name: "#{wm.user.first_name} #{wm.user.last_name}",
        email: wm.user.email,
        joined_at: wm.created_at
      }
    end
    render json: members
  end

  def update
    require_workspace_admin!
    return if performed?
    wm = @workspace.workspace_members.find(params[:id])
    if wm.update(role: params[:role])
      notify_role_changed(wm)
      render json: { id: wm.id, role: wm.role }
    else
      render json: { errors: wm.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    require_workspace_admin!
    return if performed?
    wm = @workspace.workspace_members.find(params[:id])
    wm.destroy
    head :no_content
  end

  private

  def notify_role_changed(wm)
    return if wm.user_id == current_user.id
    Notification.create!(
      user: wm.user,
      message: "Your role in \"#{@workspace.name}\" was changed to #{wm.role}",
      notification_type: "workspace_role_changed"
    )
  rescue => e
    Rails.logger.error("Notification failed: #{e.message}")
  end
end
