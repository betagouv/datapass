class AddAdministrationToEnrollments < ActiveRecord::Migration[5.1]
  def change
    add_column :enrollments, :administration, :boolean
  end
end
