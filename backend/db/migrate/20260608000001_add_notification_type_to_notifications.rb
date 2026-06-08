class AddNotificationTypeToNotifications < ActiveRecord::Migration[8.1]
  def change
    add_column :notifications, :notification_type, :string, null: false, default: "task_assigned"
    add_index :notifications, :notification_type
  end
end
