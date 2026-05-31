class WorkspacesController < ApplicationController
  before_action :set_workspace, only: [:show, :update, :destroy]

  def index
    workspaces = current_user.workspace_members.includes(:workspace).map do |wm|
      wm.workspace.as_json.merge(role: wm.role)
    end
    render json: workspaces
  end

  def show
    render json: @workspace
  end

  def create
    workspace = Workspace.new(workspace_params)
    ActiveRecord::Base.transaction do
      workspace.save!
      WorkspaceMember.create!(workspace: workspace, user: current_user, role: "admin")
      current_user.update!(current_workspace_id: workspace.id)
    end
    render json: workspace.as_json.merge(role: "admin"), status: :created
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  end

  def update
    before_action_result = require_workspace_admin!
    return if performed?
    if @workspace.update(workspace_params)
      render json: @workspace
    else
      render json: { errors: @workspace.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    require_workspace_admin!
    return if performed?
    @workspace.destroy
    head :no_content
  end

  private

  def workspace_params
    params.permit(:name, :description, :logo_url)
  end
end
