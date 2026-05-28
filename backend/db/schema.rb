# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_05_28_205207) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"
  enable_extension "pgcrypto"

  create_table "active_timers", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "started_at", null: false
    t.uuid "task_id", null: false
    t.datetime "updated_at", null: false
    t.uuid "user_id", null: false
    t.index ["task_id"], name: "index_active_timers_on_task_id"
    t.index ["user_id"], name: "index_active_timers_on_user_id", unique: true
  end

  create_table "activity_logs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "activity_type", default: "created", null: false
    t.uuid "actor_id", null: false
    t.string "actor_name", null: false
    t.datetime "created_at", null: false
    t.string "link"
    t.jsonb "metadata", default: {}, null: false
    t.datetime "occurred_at", null: false
    t.uuid "subject_id", null: false
    t.string "subject_name", null: false
    t.string "subject_type", null: false
    t.string "summary", null: false
    t.index ["actor_id"], name: "index_activity_logs_on_actor_id"
    t.index ["occurred_at"], name: "index_activity_logs_on_occurred_at"
    t.index ["subject_type", "subject_id"], name: "index_activity_logs_on_subject_type_and_subject_id"
  end

  create_table "attachments", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "attachable_id", null: false
    t.string "attachable_type", null: false
    t.string "content_type"
    t.datetime "created_at", null: false
    t.integer "file_size"
    t.string "filename", null: false
    t.datetime "updated_at", null: false
    t.uuid "uploaded_by_id", null: false
    t.string "url", null: false
    t.index ["attachable_type", "attachable_id"], name: "index_attachments_on_attachable"
    t.index ["attachable_type", "attachable_id"], name: "index_attachments_on_attachable_type_and_attachable_id"
    t.index ["uploaded_by_id"], name: "index_attachments_on_uploaded_by_id"
  end

  create_table "comments", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "content", null: false
    t.datetime "created_at", null: false
    t.uuid "task_id", null: false
    t.datetime "updated_at", null: false
    t.uuid "user_id", null: false
    t.index ["task_id"], name: "index_comments_on_task_id"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "event_attendees", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.uuid "event_id", null: false
    t.string "status", default: "invited", null: false
    t.datetime "updated_at", null: false
    t.uuid "user_id", null: false
    t.index ["event_id", "user_id"], name: "index_event_attendees_on_event_id_and_user_id", unique: true
    t.index ["event_id"], name: "index_event_attendees_on_event_id"
    t.index ["user_id"], name: "index_event_attendees_on_user_id"
  end

  create_table "events", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.uuid "creator_id", null: false
    t.date "event_date", null: false
    t.uuid "project_id"
    t.time "start_time", null: false
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.index ["creator_id"], name: "index_events_on_creator_id"
    t.index ["project_id"], name: "index_events_on_project_id"
  end

  create_table "mentions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.uuid "mentionable_id", null: false
    t.string "mentionable_type", null: false
    t.datetime "updated_at", null: false
    t.uuid "user_id", null: false
    t.index ["mentionable_type", "mentionable_id"], name: "index_mentions_on_mentionable"
    t.index ["user_id", "mentionable_type", "mentionable_id"], name: "index_mentions_on_user_and_mentionable", unique: true
    t.index ["user_id"], name: "index_mentions_on_user_id"
  end

  create_table "notifications", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "message", null: false
    t.boolean "read", default: false, null: false
    t.datetime "updated_at", null: false
    t.uuid "user_id", null: false
    t.index ["user_id"], name: "index_notifications_on_user_id"
  end

  create_table "project_members", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.uuid "project_id", null: false
    t.string "role", default: "developer", null: false
    t.datetime "updated_at", null: false
    t.uuid "user_id", null: false
    t.index ["project_id"], name: "index_project_members_on_project_id"
    t.index ["user_id", "project_id"], name: "index_project_members_on_user_id_and_project_id", unique: true
    t.index ["user_id"], name: "index_project_members_on_user_id"
  end

  create_table "projects", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.date "deadline"
    t.datetime "deleted_at"
    t.text "description"
    t.string "name", null: false
    t.string "status", default: "active", null: false
    t.datetime "updated_at", null: false
    t.index ["deleted_at"], name: "index_projects_on_deleted_at"
  end

  create_table "tags", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "color", default: "#6366f1", null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.uuid "project_id", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id", "name"], name: "index_tags_on_project_id_and_name", unique: true
    t.index ["project_id"], name: "index_tags_on_project_id"
  end

  create_table "task_assignments", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.uuid "task_id", null: false
    t.datetime "updated_at", null: false
    t.uuid "user_id", null: false
    t.index ["task_id", "user_id"], name: "index_task_assignments_on_task_id_and_user_id", unique: true
    t.index ["task_id"], name: "index_task_assignments_on_task_id"
    t.index ["user_id"], name: "index_task_assignments_on_user_id"
  end

  create_table "task_tags", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.uuid "tag_id", null: false
    t.uuid "task_id", null: false
    t.datetime "updated_at", null: false
    t.index ["tag_id"], name: "index_task_tags_on_tag_id"
    t.index ["task_id", "tag_id"], name: "index_task_tags_on_task_id_and_tag_id", unique: true
    t.index ["task_id"], name: "index_task_tags_on_task_id"
  end

  create_table "tasks", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.uuid "created_by_id", null: false
    t.datetime "deleted_at"
    t.text "description"
    t.date "due_date"
    t.integer "estimated_minutes"
    t.uuid "parent_task_id"
    t.string "priority", default: "medium", null: false
    t.uuid "project_id", null: false
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.uuid "workflow_stage_id", null: false
    t.index ["created_by_id"], name: "index_tasks_on_created_by_id"
    t.index ["deleted_at"], name: "index_tasks_on_deleted_at"
    t.index ["parent_task_id"], name: "index_tasks_on_parent_task_id"
    t.index ["project_id"], name: "index_tasks_on_project_id"
    t.index ["workflow_stage_id"], name: "index_tasks_on_workflow_stage_id"
  end

  create_table "time_entries", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "comment"
    t.datetime "created_at", null: false
    t.integer "duration_minutes", null: false
    t.uuid "task_id", null: false
    t.datetime "updated_at", null: false
    t.uuid "user_id", null: false
    t.date "work_date", null: false
    t.index ["task_id"], name: "index_time_entries_on_task_id"
    t.index ["user_id"], name: "index_time_entries_on_user_id"
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "avatar"
    t.datetime "created_at", null: false
    t.datetime "deleted_at"
    t.string "email", null: false
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.string "password_digest", null: false
    t.string "role", default: "developer", null: false
    t.datetime "updated_at", null: false
    t.index ["deleted_at"], name: "index_users_on_deleted_at"
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  create_table "workflow_stages", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.integer "position", null: false
    t.uuid "project_id", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_workflow_stages_on_project_id"
  end

  add_foreign_key "active_timers", "tasks"
  add_foreign_key "active_timers", "users"
  add_foreign_key "activity_logs", "users", column: "actor_id"
  add_foreign_key "attachments", "users", column: "uploaded_by_id"
  add_foreign_key "comments", "tasks"
  add_foreign_key "comments", "users"
  add_foreign_key "event_attendees", "events"
  add_foreign_key "event_attendees", "users"
  add_foreign_key "events", "projects"
  add_foreign_key "events", "users", column: "creator_id"
  add_foreign_key "mentions", "users"
  add_foreign_key "notifications", "users"
  add_foreign_key "project_members", "projects"
  add_foreign_key "project_members", "users"
  add_foreign_key "tags", "projects"
  add_foreign_key "task_assignments", "tasks"
  add_foreign_key "task_assignments", "users"
  add_foreign_key "task_tags", "tags"
  add_foreign_key "task_tags", "tasks"
  add_foreign_key "tasks", "projects"
  add_foreign_key "tasks", "tasks", column: "parent_task_id"
  add_foreign_key "tasks", "users", column: "created_by_id"
  add_foreign_key "tasks", "workflow_stages"
  add_foreign_key "time_entries", "tasks"
  add_foreign_key "time_entries", "users"
  add_foreign_key "workflow_stages", "projects"
end
