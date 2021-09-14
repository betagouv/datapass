class AddAutorisationLegaleToEnrollments < ActiveRecord::Migration[5.1]
  def change
    add_column :enrollments, :autorisation_legale, :boolean
  end
end
