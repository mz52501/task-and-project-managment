class CreateWorkflowStages < ActiveRecord::Migration[8.1]
  def change
    create_table :workflow_stages do |t|
      t.references :task_workflow, null: false, foreign_key: true
      t.string :name, null: false
      t.integer :position, null: false

      t.timestamps
    end
  end
end
