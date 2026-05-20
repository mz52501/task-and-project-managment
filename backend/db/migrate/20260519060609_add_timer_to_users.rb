class AddTimerToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :timer_started_at, :datetime
    add_column :users, :timer_task_id, :uuid
  end
end
