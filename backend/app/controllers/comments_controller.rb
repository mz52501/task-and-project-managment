class CommentsController < ApplicationController
  def index
    task = Task.find(params[:task_id])
    render json: task.comments.includes(:user).order(created_at: :asc).map { |c| serialize(c) }
  end

  def create
    task = Task.find(params[:task_id])
    comment = task.comments.new(content: params[:content], user: @current_user)

    if comment.save
      notify_comment_added(task)
      render json: serialize(comment), status: :created
    else
      render json: { errors: comment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    comment = Comment.find(params[:id])
    if comment.user_id == @current_user.id
      comment.update!(content: params[:content])
      render json: serialize(comment)
    else
      render json: { error: "Forbidden" }, status: :forbidden
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

  private

  def notify_comment_added(task)
    commenter_name = "#{@current_user.first_name} #{@current_user.last_name}"
    task.assignees.reject { |u| u.id == @current_user.id }.each do |user|
      Notification.create!(
        user: user,
        message: "#{commenter_name} commented on \"#{task.title}\"",
        notification_type: "comment_added"
      )
    end
  rescue => e
    Rails.logger.error("Notification failed: #{e.message}")
  end

  def serialize(comment)
    comment.as_json.merge(
      author_name: "#{comment.user.first_name} #{comment.user.last_name}",
      author_initials: "#{comment.user.first_name[0]}#{comment.user.last_name[0]}"
    )
  end
end
