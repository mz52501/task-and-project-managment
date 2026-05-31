class AddWorkspaceToProjectsAndUsers < ActiveRecord::Migration[8.1]
  def change
    add_reference :projects, :workspace, null: false, foreign_key: true, type: :uuid

    add_column :users, :current_workspace_id, :uuid
    add_foreign_key :users, :workspaces, column: :current_workspace_id
  end
end
