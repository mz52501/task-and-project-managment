class EventsController < ApplicationController
  def index
    events = Event.where(creator: @current_user)
                  .or(Event.joins(:event_attendees).where(event_attendees: { user_id: @current_user.id }))
                  .distinct
                  .order(event_date: :asc)
    render json: events
  end

  def create
    event = Event.new(event_params)
    event.creator = @current_user

    if event.save
      render json: event, status: :created
    else
      render json: { errors: event.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    event = Event.find(params[:id])
    if event.creator_id == @current_user.id
      event.destroy
      head :no_content
    else
      render json: { error: "Forbidden" }, status: :forbidden
    end
  end

  private

  def event_params
    params.permit(:title, :event_date, :start_time, :project_id)
  end
end
