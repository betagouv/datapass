class AddReporterToOpinions < ActiveRecord::Migration[7.0]
  def change
    add_column :opinions, :reporter_id, :integer, null: false
  end
end
