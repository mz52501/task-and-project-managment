class TimeEntriesController < ApplicationController
  def index
    entries = TimeEntry.where(user_id: @current_user.id).order(work_date: :desc)
    render json: entries
  end

  def create
    entry = TimeEntry.new(time_entry_params)
    entry.user = @current_user

    if entry.save
      render json: entry, status: :created
    else
      render json: { errors: entry.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    entry = TimeEntry.find(params[:id])
    if entry.user_id == @current_user.id
      entry.destroy
      head :no_content
    else
      render json: { error: "Forbidden" }, status: :forbidden
    end
  end

  private

  def time_entry_params
    params.permit(:task_id, :duration_minutes, :work_date, :comment)
  end
end
