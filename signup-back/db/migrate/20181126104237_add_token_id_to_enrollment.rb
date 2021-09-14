class AddTokenIdToEnrollment < ActiveRecord::Migration[5.1]
  def change
    add_column :enrollments, :token_id, :string
  end
end
