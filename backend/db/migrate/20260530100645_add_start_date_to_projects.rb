class AddStartDateToProjects < ActiveRecord::Migration[8.1]
  def change
    add_column :projects, :start_date, :date
  end
end
