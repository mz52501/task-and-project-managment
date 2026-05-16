class CreateAttachments < ActiveRecord::Migration[8.1]
  def change
    create_table :attachments, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.references :attachable, polymorphic: true, null: false, type: :uuid
      t.references :uploaded_by, null: false, foreign_key: { to_table: :users }, type: :uuid
      t.string :filename, null: false
      t.string :url, null: false
      t.integer :file_size
      t.string :content_type
      t.timestamps
    end
    add_index :attachments, [ :attachable_type, :attachable_id ]
  end
end
