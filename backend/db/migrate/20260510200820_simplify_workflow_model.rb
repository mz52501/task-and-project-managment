class SimplifyWorkflowModel < ActiveRecord::Migration[8.1]
  def change
    # workflow_stages: swap task_workflow_id → project_id
    add_reference :workflow_stages, :project, null: false, foreign_key: true, type: :uuid, default: nil
    remove_reference :workflow_stages, :task_workflow, foreign_key: true

    # tasks: remove status, make workflow_stage_id required
    remove_column :tasks, :status, :string
    change_column_null :tasks, :workflow_stage_id, false

    # drop task_workflows
    drop_table :task_workflows
  end
end
