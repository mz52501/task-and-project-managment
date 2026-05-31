class CreateWorkspaces < ActiveRecord::Migration[8.1]
  def change
    create_table :workspaces, id: :uuid do |t|
      t.string :name,        null: false
      t.string :description
      t.string :logo_url
      t.timestamps
    end
  end
end
