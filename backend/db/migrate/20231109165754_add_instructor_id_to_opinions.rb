class AddInstructorIdToOpinions < ActiveRecord::Migration[7.0]
  def change
    add_column :opinions, :instructor_id, :integer, null: false
  end
end
