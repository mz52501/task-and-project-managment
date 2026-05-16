class EnableUuidAndRecreateTables < ActiveRecord::Migration[8.1]
  def change
    enable_extension "pgcrypto"

    # Drop all tables leaf → root to respect FK constraints
    drop_table :event_attendees, force: :cascade
    drop_table :task_assignments, force: :cascade
    drop_table :time_entries, force: :cascade
    drop_table :comments, force: :cascade
    drop_table :activity_logs, force: :cascade
    drop_table :notifications, force: :cascade
    drop_table :events, force: :cascade
    drop_table :tasks, force: :cascade
    drop_table :workflow_stages, force: :cascade
    drop_table :task_workflows, force: :cascade
    drop_table :project_members, force: :cascade
    drop_table :projects, force: :cascade
    drop_table :users, force: :cascade

    # Recreate all tables with UUID primary keys — parents before children

    create_table :users, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.string :email, null: false
      t.string :password_digest, null: false
      t.integer :role, default: 1, null: false
      t.string :avatar
      t.timestamps
    end
    add_index :users, :email, unique: true

    create_table :projects, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.string :name, null: false
      t.text :description
      t.integer :status, default: 0, null: false
      t.date :deadline
      t.timestamps
    end

    create_table :project_members, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.references :project, null: false, foreign_key: true, type: :uuid
      t.integer :role, default: 1, null: false
      t.timestamps
    end
    add_index :project_members, [ :user_id, :project_id ], unique: true

    create_table :task_workflows, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.references :project, null: false, foreign_key: true, type: :uuid
      t.string :name, null: false
      t.timestamps
    end

    create_table :workflow_stages, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.references :task_workflow, null: false, foreign_key: true, type: :uuid
      t.string :name, null: false
      t.integer :position, null: false
      t.timestamps
    end

    create_table :tasks, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.string :title, null: false
      t.text :description
      t.integer :status, default: 0, null: false
      t.integer :priority, default: 1, null: false
      t.date :due_date
      t.references :project, null: false, foreign_key: true, type: :uuid
      t.references :created_by, foreign_key: { to_table: :users }, null: false, type: :uuid
      t.references :parent_task, foreign_key: { to_table: :tasks }, type: :uuid
      t.references :workflow_stage, foreign_key: true, type: :uuid
      t.timestamps
    end

    create_table :comments, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.references :task, null: false, foreign_key: true, type: :uuid
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.text :content, null: false
      t.timestamps
    end

    create_table :time_entries, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.references :task, null: false, foreign_key: true, type: :uuid
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.integer :duration_minutes, null: false
      t.date :work_date, null: false
      t.text :comment
      t.timestamps
    end

    create_table :task_assignments, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.references :task, null: false, foreign_key: true, type: :uuid
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.timestamps
    end
    add_index :task_assignments, [ :task_id, :user_id ], unique: true

    create_table :notifications, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.string :message, null: false
      t.boolean :read, default: false, null: false
      t.timestamps
    end

    create_table :activity_logs, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.references :project, foreign_key: true, type: :uuid
      t.string :action, null: false
      t.text :details
      t.timestamps
    end

    create_table :events, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.references :creator, null: false, foreign_key: { to_table: :users }, type: :uuid
      t.references :project, foreign_key: true, type: :uuid
      t.string :title, null: false
      t.date :event_date, null: false
      t.time :start_time, null: false
      t.timestamps
    end

    create_table :event_attendees, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.references :event, null: false, foreign_key: true, type: :uuid
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.integer :status, default: 0, null: false
      t.timestamps
    end
    add_index :event_attendees, [ :event_id, :user_id ], unique: true
  end
end
