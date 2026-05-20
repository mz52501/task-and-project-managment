class TimerController < ApplicationController
  def status
    timer = ActiveTimer.find_by(user_id: @current_user.id)
    if timer
      render json: {
        running: true,
        started_at: timer.started_at,
        task_id: timer.task_id,
        task_title: timer.task.title
      }
    else
      render json: { running: false }
    end
  end

  def start
    task = Task.find_by(id: params[:task_id])
    return render json: { error: "Task not found" }, status: :not_found unless task

    timer = ActiveTimer.find_or_initialize_by(user_id: @current_user.id)
    timer.assign_attributes(task: task, started_at: Time.current)
    timer.save!

    render json: { running: true, started_at: timer.started_at, task_id: task.id, task_title: task.title }
  end

  def stop
    timer = ActiveTimer.find_by(user_id: @current_user.id)
    return render json: { error: "No timer running" }, status: :unprocessable_entity unless timer

    duration_minutes = [(( Time.current - timer.started_at) / 60).round, 1].max

    entry = TimeEntry.create!(
      user: @current_user,
      task_id: timer.task_id,
      duration_minutes: duration_minutes,
      work_date: Date.today,
      comment: "Timer entry"
    )

    timer.destroy!

    render json: { running: false, time_entry: entry }
  end
end
