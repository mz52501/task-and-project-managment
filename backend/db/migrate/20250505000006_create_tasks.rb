class CreateTasks < ActiveRecord::Migration[8.1]
  def change
    create_table :tasks do |t|
      t.string :title, null: false
      t.text :description
      t.integer :status, default: 0, null: false
      t.integer :priority, default: 1, null: false
      t.date :due_date
      t.references :project, null: false, foreign_key: true
      t.references :assigned_to, foreign_key: { to_table: :users }
      t.references :created_by, null: false, foreign_key: { to_table: :users }
      t.references :parent_task, foreign_key: { to_table: :tasks }
      t.references :workflow_stage, foreign_key: true

      t.timestamps
    end
  end
end
