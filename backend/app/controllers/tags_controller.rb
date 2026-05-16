class TagsController < ApplicationController
  before_action :set_project
  before_action :set_tag, only: [ :update, :destroy ]

  def index
    render json: @project.tags
  end

  def create
    tag = @project.tags.new(tag_params)

    if tag.save
      render json: tag, status: :created
    else
      render json: { errors: tag.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @tag.update(tag_params)
      render json: @tag
    else
      render json: { errors: @tag.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @tag.destroy
    head :no_content
  end

  private

  def set_project
    @project = Project.find(params[:project_id])
  end

  def set_tag
    @tag = @project.tags.find(params[:id])
  end

  def tag_params
    params.permit(:name, :color)
  end
end
