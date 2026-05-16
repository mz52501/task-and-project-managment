class CreateTagsAndTaskTags < ActiveRecord::Migration[8.1]
  def change
    create_table :tags, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.references :project, null: false, foreign_key: true, type: :uuid
      t.string :name, null: false
      t.string :color, null: false, default: "#6366f1"
      t.timestamps
    end
    add_index :tags, [ :project_id, :name ], unique: true

    create_table :task_tags, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.references :task, null: false, foreign_key: true, type: :uuid
      t.references :tag, null: false, foreign_key: true, type: :uuid
      t.timestamps
    end
    add_index :task_tags, [ :task_id, :tag_id ], unique: true
  end
end
