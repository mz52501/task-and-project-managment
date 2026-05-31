class CreateWorkspaceInvites < ActiveRecord::Migration[8.1]
  def change
    create_table :workspace_invites, id: :uuid do |t|
      t.references :workspace,  null: false, foreign_key: true, type: :uuid
      t.references :invited_by, null: false, foreign_key: { to_table: :users }, type: :uuid
      t.string   :email,      null: false
      t.string   :token,      null: false
      t.string   :role,       null: false, default: "member"
      t.string   :status,     null: false, default: "pending"
      t.datetime :expires_at, null: false
      t.datetime :accepted_at
      t.timestamps
    end

    add_index :workspace_invites, :token, unique: true
    add_index :workspace_invites, [:workspace_id, :email]

    create_table :workspace_invite_projects, id: :uuid do |t|
      t.references :workspace_invite, null: false, foreign_key: true, type: :uuid
      t.references :project,          null: false, foreign_key: true, type: :uuid
      t.timestamps
    end

    add_index :workspace_invite_projects, [:workspace_invite_id, :project_id], unique: true, name: "index_invite_projects_on_invite_and_project"
  end
end
