class NotificationsController < ApplicationController
  def index
    notifications = Notification.where(user_id: @current_user.id).order(created_at: :desc)
    render json: notifications
  end

  def mark_read
    notification = Notification.find(params[:id])
    if notification.user_id == @current_user.id
      notification.update!(read: true)
      render json: notification
    else
      render json: { error: "Forbidden" }, status: :forbidden
    end
  end
end
