class RemoveTimerColumnsFromUsers < ActiveRecord::Migration[8.1]
  def change
    remove_column :users, :timer_started_at, :datetime
    remove_column :users, :timer_task_id, :uuid
  end
end
