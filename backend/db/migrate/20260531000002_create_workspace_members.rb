class CreateWorkspaceMembers < ActiveRecord::Migration[8.1]
  def change
    create_table :workspace_members, id: :uuid do |t|
      t.references :workspace, null: false, foreign_key: true, type: :uuid
      t.references :user,      null: false, foreign_key: true, type: :uuid
      t.string :role, null: false, default: "member"
      t.timestamps
    end

    add_index :workspace_members, [:workspace_id, :user_id], unique: true
  end
end
