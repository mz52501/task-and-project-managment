class CreateTaskWorkflows < ActiveRecord::Migration[8.1]
  def change
    create_table :task_workflows do |t|
      t.references :project, null: false, foreign_key: true
      t.string :name, null: false

      t.timestamps
    end
  end
end
