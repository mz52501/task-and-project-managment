class DropSubtasks < ActiveRecord::Migration[8.1]
  def change
    drop_table :subtasks
  end
end
