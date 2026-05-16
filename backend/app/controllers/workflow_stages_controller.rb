class WorkflowStagesController < ApplicationController
  before_action :set_project
  before_action :set_stage, only: [ :update, :destroy ]

  def index
    render json: @project.workflow_stages.order(:position)
  end

  def create
    stage = @project.workflow_stages.new(stage_params)

    if stage.save
      render json: stage, status: :created
    else
      render json: { errors: stage.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @stage.update(stage_params)
      render json: @stage
    else
      render json: { errors: @stage.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @stage.destroy
    head :no_content
  end

  private

  def set_project
    @project = Project.find(params[:project_id])
  end

  def set_stage
    @stage = @project.workflow_stages.find(params[:id])
  end

  def stage_params
    params.permit(:name, :position)
  end
end
