class ConvertEnumsToStrings < ActiveRecord::Migration[8.1]
  def change
    # users.role
    add_column :users, :role_str, :string, null: false, default: "developer"
    execute "UPDATE users SET role_str = CASE role WHEN 0 THEN 'admin' WHEN 1 THEN 'developer' WHEN 2 THEN 'client' END"
    remove_column :users, :role
    rename_column :users, :role_str, :role

    # projects.status
    add_column :projects, :status_str, :string, null: false, default: "active"
    execute "UPDATE projects SET status_str = CASE status WHEN 0 THEN 'active' WHEN 1 THEN 'on_hold' WHEN 2 THEN 'completed' WHEN 3 THEN 'archived' END"
    remove_column :projects, :status
    rename_column :projects, :status_str, :status

    # project_members.role
    add_column :project_members, :role_str, :string, null: false, default: "developer"
    execute "UPDATE project_members SET role_str = CASE role WHEN 0 THEN 'owner' WHEN 1 THEN 'developer' WHEN 2 THEN 'client' END"
    remove_column :project_members, :role
    rename_column :project_members, :role_str, :role

    # tasks.status
    add_column :tasks, :status_str, :string, null: false, default: "to_do"
    execute "UPDATE tasks SET status_str = CASE status WHEN 0 THEN 'to_do' WHEN 1 THEN 'in_progress' WHEN 2 THEN 'done' END"
    remove_column :tasks, :status
    rename_column :tasks, :status_str, :status

    # tasks.priority
    add_column :tasks, :priority_str, :string, null: false, default: "medium"
    execute "UPDATE tasks SET priority_str = CASE priority WHEN 0 THEN 'low' WHEN 1 THEN 'medium' WHEN 2 THEN 'high' END"
    remove_column :tasks, :priority
    rename_column :tasks, :priority_str, :priority

    # event_attendees.status
    add_column :event_attendees, :status_str, :string, null: false, default: "invited"
    execute "UPDATE event_attendees SET status_str = CASE status WHEN 0 THEN 'invited' WHEN 1 THEN 'accepted' WHEN 2 THEN 'declined' END"
    remove_column :event_attendees, :status
    rename_column :event_attendees, :status_str, :status

    # activity_logs.activity_type
    add_column :activity_logs, :activity_type_str, :string, null: false, default: "created"
    execute "UPDATE activity_logs SET activity_type_str = CASE activity_type WHEN 0 THEN 'created' WHEN 1 THEN 'updated' WHEN 2 THEN 'deleted' WHEN 3 THEN 'status_changed' WHEN 4 THEN 'assigned' WHEN 5 THEN 'unassigned' WHEN 6 THEN 'commented' WHEN 7 THEN 'member_added' WHEN 8 THEN 'member_removed' WHEN 9 THEN 'time_logged' END"
    remove_column :activity_logs, :activity_type
    rename_column :activity_logs, :activity_type_str, :activity_type
  end
end
