class CreateActiveTimers < ActiveRecord::Migration[8.1]
  def change
    create_table :active_timers, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.uuid :user_id, null: false
      t.uuid :task_id, null: false
      t.datetime :started_at, null: false
      t.timestamps
    end

    add_index :active_timers, :user_id, unique: true
    add_index :active_timers, :task_id
    add_foreign_key :active_timers, :users
    add_foreign_key :active_timers, :tasks
  end
end
