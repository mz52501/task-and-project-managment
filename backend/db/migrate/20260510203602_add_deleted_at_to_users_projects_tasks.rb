class AddDeletedAtToUsersProjectsTasks < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :deleted_at, :datetime
    add_column :projects, :deleted_at, :datetime
    add_column :tasks, :deleted_at, :datetime

    add_index :users, :deleted_at
    add_index :projects, :deleted_at
    add_index :tasks, :deleted_at
  end
end
