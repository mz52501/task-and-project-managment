class CreateEvents < ActiveRecord::Migration[8.1]
  def change
    create_table :events do |t|
      t.references :creator, null: false, foreign_key: { to_table: :users }
      t.references :project, foreign_key: true
      t.string :title, null: false
      t.date :event_date, null: false
      t.time :start_time, null: false

      t.timestamps
    end
  end
end
