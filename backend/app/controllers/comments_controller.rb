class CommentsController < ApplicationController
  def index
    task = Task.find(params[:task_id])
    render json: task.comments.order(created_at: :asc)
  end

  def create
    task = Task.find(params[:task_id])
    comment = task.comments.new(content: params[:content], user: @current_user)

    if comment.save
      render json: comment, status: :created
    else
      render json: { errors: comment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    comment = Comment.find(params[:id])
    if comment.user_id == @current_user.id
      comment.destroy
      head :no_content
    else
      render json: { error: "Forbidden" }, status: :forbidden
    end
  end
end
