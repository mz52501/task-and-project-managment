class CreateSubtasks < ActiveRecord::Migration[8.1]
  def change
    create_table :subtasks do |t|
      t.references :task, null: false, foreign_key: true
      t.string :title, null: false
      t.integer :status, default: 0, null: false

      t.timestamps
    end
  end
end
