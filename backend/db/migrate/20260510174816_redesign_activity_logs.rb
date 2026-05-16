class RedesignActivityLogs < ActiveRecord::Migration[8.1]
  def change
    drop_table :activity_logs

    create_table :activity_logs, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.references :actor, null: false, foreign_key: { to_table: :users }, type: :uuid
      t.string :actor_name, null: false
      t.integer :activity_type, null: false
      t.string :subject_type, null: false
      t.uuid :subject_id, null: false
      t.string :subject_name, null: false
      t.string :summary, null: false
      t.string :link
      t.jsonb :metadata, null: false, default: {}
      t.datetime :occurred_at, null: false
      t.datetime :created_at, null: false
    end

    add_index :activity_logs, [ :subject_type, :subject_id ]
    add_index :activity_logs, :occurred_at
  end
end
