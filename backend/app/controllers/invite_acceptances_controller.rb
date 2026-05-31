class InviteAcceptancesController < ApplicationController
  skip_before_action :authenticate_request!, only: [:show, :accept]

  def show
    invite = WorkspaceInvite.active.find_by(token: params[:token])
    return render json: { error: "Invalid or expired invite" }, status: :not_found unless invite

    render json: {
      workspace_name: invite.workspace.name,
      invited_by_name: "#{invite.invited_by.first_name} #{invite.invited_by.last_name}",
      email: invite.email,
      role: invite.role,
      existing_account: User.exists?(email: invite.email)
    }
  end

  def accept
    invite = WorkspaceInvite.active.find_by(token: params[:token])
    return render json: { error: "Invalid or expired invite" }, status: :not_found unless invite

    user = resolve_user(invite)
    return if performed?

    ActiveRecord::Base.transaction do
      WorkspaceMember.find_or_create_by!(workspace: invite.workspace, user: user) do |wm|
        wm.role = invite.role
      end

      invite.workspace_invite_projects.includes(:project).each do |wip|
        ProjectMember.find_or_create_by!(project: wip.project, user: user) do |pm|
          pm.role = "developer"
        end
      end

      invite.update!(status: "accepted", accepted_at: Time.current)
      user.update!(current_workspace_id: invite.workspace_id)
    end

    token = JsonWebToken.encode({ id: user.id })
    render json: {
      token: token,
      user: user.slice(:id, :first_name, :last_name, :email, :role),
      workspace: invite.workspace.slice(:id, :name)
    }
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  end

  private

  def resolve_user(invite)
    case params[:action_type]
    when "login"
      user = User.find_by(email: invite.email)
      unless user&.authenticate(params[:password])
        render json: { error: "Invalid credentials" }, status: :unauthorized
        return nil
      end
      user
    when "register"
      user = User.new(
        email: invite.email,
        first_name: params[:first_name],
        last_name: params[:last_name],
        password: params[:password]
      )
      unless user.save
        render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        return nil
      end
      user
    when "join"
      authenticate_request!
      return nil if performed?
      current_user
    else
      render json: { error: "Invalid action" }, status: :unprocessable_entity
      nil
    end
  end
end
