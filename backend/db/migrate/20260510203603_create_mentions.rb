class CreateMentions < ActiveRecord::Migration[8.1]
  def change
    create_table :mentions, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.references :mentionable, polymorphic: true, null: false, type: :uuid
      t.timestamps
    end
    add_index :mentions, [ :user_id, :mentionable_type, :mentionable_id ], unique: true, name: "index_mentions_on_user_and_mentionable"
  end
end
