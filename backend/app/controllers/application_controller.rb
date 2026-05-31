class ApplicationController < ActionController::API
  before_action :authenticate_request!

  private

  def authenticate_request!
    header = request.headers["Authorization"]
    token = header&.split(" ")&.last
    raise StandardError, "Missing token" unless token

    @current_user_payload = JsonWebToken.decode(token)
    @current_user = User.find(@current_user_payload[:id])
  rescue StandardError => e
    render json: { error: "Unauthorized: #{e.message}" }, status: :unauthorized
  end

  def current_user
    @current_user
  end

  def set_workspace
    @workspace = Workspace.find(params[:workspace_id])
    wm = WorkspaceMember.find_by(workspace_id: @workspace.id, user_id: current_user.id)
    render json: { error: "Forbidden" }, status: :forbidden unless wm
  end

  def require_workspace_admin!
    wm = WorkspaceMember.find_by(workspace_id: @workspace.id, user_id: current_user.id)
    render json: { error: "Forbidden" }, status: :forbidden unless wm&.admin?
  end
end
