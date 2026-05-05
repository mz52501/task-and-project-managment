class CreateTimeEntries < ActiveRecord::Migration[8.1]
  def change
    create_table :time_entries do |t|
      t.references :task, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.integer :duration_minutes, null: false
      t.date :work_date, null: false
      t.text :comment

      t.timestamps
    end
  end
end
