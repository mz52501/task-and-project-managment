class WorkspaceInvitesController < ApplicationController
  before_action :set_workspace
  before_action :require_workspace_admin!

  def index
    invites = @workspace.workspace_invites.active.includes(:projects).map do |invite|
      serialize_invite(invite)
    end
    render json: invites
  end

  def create
    existing = @workspace.workspace_invites.active.find_by(email: params[:email])
    return render json: serialize_invite(existing) if existing

    invite = @workspace.workspace_invites.new(
      invited_by: current_user,
      email: params[:email],
      role: params[:role] || "member",
      expires_at: 7.days.from_now
    )

    ActiveRecord::Base.transaction do
      invite.save!
      Array(params[:project_ids]).each do |project_id|
        project = @workspace.projects.find_by(id: project_id)
        invite.workspace_invite_projects.create!(project: project) if project
      end
    end

    render json: serialize_invite(invite), status: :created
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  end

  def destroy
    invite = @workspace.workspace_invites.find(params[:id])
    invite.destroy
    head :no_content
  end

  private

  def serialize_invite(invite)
    frontend_base = ENV.fetch("FRONTEND_URL", "http://localhost:5173")
    invite.as_json.merge(
      invite_url: "#{frontend_base}/invite/#{invite.token}",
      invited_by_name: "#{invite.invited_by.first_name} #{invite.invited_by.last_name}",
      project_ids: invite.workspace_invite_projects.pluck(:project_id)
    )
  end
end
